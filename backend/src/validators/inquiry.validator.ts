import { z } from 'zod';

export const createInquirySchema = z.object({
  property_id: z.string().uuid('Valid property ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email address').toLowerCase(),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').max(20),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});
