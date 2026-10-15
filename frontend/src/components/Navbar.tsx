'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, MessageSquare, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                Estate<span className="text-brand-600">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-gray-600">
                Verified Real Estate
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/properties?listingType=Sell"
              className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
            >
              Buy
            </Link>
            <Link
              href="/properties?listingType=Rent"
              className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
            >
              Rent
            </Link>
            <Link
              href="/properties?propertyType=Commercial"
              className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
            >
              Commercial
            </Link>
            <Link
              href="/properties"
              className="text-sm font-semibold text-gray-700 hover:text-brand-600 transition-colors"
            >
              All Listings
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/my-listings/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 font-semibold text-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              <span>Post Property</span>
              <span className="bg-brand-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-1">
                Free
              </span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-600">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded capitalize">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span>My Property Listings</span>
                    </Link>

                    <Link
                      href="/my-leads"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span>Leads & Inquiries</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/properties?listingType=Sell"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-50"
          >
            Buy Properties
          </Link>
          <Link
            href="/properties?listingType=Rent"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-50"
          >
            Rent Properties
          </Link>
          <Link
            href="/properties?propertyType=Commercial"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-50"
          >
            Commercial Properties
          </Link>
          <Link
            href="/properties"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-gray-800 hover:bg-gray-50"
          >
            Browse All (50,000+ Listings)
          </Link>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/my-listings/new"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-brand-600 text-white font-semibold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property (FREE)</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/my-listings"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  My Property Listings
                </Link>
                <Link
                  href="/my-leads"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Leads & Inquiries
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 px-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-800"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-2 px-3 bg-gray-900 text-white rounded-lg text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
