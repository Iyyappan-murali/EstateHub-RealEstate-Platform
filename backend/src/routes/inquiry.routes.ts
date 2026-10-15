import { Router } from 'express';
import { InquiryController } from '../controllers/inquiry.controller';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware';
import { inquiryLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Submit lead / contact owner (rate-limited for anti-spam)
router.post('/', inquiryLimiter, optionalAuth, InquiryController.createInquiry);

// View inquiries for properties owned by the user
router.get('/my-leads', requireAuth, InquiryController.getOwnerInquiries);

export default router;
