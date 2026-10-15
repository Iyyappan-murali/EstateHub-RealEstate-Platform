'use client';

import React, { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { X, Send, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InquiryModalProps {
  propertyId: string;
  propertyTitle: string;
  ownerName?: string;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  propertyId,
  propertyTitle,
  ownerName,
  onClose,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState(
    `Hi ${ownerName ? ownerName : 'Owner'}, I am interested in your property "${propertyTitle}". Please contact me with more information.`
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await api.post<any>('/inquiries', {
        property_id: propertyId,
        name,
        email,
        phone,
        message,
      });

      if (res.success) {
        setStatus({
          type: 'success',
          message: 'Your inquiry has been sent to the property owner! They will reach out shortly.',
        });
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to submit inquiry. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Verified Contact
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-1">
            Contact {ownerName ? `Owner (${ownerName})` : 'Property Owner'}
          </h2>
          <p className="text-xs text-gray-500 truncate mt-0.5" title={propertyTitle}>
            Regarding: {propertyTitle}
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2.5 ${
              status.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{status.message}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Message to Owner *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 py-1">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Anti-spam protection enabled. Owner contact details will be shared upon response.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm shadow-brand-600/30 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
