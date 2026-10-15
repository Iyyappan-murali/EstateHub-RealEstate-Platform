import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format Indian currency (Lakhs, Crores, Thousands)
 */
export function formatPrice(price: number, listingType?: string): string {
  if (price === undefined || price === null) return '₹ 0';

  let formatted = '';
  if (price >= 10000000) {
    const cr = price / 10000000;
    formatted = `₹ ${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  } else if (price >= 100000) {
    const lacs = price / 100000;
    formatted = `₹ ${lacs % 1 === 0 ? lacs.toFixed(0) : lacs.toFixed(2)} Lac`;
  } else if (price >= 1000) {
    formatted = `₹ ${price.toLocaleString('en-IN')}`;
  } else {
    formatted = `₹ ${price}`;
  }

  if (listingType === 'Rent') {
    formatted += '/mo';
  }

  return formatted;
}

export function formatArea(area: number): string {
  if (!area) return '0 sq.ft';
  return `${area.toLocaleString('en-IN')} sq.ft`;
}

export function getFullImageUrl(url: string): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
}
