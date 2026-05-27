'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const GRADIENT_COLORS = [
  'from-stone-700 to-stone-900',
  'from-amber-900 to-stone-800',
  'from-orange-600 to-amber-700',
  'from-stone-600 to-amber-800',
  'from-rose-600 to-orange-500',
];

export function TopRatedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-16 md:py-22" aria-label="Top rated products">
      <div className="container-bhg">
        <div className="flex items-center justify-between mb-10">
          <h2 className="section-heading">Top Rated Products</h2>
          {products.length > 3 && (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-bhg-gray-200 flex items-center justify-center text-bhg-gray-600 hover:border-bhg-copper hover:text-bhg-copper transition-colors" aria-label="Scroll left"><ChevronLeft size={16}/></button>
              <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-bhg-gray-200 flex items-center justify-center text-bhg-gray-600 hover:border-bhg-copper hover:text-bhg-copper transition-colors" aria-label="Scroll right"><ChevronRight size={16}/></button>
            </div>
          )}
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x">
          {products.map((product, i) => (
            <Link key={product.id} href={`/product/${product.slug}`} className="group flex-shrink-0 w-[220px] md:w-[240px] snap-start">
              <div className={`aspect-square rounded-xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300 relative bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]}`}>
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
                )}
                <div className="w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out"/>
              </div>
              <div className="mt-4">
                <h3 className="font-sans text-body-sm font-medium text-bhg-black group-hover:text-bhg-copper transition-colors duration-200 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={cn(s <= Math.round(product.rating?.average ?? 0) ? 'fill-bhg-copper text-bhg-copper' : 'fill-bhg-gray-200 text-bhg-gray-200')} aria-hidden="true"/>
                    ))}
                  </div>
                  <span className="text-caption text-bhg-gray-400">({product.rating?.count ?? 0})</span>
                </div>
                <p className="text-body-sm font-semibold text-bhg-black mt-1.5">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
