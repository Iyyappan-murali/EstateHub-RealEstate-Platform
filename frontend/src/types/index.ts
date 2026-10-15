export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'agent' | 'builder';
  created_at?: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  property_type: string;
  listing_type: 'Sell' | 'Rent';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  furnishing: string;
  city: string;
  locality: string;
  address?: string;
  pincode?: string;
  images: string[];
  amenities: string[];
  is_featured: boolean;
  status: string;
  views_count: number;
  created_at: string;
  updated_at?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  inquiries_count?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Inquiry {
  id: string;
  property_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  property_title?: string;
  property_price?: number;
  property_city?: string;
}
