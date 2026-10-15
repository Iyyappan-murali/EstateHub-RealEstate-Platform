import bcrypt from 'bcryptjs';
import { pool, query } from '../config/database';

async function seed() {
  console.log('🌱 Starting database seed with realistic properties...');

  // 1. Create Demo Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const demoUser = await query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ['Rahul Sharma', 'demo@example.com', passwordHash, '+91 9876543210', 'user']
  );

  const agentUser = await query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    ['Priya Verma (Verified Agent)', 'agent@example.com', passwordHash, '+91 9123456789', 'agent']
  );

  const demoUserId = demoUser.rows[0].id;
  const agentUserId = agentUser.rows[0].id;

  console.log(`👤 Users created: Demo User (${demoUserId}), Agent User (${agentUserId})`);

  // Sample realistic property images
  const sampleImages = [
    [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ]
  ];

  const propertiesData = [
    {
      title: 'Luxury 3 BHK Sky Villa with Private Terrace',
      description: 'Experience ultra-luxury living with panoramic views of the city skyline. Features Italian marble flooring, smart home automation, modular kitchen, and double-height ceiling living room.',
      property_type: 'Apartment',
      listing_type: 'Sell',
      price: 24500000,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2150,
      furnishing: 'Fully Furnished',
      city: 'Bangalore',
      locality: 'Indiranagar',
      address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
      pincode: '560038',
      amenities: ['Swimming Pool', 'Gym', 'Clubhouse', '24x7 Security', 'Power Backup', 'Covered Parking', 'EV Charging'],
      images: sampleImages[0],
      is_featured: true,
      owner_id: agentUserId,
    },
    {
      title: 'Spacious 2 BHK Modern Apartment near Metro',
      description: 'Sunlit east-facing apartment situated in a prestigious gated community. Just 500m from the upcoming metro station. Ideal for tech professionals and families.',
      property_type: 'Apartment',
      listing_type: 'Sell',
      price: 9800000,
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1250,
      furnishing: 'Semi-Furnished',
      city: 'Bangalore',
      locality: 'Whitefield',
      address: 'ITPL Main Road, Hope Farm Junction',
      pincode: '560066',
      amenities: ['Gym', 'Children Play Area', 'Jogging Track', 'Lift', '24x7 Security', 'Intercom'],
      images: sampleImages[1],
      is_featured: true,
      owner_id: demoUserId,
    },
    {
      title: 'Exquisite 4 BHK Independent Luxury Villa',
      description: 'Magnificent independent villa with landscaped garden, private plunge pool, and servant quarters. Situated in a serene green gated enclave.',
      property_type: 'Villa',
      listing_type: 'Sell',
      price: 48000000,
      bedrooms: 4,
      bathrooms: 5,
      area_sqft: 4200,
      furnishing: 'Semi-Furnished',
      city: 'Bangalore',
      locality: 'Sarjapur Road',
      address: 'Near Carmelaram Railway Station, Sarjapur Road',
      pincode: '560035',
      amenities: ['Private Pool', 'Landscaped Garden', 'Clubhouse', 'Tennis Court', 'Solar Power', '24x7 CCTV'],
      images: sampleImages[2],
      is_featured: true,
      owner_id: agentUserId,
    },
    {
      title: 'Premium 3 BHK Sea View Residence',
      description: 'Breathtaking Arabian Sea views from your expansive balcony. Located in one of South Mumbai’s most coveted neighborhoods.',
      property_type: 'Apartment',
      listing_type: 'Sell',
      price: 65000000,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 1800,
      furnishing: 'Fully Furnished',
      city: 'Mumbai',
      locality: 'Worli',
      address: 'Sea Face Road, Worli',
      pincode: '400018',
      amenities: ['Sea View', 'Infinity Pool', 'Concierge Service', 'Valet Parking', 'High Speed Elevators', 'Gym'],
      images: sampleImages[3],
      is_featured: true,
      owner_id: agentUserId,
    },
    {
      title: 'Modern 2 BHK Gated Community Flat',
      description: 'Well-planned, Vastu compliant flat in a vibrant gated township with landscaped gardens, indoor games, and hypermarket.',
      property_type: 'Apartment',
      listing_type: 'Rent',
      price: 45000,
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 1100,
      furnishing: 'Semi-Furnished',
      city: 'Mumbai',
      locality: 'Andheri West',
      address: 'Lokhandwala Complex, Andheri West',
      pincode: '400053',
      amenities: ['Clubhouse', 'Swimming Pool', 'Covered Parking', 'Security Guards', 'Piped Gas'],
      images: sampleImages[4],
      is_featured: false,
      owner_id: demoUserId,
    },
    {
      title: 'Lavish 4 BHK Penthouse with Private Terrace',
      description: 'Palatial penthouse offering unobstructed city views, double ceiling heights, master suite with walk-in wardrobe, and jacuzzi.',
      property_type: 'Apartment',
      listing_type: 'Sell',
      price: 52000000,
      bedrooms: 4,
      bathrooms: 4,
      area_sqft: 3600,
      furnishing: 'Fully Furnished',
      city: 'Gurgaon',
      locality: 'Golf Course Road',
      address: 'Sector 54, Golf Course Road',
      pincode: '122002',
      amenities: ['Jacuzzi', 'Private Terrace', 'Golf Course View', 'Smart Automation', 'Power Backup', 'Gym'],
      images: sampleImages[5],
      is_featured: true,
      owner_id: agentUserId,
    },
    {
      title: 'Affordable 1 BHK Studio Apartment',
      description: 'Chic, compact studio apartment ideal for single professionals or students. Low maintenance, high rental yield investment.',
      property_type: 'Apartment',
      listing_type: 'Sell',
      price: 3600000,
      bedrooms: 1,
      bathrooms: 1,
      area_sqft: 550,
      furnishing: 'Fully Furnished',
      city: 'Pune',
      locality: 'Hinjewadi',
      address: 'Phase 1, Hinjewadi IT Park',
      pincode: '411057',
      amenities: ['Lift', '24x7 Security', 'Wi-Fi Enabled', 'Gym', 'Cafeteria'],
      images: sampleImages[0],
      is_featured: false,
      owner_id: demoUserId,
    },
    {
      title: 'Prime Commercial Office Space in Tech Hub',
      description: 'Grade-A commercial office space fitted with 50 workstations, 2 conference rooms, server room, pantry, and reception.',
      property_type: 'Commercial',
      listing_type: 'Rent',
      price: 185000,
      bedrooms: 0,
      bathrooms: 2,
      area_sqft: 2800,
      furnishing: 'Fully Furnished',
      city: 'Hyderabad',
      locality: 'Hitec City',
      address: 'Madhapur, Hitec City',
      pincode: '500081',
      amenities: ['Central AC', 'High Speed Elevators', '100% Power Backup', 'Basement Parking', 'Fire Safety'],
      images: sampleImages[2],
      is_featured: true,
      owner_id: agentUserId,
    },
    {
      title: 'Independent 3 BHK Floor with Stilt Parking',
      description: 'Brand new luxury builder floor with modern elevation, modular kitchen, branded sanitary fittings, and separate utility balcony.',
      property_type: 'Builder Floor',
      listing_type: 'Sell',
      price: 16500000,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 1800,
      furnishing: 'Semi-Furnished',
      city: 'Delhi',
      locality: 'Vasant Kunj',
      address: 'Sector B, Pocket 1, Vasant Kunj',
      pincode: '110070',
      amenities: ['Stilt Parking', 'Lift', 'Terrace Garden', 'Modular Kitchen', 'Gated Colony'],
      images: sampleImages[3],
      is_featured: true,
      owner_id: demoUserId,
    },
    {
      title: 'Charming 3 BHK Villa in Gated Community',
      description: 'Serene independent house situated amidst green surroundings with a private backyard, covered car porch, and spacious balconies.',
      property_type: 'Villa',
      listing_type: 'Sell',
      price: 21000000,
      bedrooms: 3,
      bathrooms: 3,
      area_sqft: 2200,
      furnishing: 'Semi-Furnished',
      city: 'Chennai',
      locality: 'OMR',
      address: 'Old Mahabalipuram Road, Navalur',
      pincode: '600130',
      amenities: ['Swimming Pool', 'Security Guards', 'Badminton Court', 'Water Treatment Plant', 'Kids Play Area'],
      images: sampleImages[4],
      is_featured: false,
      owner_id: agentUserId,
    }
  ];

  for (const prop of propertiesData) {
    await query(
      `INSERT INTO properties (
        owner_id, title, description, property_type, listing_type,
        price, bedrooms, bathrooms, area_sqft, furnishing,
        city, locality, address, pincode, amenities, images, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        prop.owner_id,
        prop.title,
        prop.description,
        prop.property_type,
        prop.listing_type,
        prop.price,
        prop.bedrooms,
        prop.bathrooms,
        prop.area_sqft,
        prop.furnishing,
        prop.city,
        prop.locality,
        prop.address,
        prop.pincode,
        JSON.stringify(prop.amenities),
        JSON.stringify(prop.images),
        prop.is_featured,
      ]
    );
  }

  console.log(`✅ Seeded ${propertiesData.length} showcase properties successfully!`);
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
