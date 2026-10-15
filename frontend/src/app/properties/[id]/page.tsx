import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Property } from '../../../types';
import { formatPrice, formatArea, getFullImageUrl } from '../../../lib/utils';
import { PropertyCard } from '../../../components/PropertyCard';
import PropertyDetailClient from './PropertyDetailClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getProperty(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      next: { revalidate: 60 }, // ISR (Incremental Static Regeneration)
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
}

async function getSimilarProperties(id: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}/similar?limit=4`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}

// 1. Dynamic SEO Metadata Generation (Requirement 6)
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const property = await getProperty(params.id);
  if (!property) {
    return {
      title: 'Property Not Found | EstateHub',
    };
  }

  const images = Array.isArray(property.images)
    ? property.images
    : typeof property.images === 'string'
    ? JSON.parse(property.images || '[]')
    : [];

  const mainImageUrl = images.length > 0 ? getFullImageUrl(images[0]) : '';
  const formattedPrice = formatPrice(Number(property.price), property.listing_type);

  return {
    title: `${property.title} | ${formattedPrice} | EstateHub`,
    description: `${property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ''}${property.property_type} for ${property.listing_type} in ${property.locality}, ${property.city}. ${property.description.slice(0, 150)}...`,
    keywords: [
      `${property.city} real estate`,
      `${property.locality} property`,
      `${property.bedrooms} BHK in ${property.city}`,
      `${property.property_type} for ${property.listing_type}`,
    ],
    openGraph: {
      title: `${property.title} - ${formattedPrice}`,
      description: property.description.slice(0, 200),
      images: mainImageUrl ? [{ url: mainImageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description.slice(0, 200),
      images: mainImageUrl ? [mainImageUrl] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await getProperty(params.id);
  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(params.id);

  const images: string[] = Array.isArray(property.images)
    ? property.images
    : typeof property.images === 'string'
    ? JSON.parse(property.images || '[]')
    : [];

  const amenities: string[] = Array.isArray(property.amenities)
    ? property.amenities
    : typeof property.amenities === 'string'
    ? JSON.parse(property.amenities || '[]')
    : [];

  // JSON-LD Structured Data Schema for RealEstateListing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      businessFunction: property.listing_type === 'Rent' ? 'http://purl.org/goodrelations/v1#LeaseOut' : 'http://purl.org/goodrelations/v1#Sell',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.locality,
      addressRegion: property.city,
      postalCode: property.pincode,
      addressCountry: 'IN',
    },
    image: images.map((img) => getFullImageUrl(img)),
  };

  return (
    <>
      {/* Inject SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PropertyDetailClient
        property={property}
        images={images}
        amenities={amenities}
        similarProperties={similarProperties}
      />
    </>
  );
}
