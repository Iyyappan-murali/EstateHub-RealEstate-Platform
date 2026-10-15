'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../lib/api';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Home,
  CheckCircle,
} from 'lucide-react';

const POPULAR_CITIES = [
  {
    name: 'Bangalore',
    tagline: 'Silicon Valley of India',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    count: '12,500+ Listings',
  },
  {
    name: 'Mumbai',
    tagline: 'City of Dreams & Sea Views',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    count: '9,800+ Listings',
  },
  {
    name: 'Delhi',
    tagline: 'Capital Heart & NCR Enclaves',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    count: '8,400+ Listings',
  },
  {
    name: 'Hyderabad',
    tagline: 'Cyber City & Luxury Villas',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    count: '7,200+ Listings',
  },
  {
    name: 'Pune',
    tagline: 'Cultural & Tech Hub',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    count: '6,100+ Listings',
  },
  {
    name: 'Chennai',
    tagline: 'Coastal Living & IT Corridors',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    count: '5,900+ Listings',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [listingType, setListingType] = useState<'Sell' | 'Rent'>('Sell');
  const [city, setCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.get<Property[]>('/properties?limit=6&sortBy=created_at_desc');
        if (res.success && res.data) {
          setFeaturedProperties(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set('listingType', listingType);
    if (city) params.set('city', city);
    if (searchTerm) params.set('search', searchTerm);
    if (bedrooms) params.set('bedrooms', bedrooms);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-gray-900 to-slate-900 text-white pt-16 pb-24 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>50,000+ Verified Homes & Commercial Properties</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
            Find Your Dream Property Without The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Brokerage Chaos
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            High-speed real estate discovery across India’s top metropolitan cities. Verified listings, direct owner contact, and instant spam-protected inquiries.
          </p>

          {/* Search Box Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl text-left border border-white/20 max-w-4xl mx-auto text-gray-900">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <button
                type="button"
                onClick={() => setListingType('Sell')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  listingType === 'Sell'
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setListingType('Rent')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  listingType === 'Rent'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Rent Properties
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* City Selector */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50/50 font-medium"
                    >
                      <option value="">All Top Cities</option>
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

                {/* Keyword Search */}
                <div className="md:col-span-6">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search locality, project, e.g. Whitefield, Indiranagar, Worli..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50/50 font-medium"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Quick BHK filters */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500">
                <span className="font-semibold text-gray-700">Quick Filters:</span>
                {['1', '2', '3', '4'].map((bhk) => (
                  <button
                    type="button"
                    key={bhk}
                    onClick={() => setBedrooms(bedrooms === bhk ? '' : bhk)}
                    className={`px-3 py-1 rounded-full border transition-all ${
                      bedrooms === bhk
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                        : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {bhk} BHK
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* STATS HIGHLIGHT BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-brand-600">50,000+</span>
            <p className="text-xs text-gray-500 font-medium">Verified Property Listings</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">&lt; 3ms</span>
            <p className="text-xs text-gray-500 font-medium">Indexed Query Execution</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">100%</span>
            <p className="text-xs text-gray-500 font-medium">Spam-Protected Leads</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-500">₹0 Fee</span>
            <p className="text-xs text-gray-500 font-medium">Free Direct Owner Posting</p>
          </div>
        </div>
      </section>

      {/* EXPLORE TOP CITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Prime Locations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Explore Properties By City
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_CITIES.map((cityItem) => (
            <Link
              key={cityItem.name}
              href={`/properties?city=${cityItem.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cityItem.image}
                alt={cityItem.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-bold text-base group-hover:text-emerald-300 transition-colors">
                  {cityItem.name}
                </h3>
                <p className="text-[11px] text-gray-300 font-medium">{cityItem.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Handpicked Choices
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Explore 50,000+ Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* POST PROPERTY CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <span className="bg-white/10 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              For Property Owners & Builders
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Post Your Property For Free & Connect With Genuine Buyers
            </h2>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero brokerage fees — deal directly with tenants and buyers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Built-in anti-spam duplicate inquiry protection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Reach thousands of active property seekers every day</span>
              </li>
            </ul>
          </div>
          <div>
            <Link
              href="/my-listings/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-950 font-black rounded-2xl shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5 text-brand-600" />
              <span>Post Free Property Listing</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
