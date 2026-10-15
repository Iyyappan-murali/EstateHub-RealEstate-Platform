import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { ENV } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { UserPayload } from '../types';

export class AuthService {
  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private static generateAccessToken(user: UserPayload): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      ENV.JWT.SECRET,
      { expiresIn: ENV.JWT.EXPIRES_IN as any }
    );
  }

  private static generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) {
    // 1. Check existing email
    const existing = await query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existing.rows.length > 0) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // 3. Insert user
    const insertResult = await query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role, created_at`,
      [data.name, data.email, passwordHash, data.phone || null, data.role || 'user']
    );

    const user = insertResult.rows[0];
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // 4. Issue tokens
    const accessToken = this.generateAccessToken(userPayload);
    const refreshToken = this.generateRefreshToken();
    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: ENV.JWT.EXPIRES_IN,
      },
    };
  }

  static async login(email: string, password: string) {
    // 1. Find user
    const result = await query(
      `SELECT id, name, email, password_hash, phone, role, created_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password.', 401);
    }

    const user = result.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    // 3. Issue tokens
    const accessToken = this.generateAccessToken(userPayload);
    const refreshToken = this.generateRefreshToken();
    const tokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const { password_hash, ...safeUser } = user;
    return {
      user: safeUser,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: ENV.JWT.EXPIRES_IN,
      },
    };
  }

  static async refresh(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    // Find active refresh token
    const tokenRes = await query(
      `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked,
              u.name, u.email, u.role
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token_hash = $1`,
      [tokenHash]
    );

    if (tokenRes.rows.length === 0) {
      throw new AppError('Invalid refresh token.', 401);
    }

    const record = tokenRes.rows[0];

    if (record.revoked) {
      // Possible token reuse attack: revoke all tokens for this user
      await query('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1', [record.user_id]);
      throw new AppError('Compromised refresh token detected. Please login again.', 401);
    }

    if (new Date(record.expires_at) < new Date()) {
      throw new AppError('Refresh token expired. Please login again.', 401);
    }

    // Revoke old refresh token (Token Rotation)
    await query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [record.id]);

    // Issue new pair
    const userPayload: UserPayload = {
      id: record.user_id,
      email: record.email,
      role: record.role,
      name: record.name,
    };

    const newAccessToken = this.generateAccessToken(userPayload);
    const newRefreshToken = this.generateRefreshToken();
    const newTokenHash = this.hashToken(newRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [record.user_id, newTokenHash, expiresAt]
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: ENV.JWT.EXPIRES_IN,
    };
  }

  static async logout(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);
    await query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash]);
    return { success: true };
  }

  static async getProfile(userId: string) {
    const res = await query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (res.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return res.rows[0];
  }
}
