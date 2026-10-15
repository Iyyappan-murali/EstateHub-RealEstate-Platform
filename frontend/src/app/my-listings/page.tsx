'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Property } from '../../types';
import { formatPrice, formatArea, getFullImageUrl } from '../../lib/utils';
import {
  Building2,
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadMyListings();
    }
  }, [user, authLoading]);

  const loadMyListings = async () => {
    setLoading(true);
    try {
      const res = await api.get<Property[]>('/properties/my-listings');
      if (res.success && res.data) {
        setListings(res.data);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load your listings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/properties/${id}`);
      if (res.success) {
        setListings((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: 'success', text: 'Property listing deleted successfully.' });
        setDeleteId(null);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete listing.' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading your property dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Owner Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            My Property Listings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your listings, review inquiry leads, and edit property details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/my-leads"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>View Buyer Leads</span>
          </Link>
          <Link
            href="/my-listings/new"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Listing</span>
          </Link>
        </div>
      </div>

      {/* Status alerts */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Listings Table or Empty State */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No properties posted yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Ready to find genuine tenants or buyers? Post your first property listing for free.
          </p>
          <Link
            href="/my-listings/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Free Listing</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-gray-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stats</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {listings.map((prop) => {
                  const images = Array.isArray(prop.images)
                    ? prop.images
                    : typeof prop.images === 'string'
                    ? JSON.parse(prop.images || '[]')
                    : [];
                  const thumb = images.length > 0 ? getFullImageUrl(images[0]) : getFullImageUrl('');

                  return (
                    <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Property Title & Thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={thumb}
                            alt={prop.title}
                            className="w-14 h-11 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/properties/${prop.id}`}
                              className="font-bold text-gray-900 hover:text-brand-600 line-clamp-1 max-w-xs"
                            >
                              {prop.title}
                            </Link>
                            <span className="text-[11px] text-gray-500">
                              {prop.bedrooms > 0 ? `${prop.bedrooms} BHK ` : ''}
                              {prop.property_type} • {formatArea(prop.area_sqft)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {formatPrice(Number(prop.price), prop.listing_type)}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-gray-600">
                        {prop.locality}, {prop.city}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            prop.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 text-gray-500">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5" />
                            {prop.views_count || 0}
                          </span>
                          <span className="flex items-center gap-1 text-brand-600 font-bold" title="Inquiries received">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {prop.inquiries_count || 0} leads
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/properties/${prop.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-brand-600 hover:bg-brand-50"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/my-listings/edit/${prop.id}`}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(prop.id)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Property Listing?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
