import { query } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { PropertyFilterParams, PropertyRecord } from '../types';

export class PropertyService {
  /**
   * High performance search & filter designed for 50,000+ records.
   * Utilizes composite B-Tree indexes and GIN trigram indexes.
   */
  static async getProperties(params: PropertyFilterParams) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 100) : 12;
    const offset = (page - 1) * limit;

    const conditions: string[] = ["p.status = 'active'"];
    const values: any[] = [];
    let paramIndex = 1;

    // Filter by City
    if (params.city && params.city.trim() !== '') {
      conditions.push(`LOWER(p.city) = LOWER($${paramIndex})`);
      values.push(params.city.trim());
      paramIndex++;
    }

    // Filter by Property Type
    if (params.propertyType && params.propertyType.trim() !== '') {
      conditions.push(`p.property_type = $${paramIndex}`);
      values.push(params.propertyType.trim());
      paramIndex++;
    }

    // Filter by Listing Type (Sell / Rent)
    if (params.listingType && params.listingType.trim() !== '') {
      conditions.push(`p.listing_type = $${paramIndex}`);
      values.push(params.listingType.trim());
      paramIndex++;
    }

    // Filter by Min Price
    if (params.minPrice !== undefined && params.minPrice !== null && !isNaN(params.minPrice)) {
      conditions.push(`p.price >= $${paramIndex}`);
      values.push(params.minPrice);
      paramIndex++;
    }

    // Filter by Max Price
    if (params.maxPrice !== undefined && params.maxPrice !== null && !isNaN(params.maxPrice)) {
      conditions.push(`p.price <= $${paramIndex}`);
      values.push(params.maxPrice);
      paramIndex++;
    }

    // Filter by Bedrooms
    if (params.bedrooms !== undefined && params.bedrooms !== null && !isNaN(params.bedrooms)) {
      if (params.bedrooms >= 4) {
        conditions.push(`p.bedrooms >= 4`);
      } else {
        conditions.push(`p.bedrooms = $${paramIndex}`);
        values.push(params.bedrooms);
        paramIndex++;
      }
    }

    // Filter by Min/Max Area
    if (params.minArea !== undefined && params.minArea !== null && !isNaN(params.minArea)) {
      conditions.push(`p.area_sqft >= $${paramIndex}`);
      values.push(params.minArea);
      paramIndex++;
    }

    if (params.maxArea !== undefined && params.maxArea !== null && !isNaN(params.maxArea)) {
      conditions.push(`p.area_sqft <= $${paramIndex}`);
      values.push(params.maxArea);
      paramIndex++;
    }

    // Full text / Location Search (Utilizes GIN Trigram index)
    if (params.search && params.search.trim() !== '') {
      const searchTerm = params.search.trim();
      conditions.push(`(
        p.title ILIKE $${paramIndex} OR 
        p.locality ILIKE $${paramIndex} OR 
        p.city ILIKE $${paramIndex} OR
        (p.title || ' ' || p.locality || ' ' || p.city) % $${paramIndex + 1}
      )`);
      values.push(`%${searchTerm}%`);
      values.push(searchTerm);
      paramIndex += 2;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderByClause = 'ORDER BY p.created_at DESC';
    if (params.sortBy === 'price_asc') {
      orderByClause = 'ORDER BY p.price ASC';
    } else if (params.sortBy === 'price_desc') {
      orderByClause = 'ORDER BY p.price DESC';
    } else if (params.sortBy === 'views_desc') {
      orderByClause = 'ORDER BY p.views_count DESC';
    }

    // 1. Optimized Total Count Query
    const countSql = `SELECT COUNT(*) AS total FROM properties p ${whereClause}`;
    const countResult = await query(countSql, values);
    const totalCount = parseInt(countResult.rows[0].total, 10);

    // 2. Data Fetch Query with User/Owner join
    const dataSql = `
      SELECT 
        p.id, p.owner_id, p.title, p.description, p.property_type, p.listing_type,
        p.price, p.bedrooms, p.bathrooms, p.area_sqft, p.furnishing,
        p.city, p.locality, p.address, p.pincode, p.images, p.amenities,
        p.is_featured, p.status, p.views_count, p.created_at, p.updated_at,
        u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataValues = [...values, limit, offset];
    const dataResult = await query<PropertyRecord>(dataSql, dataValues);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      properties: dataResult.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Fetch single property details & increment view count atomically
   */
  static async getPropertyById(id: string) {
    const sql = `
      SELECT 
        p.id, p.owner_id, p.title, p.description, p.property_type, p.listing_type,
        p.price, p.bedrooms, p.bathrooms, p.area_sqft, p.furnishing,
        p.city, p.locality, p.address, p.pincode, p.images, p.amenities,
        p.is_featured, p.status, p.views_count, p.created_at, p.updated_at,
        u.name AS owner_name, u.email AS owner_email, u.phone AS owner_phone
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `;

    const result = await query<PropertyRecord>(sql, [id]);
    if (result.rows.length === 0) {
      throw new AppError('Property not found', 404);
    }

    // Increment views asynchronously
    query('UPDATE properties SET views_count = views_count + 1 WHERE id = $1', [id]).catch(
      (err) => console.error('Failed to increment property views:', err)
    );

    return result.rows[0];
  }

  /**
   * Recommendation Algorithm: Similar Properties
   * Matching criteria:
   * 1. Same City (Primary)
   * 2. Price Band ±20%
   * 3. Same Property Type or ±1 bedroom
   */
  static async getSimilarProperties(propertyId: string, limit = 4) {
    const basePropRes = await query(
      'SELECT id, city, property_type, price, bedrooms FROM properties WHERE id = $1',
      [propertyId]
    );

    if (basePropRes.rows.length === 0) {
      return [];
    }

    const base = basePropRes.rows[0];
    const minPrice = Number(base.price) * 0.8;
    const maxPrice = Number(base.price) * 1.2;

    const sql = `
      SELECT 
        p.id, p.owner_id, p.title, p.property_type, p.listing_type,
        p.price, p.bedrooms, p.bathrooms, p.area_sqft, p.city, p.locality,
        p.images, p.created_at,
        (
          (CASE WHEN LOWER(p.city) = LOWER($2) THEN 40 ELSE 0 END) +
          (CASE WHEN p.property_type = $3 THEN 30 ELSE 0 END) +
          (CASE WHEN p.bedrooms = $4 THEN 20 ELSE 0 END) +
          (CASE WHEN p.price BETWEEN $5 AND $6 THEN 10 ELSE 0 END)
        ) AS similarity_score
      FROM properties p
      WHERE p.id != $1 AND p.status = 'active'
        AND (
          LOWER(p.city) = LOWER($2)
          OR p.property_type = $3
          OR p.price BETWEEN $5 AND $6
        )
      ORDER BY similarity_score DESC, p.created_at DESC
      LIMIT $7
    `;

    const result = await query(sql, [
      propertyId,
      base.city,
      base.property_type,
      base.bedrooms,
      minPrice,
      maxPrice,
      limit,
    ]);

    return result.rows;
  }

  /**
   * Create property listing
   */
  static async createProperty(ownerId: string, data: any) {
    const sql = `
      INSERT INTO properties (
        owner_id, title, description, property_type, listing_type,
        price, bedrooms, bathrooms, area_sqft, furnishing,
        city, locality, address, pincode, images, amenities
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const imagesJson = JSON.stringify(data.images || []);
    const amenitiesJson = JSON.stringify(data.amenities || []);

    const values = [
      ownerId,
      data.title,
      data.description,
      data.property_type,
      data.listing_type || 'Sell',
      data.price,
      data.bedrooms || 1,
      data.bathrooms || 1,
      data.area_sqft,
      data.furnishing || 'Semi-Furnished',
      data.city,
      data.locality,
      data.address || null,
      data.pincode || null,
      imagesJson,
      amenitiesJson,
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Update property listing with ownership verification
   */
  static async updateProperty(id: string, userId: string, data: any) {
    // 1. Ownership check
    const checkRes = await query('SELECT owner_id FROM properties WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      throw new AppError('Property not found', 404);
    }

    if (checkRes.rows[0].owner_id !== userId) {
      throw new AppError('Unauthorized: You can only edit your own listings.', 403);
    }

    // 2. Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const allowedFields = [
      'title',
      'description',
      'property_type',
      'listing_type',
      'price',
      'bedrooms',
      'bathrooms',
      'area_sqft',
      'furnishing',
      'city',
      'locality',
      'address',
      'pincode',
      'status',
    ];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`);
        values.push(data[field]);
        paramIndex++;
      }
    }

    if (data.images !== undefined) {
      fields.push(`images = $${paramIndex}`);
      values.push(JSON.stringify(data.images));
      paramIndex++;
    }

    if (data.amenities !== undefined) {
      fields.push(`amenities = $${paramIndex}`);
      values.push(JSON.stringify(data.amenities));
      paramIndex++;
    }

    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
      // only updated_at
      return this.getPropertyById(id);
    }

    values.push(id);
    const sql = `
      UPDATE properties
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Delete property listing with ownership verification
   */
  static async deleteProperty(id: string, userId: string) {
    const checkRes = await query('SELECT owner_id FROM properties WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      throw new AppError('Property not found', 404);
    }

    if (checkRes.rows[0].owner_id !== userId) {
      throw new AppError('Unauthorized: You can only delete your own listings.', 403);
    }

    await query('DELETE FROM properties WHERE id = $1', [id]);
    return { success: true, message: 'Property listing deleted successfully' };
  }

  /**
   * Get user's own listings
   */
  static async getUserListings(userId: string) {
    const sql = `
      SELECT p.*, 
        (SELECT COUNT(*) FROM inquiries i WHERE i.property_id = p.id) AS inquiries_count
      FROM properties p
      WHERE p.owner_id = $1
      ORDER BY p.created_at DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
  }

  /**
   * Get distinct cities for instant filter dropdowns
   */
  static async getFeaturedCities() {
    const sql = `
      SELECT city, COUNT(*) as count 
      FROM properties 
      WHERE status = 'active' 
      GROUP BY city 
      ORDER BY count DESC 
      LIMIT 10
    `;
    const result = await query(sql);
    return result.rows;
  }
}
