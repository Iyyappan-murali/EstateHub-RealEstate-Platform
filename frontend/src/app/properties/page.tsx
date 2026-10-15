'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { Property, PaginationMeta } from '../../types';
import { PropertyCard } from '../../components/PropertyCard';
import { SearchFilters } from '../../components/SearchFilters';
import { Pagination } from '../../components/Pagination';
import { Search, SlidersHorizontal, ArrowUpDown, Building, X } from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filters from URL searchParams
  const city = searchParams.get('city') || '';
  const propertyType = searchParams.get('propertyType') || '';
  const listingType = searchParams.get('listingType') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at_desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  // Fetch properties whenever query parameters change
  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams.toString());
        if (!queryParams.has('limit')) queryParams.set('limit', '12');

        const res = await api.get<Property[]>(`/properties?${queryParams.toString()}`);
        if (res.success && res.data) {
          setProperties(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  // Update query params helper
  const updateQuery = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '' || val === null) {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });

    // Reset to page 1 on filter changes if page isn't explicitly changed
    if (!updates.page) {
      params.set('page', '1');
    }

    router.push(`/properties?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    router.push('/properties');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchInput });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Keyword Search form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by locality, city, title, e.g. Indiranagar, Worli, 3 BHK..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-50/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort By & Mobile filter toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => updateQuery({ sortBy: e.target.value })}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="created_at_desc">Sort: Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="views_desc">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(city || propertyType || listingType || bedrooms || minPrice || maxPrice || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-500">Active Filters:</span>
            {city && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                City: {city}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => updateQuery({ city: undefined })} />
              </span>
            )}
            {propertyType && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {propertyType}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => updateQuery({ propertyType: undefined })} />
              </span>
            )}
            {listingType && (
              <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                For {listingType}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => updateQuery({ listingType: undefined })} />
              </span>
            )}
            {bedrooms && (
              <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {bedrooms} BHK
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => updateQuery({ bedrooms: undefined })} />
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                "{search}"
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => { setSearchInput(''); updateQuery({ search: undefined }); }} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-600 hover:underline font-semibold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Filters Sidebar + Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1">
          <div className="sticky top-24">
            <SearchFilters
              filters={{ city, propertyType, listingType, bedrooms, minPrice, maxPrice, sortBy, search }}
              onFilterChange={(newFilters) => updateQuery(newFilters)}
              onReset={handleResetFilters}
            />
          </div>
        </aside>

        {/* Properties Results */}
        <main className="col-span-1 md:col-span-3">
          {/* Results count header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              {pagination ? (
                <>
                  <span className="text-brand-600">{pagination.total.toLocaleString()}</span> Properties Found
                </>
              ) : (
                'Properties'
              )}
            </h1>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No properties matched your criteria</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Try widening your budget, removing specific filters, or searching for a different city or locality.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-600/20"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Properties Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && (
                <Pagination
                  pagination={pagination}
                  onPageChange={(p) => updateQuery({ page: p })}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SearchFilters
              filters={{ city, propertyType, listingType, bedrooms, minPrice, maxPrice, sortBy, search }}
              onFilterChange={(newFilters) => {
                updateQuery(newFilters);
                setMobileFilterOpen(false);
              }}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
