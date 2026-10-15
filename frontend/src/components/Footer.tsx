import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Zap, Search, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Estate<span className="text-brand-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's premier high-performance real estate platform. Search through 50,000+ verified listings across major metropolitan cities without broker spam.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Anti-Spam Verified Inquiries</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Properties
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?city=Bangalore" className="hover:text-white transition-colors">
                  Properties in Bangalore
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Mumbai" className="hover:text-white transition-colors">
                  Properties in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Delhi" className="hover:text-white transition-colors">
                  Properties in Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Hyderabad" className="hover:text-white transition-colors">
                  Properties in Hyderabad
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Pune" className="hover:text-white transition-colors">
                  Properties in Pune
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Property Types
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties?propertyType=Apartment" className="hover:text-white transition-colors">
                  Apartments & Flats
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Villa" className="hover:text-white transition-colors">
                  Luxury Independent Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Builder+Floor" className="hover:text-white transition-colors">
                  Builder Floors
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Commercial" className="hover:text-white transition-colors">
                  Commercial Offices
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=Plot" className="hover:text-white transition-colors">
                  Residential Plots
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Platform & Architecture
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p><strong className="text-white">Stack:</strong> Next.js App Router, Express, TypeScript, PostgreSQL</p>
              <p><strong className="text-white">Database:</strong> PostgreSQL 18 with Trigram GIN indexing</p>
              <p><strong className="text-white">API Docs:</strong> <a href="http://localhost:5000/api-docs" target="_blank" className="text-brand-400 hover:underline">Swagger OpenAPI UI</a></p>
              <p><strong className="text-white">Benchmark:</strong> 50,000+ indexed records with sub-5ms query times</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} EstateHub Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/properties" className="hover:text-white">Search</Link>
            <Link href="/my-listings/new" className="hover:text-white">Post Property</Link>
            <a href="http://localhost:5000/api-docs" target="_blank" className="hover:text-white">API Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
