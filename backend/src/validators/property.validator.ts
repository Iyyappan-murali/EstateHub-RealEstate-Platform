import { z } from 'zod';

export const propertyTypes = [
  'Apartment',
  'Independent House',
  'Villa',
  'Plot',
  'Commercial',
  'Builder Floor',
  'Studio Apartment',
] as const;

export const listingTypes = ['Sell', 'Rent'] as const;

export const furnishingTypes = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'] as const;

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  property_type: z.enum(propertyTypes),
  listing_type: z.enum(listingTypes).default('Sell'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms cannot be negative').default(1),
  bathrooms: z.coerce.number().int().min(0, 'Bathrooms cannot be negative').default(1),
  area_sqft: z.coerce.number().positive('Area must be greater than 0'),
  furnishing: z.enum(furnishingTypes).default('Semi-Furnished'),
  city: z.string().min(2, 'City is required').max(100),
  locality: z.string().min(2, 'Locality is required').max(150),
  address: z.string().optional(),
  pincode: z.string().optional(),
  amenities: z.array(z.string()).or(z.string().transform((val) => {
    try { return JSON.parse(val); } catch { return []; }
  })).default([]),
  images: z.array(z.string()).default([]),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertySearchSchema = z.object({
  city: z.string().optional(),
  propertyType: z.enum(propertyTypes).optional(),
  listingType: z.enum(listingTypes).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  maxArea: z.coerce.number().positive().optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(['price_asc', 'price_desc', 'created_at_desc', 'views_desc'])
    .default('created_at_desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});
