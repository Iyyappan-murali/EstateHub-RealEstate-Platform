'use client';

import React from 'react';
import { Filter, RotateCcw, MapPin, Building, IndianRupee, Layers } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    city?: string;
    propertyType?: string;
    listingType?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    search?: string;
  };
  onFilterChange: (newFilters: any) => void;
  onReset: () => void;
}

const CITIES = ['All Cities', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon'];
const PROPERTY_TYPES = [
  'All Types',
  'Apartment',
  'Villa',
  'Independent House',
  'Commercial',
  'Builder Floor',
  'Studio Apartment',
];
const BHK_OPTIONS = [
  { label: 'All BHK', value: '' },
  { label: '1 BHK', value: '1' },
  { label: '2 BHK', value: '2' },
  { label: '3 BHK', value: '3' },
  { label: '4+ BHK', value: '4' },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Listing Type Toggle (Buy / Rent) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Looking To
        </label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => onFilterChange({ listingType: '' })}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              !filters.listingType ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange({ listingType: 'Sell' })}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.listingType === 'Sell' ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => onFilterChange({ listingType: 'Rent' })}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
              filters.listingType === 'Rent' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* City Selector */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          <span>City</span>
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => onFilterChange({ city: e.target.value === 'All Cities' ? '' : e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <Building className="w-3.5 h-3.5 text-gray-500" />
          <span>Property Type</span>
        </label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => onFilterChange({ propertyType: e.target.value === 'All Types' ? '' : e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t === 'All Types' ? '' : t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms / BHK Chips */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5 text-gray-500" />
          <span>Bedrooms</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {BHK_OPTIONS.map((opt) => {
            const isSelected = (filters.bedrooms || '') === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => onFilterChange({ bedrooms: opt.value })}
                className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Range (Min - Max Price) */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <IndianRupee className="w-3.5 h-3.5 text-gray-500" />
          <span>Budget Range (₹)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
    </div>
  );
};
