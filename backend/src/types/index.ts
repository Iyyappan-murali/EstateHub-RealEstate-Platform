import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface PropertyFilterParams {
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minArea?: number;
  maxArea?: number;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'created_at_desc' | 'views_desc';
  page?: number;
  limit?: number;
}

export interface PropertyRecord {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: string;
  listing_type: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  furnishing: string;
  city: string;
  locality: string;
  address: string;
  pincode: string;
  images: string[];
  amenities: string[];
  is_featured: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
}
