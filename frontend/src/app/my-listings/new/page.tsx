'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  Building2,
  Upload,
  X,
  Check,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const COMMON_AMENITIES = [
  'Swimming Pool',
  'Gym / Fitness Center',
  'Clubhouse',
  'Lift / Elevator',
  '24x7 Security',
  'Power Backup',
  'Covered Parking',
  'EV Charging Station',
  'Children Play Area',
  'Jogging Track',
  'Intercom Facility',
  'Rainwater Harvesting',
  'Gated Community',
  'Piped Gas',
];

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [listingType, setListingType] = useState<'Sell' | 'Rent'>('Sell');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [areaSqft, setAreaSqft] = useState('');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Elevator',
    '24x7 Security',
    'Power Backup',
  ]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities((prev) => prev.filter((a) => a !== item));
    } else {
      setSelectedAmenities((prev) => [...prev, item]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, 8));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('property_type', propertyType);
      formData.append('listing_type', listingType);
      formData.append('price', price);
      formData.append('bedrooms', bedrooms);
      formData.append('bathrooms', bathrooms);
      formData.append('area_sqft', areaSqft);
      formData.append('furnishing', furnishing);
      formData.append('city', city);
      formData.append('locality', locality);
      if (address) formData.append('address', address);
      if (pincode) formData.append('pincode', pincode);
      formData.append('amenities', JSON.stringify(selectedAmenities));

      // Append images
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // If no photos uploaded, provide default high-res stock photo
      if (selectedFiles.length === 0) {
        formData.append(
          'images',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        );
      }

      const res = await api.post('/properties', formData, true);
      if (res.success) {
        router.push('/my-listings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create property listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Back Link */}
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Listings</span>
      </Link>

      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
          Create Listing
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
          Post Property For Free
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Enter verified property details to start receiving direct inquiries from potential buyers
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-8">
        {/* Section 1: Listing Intent & Type */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            1. Property Purpose & Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">I want to *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setListingType('Sell')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                    listingType === 'Sell'
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('Rent')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                    listingType === 'Rent'
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Rent / Lease
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Property Type *</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Apartment">Apartment / Flat</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Luxury Villa</option>
                <option value="Plot">Residential Plot</option>
                <option value="Commercial">Commercial Space</option>
                <option value="Builder Floor">Builder Floor</option>
                <option value="Studio Apartment">Studio Apartment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Property Specs */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            2. Basic Details & Pricing
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Listing Title *</label>
            <input
              type="text"
              required
              minLength={5}
              placeholder="e.g. Elegant 3 BHK Apartment with Sunlit Balcony in Indiranagar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Expected Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="e.g. 9500000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Super Area (Sq.ft) *</label>
              <input
                type="number"
                required
                min={50}
                placeholder="e.g. 1450"
                value={areaSqft}
                onChange={(e) => setAreaSqft(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Bedrooms *</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="0">Studio / 0 BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Bathrooms *</label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="1">1 Bathroom</option>
                <option value="2">2 Bathrooms</option>
                <option value="3">3 Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Furnishing Status *</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Locality / Sector *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar, Whitefield, Worli"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Address / Landmark</label>
              <input
                type="text"
                placeholder="e.g. 100ft Road, Near Metro"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 560038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Detailed Description *</label>
            <textarea
              required
              rows={4}
              minLength={20}
              placeholder="Describe property features, ventilation, nearby schools, hospital, metro connectivity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

        {/* Section 3: Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            3. Amenities & Facilities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COMMON_AMENITIES.map((item) => {
              const selected = selectedAmenities.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleAmenity(item)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                    selected
                      ? 'bg-brand-50 border-brand-500 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      selected ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                  </div>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Photo Uploads */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            4. Photos & Media
          </h2>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-700 mb-1">
              Upload photos of your property
            </p>
            <p className="text-[11px] text-gray-500 mb-3">
              PNG, JPG, or WebP up to 5MB each (up to 8 photos)
            </p>
            <label className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors">
              Browse Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs"
                >
                  <span className="truncate max-w-[150px]">{f.name}</span>
                  <X
                    className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => removeFile(i)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
          <Link
            href="/my-listings"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing Listing...' : 'Publish Property Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
