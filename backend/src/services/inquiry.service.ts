import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export class InquiryService {
  /**
   * Submit property inquiry with spam and duplicate protection
   */
  static async createInquiry(data: {
    property_id: string;
    user_id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    ip_address: string;
  }) {
    // 1. Check if property exists and is active
    const propRes = await query('SELECT id, owner_id, status FROM properties WHERE id = $1', [
      data.property_id,
    ]);

    if (propRes.rows.length === 0) {
      throw new AppError('Property not found', 404);
    }

    const property = propRes.rows[0];
    if (property.status !== 'active') {
      throw new AppError('This property listing is no longer active.', 400);
    }

    // 2. Prevent property owner from contacting themselves
    if (data.user_id && data.user_id === property.owner_id) {
      throw new AppError('You cannot submit an inquiry on your own property.', 400);
    }

    // 3. Duplicate Prevention: Check if same email contacted this property within the last 2 hours
    const duplicateRes = await query(
      `SELECT id, created_at FROM inquiries 
       WHERE property_id = $1 
         AND LOWER(email) = LOWER($2) 
         AND created_at > NOW() - INTERVAL '2 hours'
       LIMIT 1`,
      [data.property_id, data.email]
    );

    if (duplicateRes.rows.length > 0) {
      throw new AppError(
        'You have already submitted an inquiry for this property recently. The owner has been notified and will reach out to you shortly.',
        429
      );
    }

    // 4. IP-level Spam Protection: Max 5 inquiries per IP in the last 10 minutes
    const ipRecentRes = await query(
      `SELECT COUNT(*) AS count FROM inquiries 
       WHERE ip_address = $1 
         AND created_at > NOW() - INTERVAL '10 minutes'`,
      [data.ip_address]
    );

    if (parseInt(ipRecentRes.rows[0].count, 10) >= 5) {
      throw new AppError(
        'Too many inquiries from your network. Please wait a few minutes before trying again.',
        429
      );
    }

    // 5. Insert Inquiry Record
    const insertRes = await query(
      `INSERT INTO inquiries (property_id, user_id, name, email, phone, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, property_id, name, email, phone, message, created_at`,
      [
        data.property_id,
        data.user_id || null,
        data.name,
        data.email.toLowerCase(),
        data.phone,
        data.message,
        data.ip_address,
      ]
    );

    return insertRes.rows[0];
  }

  /**
   * Get inquiries for listings owned by the authenticated user
   */
  static async getOwnerInquiries(ownerId: string) {
    const sql = `
      SELECT 
        i.id, i.property_id, i.name, i.email, i.phone, i.message, i.created_at, i.status,
        p.title AS property_title, p.price AS property_price, p.city AS property_city
      FROM inquiries i
      JOIN properties p ON i.property_id = p.id
      WHERE p.owner_id = $1
      ORDER BY i.created_at DESC
    `;

    const result = await query(sql, [ownerId]);
    return result.rows;
  }
}
