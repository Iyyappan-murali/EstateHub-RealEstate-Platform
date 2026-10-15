import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'EstateHub | India’s Verified Real Estate Platform',
  description:
    'Search 50,000+ verified properties for sale and rent across Bangalore, Mumbai, Delhi NCR, Pune, Hyderabad, and Chennai without brokerage spam.',
  keywords: [
    'real estate',
    'buy house',
    'rent apartment',
    'flats in bangalore',
    'flats in mumbai',
    '99acres alternative',
    'nobroker alternative',
    'verified properties',
  ],
  authors: [{ name: 'EstateHub Engineering' }],
  openGraph: {
    title: 'EstateHub | Scalable Verified Real Estate Platform',
    description: 'Explore 50,000+ verified properties with direct owner contact and zero spam.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'EstateHub',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
