import { pool, query } from '../config/database';

async function seed50k() {
  console.log('🚀 Starting high-volume bulk seed of 50,000+ property records...');
  const startTime = Date.now();

  // Get or create owner user
  let ownerRes = await query('SELECT id FROM users LIMIT 1');
  let ownerId: string;
  if (ownerRes.rows.length === 0) {
    const userRes = await query(
      `INSERT INTO users (name, email, password_hash, phone, role)
       VALUES ('Bulk Seeder', 'bulk_seeder@example.com', '$2a$10$xyz', '+91 9999999999', 'agent')
       RETURNING id`
    );
    ownerId = userRes.rows[0].id;
  } else {
    ownerId = ownerRes.rows[0].id;
  }

  const citiesWithLocalities: Record<string, string[]> = {
    Bangalore: ['Indiranagar', 'Whitefield', 'Koramangala', 'HSR Layout', 'Electronic City', 'Marathahalli', 'Jayanagar', 'Hebbal', 'Sarjapur Road', 'Yelahanka'],
    Mumbai: ['Andheri West', 'Bandra West', 'Worli', 'Powai', 'Juhu', 'Malad West', 'Thane West', 'Goregaon East', 'Borivali', 'Dadar'],
    Delhi: ['Vasant Kunj', 'Dwarka', 'Saket', 'Rohini', 'Hauz Khas', 'Greater Kailash', 'Janakpuri', 'Lajpat Nagar', 'Pitampura', 'Karol Bagh'],
    Hyderabad: ['Hitec City', 'Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills', 'Kondapur', 'Kukatpally', 'Manikonda', 'Miyapur', 'Begumpet'],
    Pune: ['Hinjewadi', 'Wakad', 'Baner', 'Kothrud', 'Viman Nagar', 'Kharadi', 'Hadapsar', 'Aundh', 'Magarpatta', 'Pimple Saudagar'],
    Chennai: ['OMR', 'Velachery', 'Anna Nagar', 'Adyar', 'T Nagar', 'Porur', 'Tambaram', 'Perungudi', 'Guindy', 'Thiruvanmiyur'],
    Gurgaon: ['Golf Course Road', 'Cyber City', 'Sohna Road', 'DLF Phase 5', 'Sector 57', 'Sector 48', 'Sector 82', 'MG Road', 'Sector 14', 'Nirvana Country'],
  };

  const propertyTypes = ['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial', 'Builder Floor', 'Studio Apartment'];
  const furnishings = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
  const listingTypes = ['Sell', 'Rent'];
  const cityKeys = Object.keys(citiesWithLocalities);

  const images = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  ];

  const TOTAL_RECORDS = 50000;
  const BATCH_SIZE = 2000;

  for (let batchStart = 0; batchStart < TOTAL_RECORDS; batchStart += BATCH_SIZE) {
    const batchValues: any[] = [];
    const placeholders: string[] = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      const idx = batchStart + i + 1;
      const city = cityKeys[idx % cityKeys.length];
      const localities = citiesWithLocalities[city];
      const locality = localities[idx % localities.length];
      const propType = propertyTypes[idx % propertyTypes.length];
      const listType = listingTypes[idx % listingTypes.length];
      const furnishing = furnishings[idx % furnishings.length];
      const bedrooms = propType === 'Commercial' ? 0 : (idx % 4) + 1;
      const bathrooms = Math.max(1, bedrooms);
      const area = 450 + (bedrooms * 400) + (idx % 300);

      const price = listType === 'Rent'
        ? 15000 + (bedrooms * 12000) + ((idx % 20) * 1000)
        : 2500000 + (bedrooms * 2800000) + ((idx % 50) * 100000);

      const title = `${bedrooms > 0 ? `${bedrooms} BHK ` : ''}${propType} in ${locality}, ${city}`;
      const description = `Spacious and beautifully maintained ${bedrooms > 0 ? `${bedrooms} BHK ` : ''}${propType.toLowerCase()} available for ${listType.toLowerCase()} in ${locality}, ${city}. Excellent connectivity, modern amenities, water supply, and security.`;
      const propImages = JSON.stringify([images[idx % images.length]]);
      const amenities = JSON.stringify(['Lift', 'Security', 'Power Backup', 'Water Storage', 'Parking']);
      const isFeatured = idx % 20 === 0;

      const offset = i * 16;
      placeholders.push(`(
        $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5},
        $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10},
        $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}
      )`);

      batchValues.push(
        ownerId,
        title,
        description,
        propType,
        listType,
        price,
        bedrooms,
        bathrooms,
        area,
        furnishing,
        city,
        locality,
        `${idx}, Main Road, ${locality}`,
        propImages,
        amenities,
        isFeatured
      );
    }

    const insertSql = `
      INSERT INTO properties (
        owner_id, title, description, property_type, listing_type,
        price, bedrooms, bathrooms, area_sqft, furnishing,
        city, locality, address, images, amenities, is_featured
      )
      VALUES ${placeholders.join(',\n')}
    `;

    await query(insertSql, batchValues);
    console.log(`⚡ Inserted ${batchStart + BATCH_SIZE} / ${TOTAL_RECORDS} properties...`);
  }

  // Refresh PostgreSQL statistics for optimal query plans
  console.log('📊 Running ANALYZE properties to update PostgreSQL query planner statistics...');
  await query('ANALYZE properties');

  const countRes = await query('SELECT COUNT(*) AS total FROM properties');
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n🎉 SUCCESS: Database now has ${countRes.rows[0].total} properties! (Completed in ${elapsed}s)`);

  await pool.end();
}

seed50k().catch((err) => {
  console.error('Bulk seeding failed:', err);
  process.exit(1);
});
