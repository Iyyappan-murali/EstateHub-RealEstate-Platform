'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Property } from '../../../types';
import { formatPrice, formatArea, getFullImageUrl } from '../../../lib/utils';
import { PropertyCard } from '../../../components/PropertyCard';
import { InquiryModal } from '../../../components/InquiryModal';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Eye,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  Send,
  Building,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PropertyDetailClientProps {
  property: Property;
  images: string[];
  amenities: string[];
  similarProperties: Property[];
}

export default function PropertyDetailClient({
  property,
  images,
  amenities,
  similarProperties,
}: PropertyDetailClientProps) {
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  // Instant lead form state
  const [leadName, setLeadName] = useState(user?.name || '');
  const [leadEmail, setLeadEmail] = useState(user?.email || '');
  const [leadPhone, setLeadPhone] = useState(user?.phone || '');
  const [leadMsg, setLeadMsg] = useState(
    `Hi, I am interested in "${property.title}". Please share more details.`
  );
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadFeedback, setLeadFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleInstantInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadFeedback(null);

    try {
      const res = await api.post('/inquiries', {
        property_id: property.id,
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        message: leadMsg,
      });

      if (res.success) {
        setLeadFeedback({
          type: 'success',
          msg: 'Inquiry sent! The owner will contact you shortly.',
        });
      }
    } catch (err: any) {
      setLeadFeedback({
        type: 'error',
        msg: err.message || 'Failed to submit inquiry.',
      });
    } finally {
      setLeadLoading(false);
    }
  };

  const pricePerSqft = property.area_sqft > 0
    ? Math.round(Number(property.price) / Number(property.area_sqft))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href={`/properties?city=${property.city}`} className="hover:text-gray-900">{property.city}</Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Main Content: Gallery & Details on left, Contact card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Title & Price */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                property.listing_type === 'Rent' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'
              }`}>
                FOR {property.listing_type?.toUpperCase()}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                {property.property_type}
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
              {property.is_featured && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  FEATURED
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {property.title}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{property.locality}, {property.city} {property.pincode ? `(${property.pincode})` : ''}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-500 font-medium">Price</span>
                <p className="text-3xl font-black text-brand-700">
                  {formatPrice(Number(property.price), property.listing_type)}
                </p>
                {property.listing_type === 'Sell' && pricePerSqft > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{pricePerSqft.toLocaleString('en-IN')} / sq.ft
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={images.length > 0 ? getFullImageUrl(images[selectedImage]) : getFullImageUrl('')}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail carousel */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === idx ? 'border-brand-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={getFullImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Overview Key Specs Grid */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Property Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs text-gray-500 block mb-1">Configuration</span>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <BedDouble className="w-5 h-5 text-brand-600" />
                  <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio'}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs text-gray-500 block mb-1">Bathrooms</span>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Bath className="w-5 h-5 text-brand-600" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs text-gray-500 block mb-1">Super Area</span>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Maximize2 className="w-5 h-5 text-brand-600" />
                  <span>{formatArea(property.area_sqft)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <span className="text-xs text-gray-500 block mb-1">Furnishing</span>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <Building className="w-5 h-5 text-brand-600" />
                  <span>{property.furnishing || 'Semi-Furnished'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-gray-900">About this Property</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {amenities.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address Details */}
          {property.address && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-gray-900">Location Address</h2>
              <p className="text-sm text-gray-700 flex items-start gap-2">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Contact Owner Card (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-5">
            {/* Owner Profile Banner */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white font-bold flex items-center justify-center text-lg shadow-md">
                {(property.owner_name || 'Owner').charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                  Property Owner
                </span>
                <h3 className="font-bold text-gray-900 text-base">
                  {property.owner_name || 'Verified Owner'}
                </h3>
                <span className="text-xs text-gray-500">
                  Active Listing • Direct Contact
                </span>
              </div>
            </div>

            {/* Instant Contact Form */}
            <form onSubmit={handleInstantInquiry} className="space-y-3.5">
              <h4 className="text-sm font-bold text-gray-900">Send Direct Message</h4>

              {leadFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    leadFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {leadFeedback.msg}
                </div>
              )}

              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <textarea
                  rows={2}
                  required
                  value={leadMsg}
                  onChange={(e) => setLeadMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={leadLoading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{leadLoading ? 'Submitting...' : 'Contact Owner Now'}</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected with anti-spam & duplicate safeguards</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SIMILAR PROPERTIES RECOMMENDATION SECTION (Requirement 4) */}
      {similarProperties.length > 0 && (
        <section className="pt-8 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Smart Recommendations</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                Similar Properties in {property.city}
              </h2>
            </div>
            <Link
              href={`/properties?city=${property.city}`}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              See More in {property.city}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProperties.map((similar) => (
              <PropertyCard key={similar.id} property={similar} />
            ))}
          </div>
        </section>
      )}

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          propertyId={property.id}
          propertyTitle={property.title}
          ownerName={property.owner_name}
          onClose={() => setInquiryModalOpen(false)}
        />
      )}
    </div>
  );
}
