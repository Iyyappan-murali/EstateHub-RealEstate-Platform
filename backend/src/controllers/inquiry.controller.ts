import { Request, Response, NextFunction } from 'express';
import { InquiryService } from '../services/inquiry.service';
import { createInquirySchema } from '../validators/inquiry.validator';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../middleware/error.middleware';

export class InquiryController {
  static async createInquiry(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = createInquirySchema.parse(req.body);

      // Extract client IP address for anti-spam rate limiting
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';

      const inquiry = await InquiryService.createInquiry({
        ...validated,
        user_id: req.user?.id,
        ip_address: ip,
      });

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been sent to the property owner successfully!',
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOwnerInquiries(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const inquiries = await InquiryService.getOwnerInquiries(req.user.id);
      res.status(200).json({
        success: true,
        data: inquiries,
      });
    } catch (error) {
      next(error);
    }
  }
}
