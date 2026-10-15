'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property } from '../types';
import { formatPrice, formatArea, getFullImageUrl } from '../lib/utils';
import { MapPin, BedDouble, Bath, Maximize2, ShieldCheck, Heart, Eye } from 'lucide-react';
import { InquiryModal } from './InquiryModal';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const images = Array.isArray(property.images)
    ? property.images
    : typeof property.images === 'string'
    ? JSON.parse(property.images || '[]')
    : [];

  const mainImage = images.length > 0 ? getFullImageUrl(images[0]) : getFullImageUrl('');

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {property.is_featured && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
                FEATURED
              </span>
            )}
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                property.listing_type === 'Rent'
                  ? 'bg-purple-600 text-white'
                  : 'bg-brand-600 text-white'
              }`}
            >
              FOR {property.listing_type?.toUpperCase() || 'SALE'}
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified
            </span>
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setSaved(!saved);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-colors"
            title="Save property"
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>

          {/* Views count indicator */}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <Eye className="w-3 h-3 text-gray-300" />
            <span>{property.views_count || 0} views</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Price & Property Type */}
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-black text-gray-900 tracking-tight">
                {formatPrice(Number(property.price), property.listing_type)}
              </span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                {property.property_type}
              </span>
            </div>

            {/* Title */}
            <Link href={`/properties/${property.id}`} className="group-hover:text-brand-600 transition-colors">
              <h3 className="font-bold text-gray-900 line-clamp-1 text-base mb-1" title={property.title}>
                {property.title}
              </h3>
            </Link>

            {/* Location */}
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
              <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800">{property.bathrooms} Bath</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-800 truncate">{formatArea(property.area_sqft)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/properties/${property.id}`}
              className="flex-1 text-center py-2 px-3 border border-gray-200 hover:border-gray-900 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all"
            >
              View Details
            </Link>
            <button
              onClick={() => setInquiryOpen(true)}
              className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-600/20 transition-all"
            >
              Contact Owner
            </button>
          </div>
        </div>
      </div>

      {/* Inquiry Lead Modal */}
      {inquiryOpen && (
        <InquiryModal
          propertyId={property.id}
          propertyTitle={property.title}
          ownerName={property.owner_name}
          onClose={() => setInquiryOpen(false)}
        />
      )}
    </>
  );
};
