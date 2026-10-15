-- INDEXES DESIGNED FOR SCALABILITY (50,000+ RECORDS BENCHMARK)

-- 1. Index on Refresh Tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- 2. Property Foreign Key & Status Indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- 3. Property Single-Column B-Tree Indexes for Fast Filtering & Sorting
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- 4. Composite B-Tree Indexes for Multi-Attribute Filter Queries (99acres / NoBroker style)
CREATE INDEX IF NOT EXISTS idx_properties_composite_search 
ON properties(status, LOWER(city), property_type, price, bedrooms);

-- 5. Trigram GIN Indexes for Lightning-Fast Location, Locality, and Title Search
CREATE INDEX IF NOT EXISTS idx_properties_trgm_search 
ON properties USING gin ((title || ' ' || locality || ' ' || city) gin_trgm_ops);

-- 6. Inquiries Anti-Spam & Duplicate Prevention Index
CREATE INDEX IF NOT EXISTS idx_inquiries_property_email_time 
ON inquiries(property_id, email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_ip_time 
ON inquiries(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id 
ON inquiries(property_id);
