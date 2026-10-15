'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Inquiry } from '../../types';
import { formatPrice } from '../../lib/utils';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Building,
  ArrowLeft,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function MyLeadsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadLeads();
    }
  }, [user, authLoading]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get<Inquiry[]>('/inquiries/my-leads');
      if (res.success && res.data) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading buyer leads...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Listings</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Lead Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Buyer Inquiries ({leads.length})
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified leads received from prospective buyers interested in your properties
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-200">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Duplicate & Spam Protection Active</span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No leads yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            When buyers or tenants submit an inquiry on your listings, they will appear here with verified contact details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{lead.name}</h3>
                    <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    New Lead
                  </span>
                </div>
              </div>

              {/* Property Inquired */}
              <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-800 line-clamp-1">
                    {lead.property_title || 'Property Listing'}
                  </span>
                </div>
                {lead.property_price && (
                  <span className="font-black text-brand-700 shrink-0">
                    {formatPrice(Number(lead.property_price))}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs text-gray-700 leading-relaxed italic">
                "{lead.message}"
              </div>

              {/* Quick Contact Links */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-brand-600/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {lead.phone}</span>
                </a>
                <a
                  href={`mailto:${lead.email}?subject=Regarding your inquiry on EstateHub`}
                  className="flex-1 py-2 px-3 border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>Email Buyer</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
