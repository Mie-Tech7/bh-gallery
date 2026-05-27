'use client';

import { useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Review } from '@/types';

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={cn(s <= rating ? 'fill-bhg-copper text-bhg-copper' : 'fill-bhg-gray-200 text-bhg-gray-200')} aria-hidden="true"/>
      ))}
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' });
  }, []);

  if (!reviews.length) return null;

  return (
    <section className="py-16 md:py-22 bg-bhg-cream-warm" aria-label="Customer reviews">
      <div className="container-bhg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <h2 className="section-heading">Real Reviews from Real Customers</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StarRating rating={5} size={18}/>
              <span className="text-body-md font-sans font-semibold text-bhg-black">16,469 Reviews</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-bhg-gray-200 flex items-center justify-center text-bhg-gray-600 hover:border-bhg-copper hover:text-bhg-copper transition-colors" aria-label="Previous reviews"><ChevronLeft size={16}/></button>
              <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-bhg-gray-200 flex items-center justify-center text-bhg-gray-600 hover:border-bhg-copper hover:text-bhg-copper transition-colors" aria-label="Next reviews"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x">
          {reviews.map((review) => (
            <div key={review.id} className="flex-shrink-0 w-[320px] md:w-[360px] snap-start border-t-2 border-bhg-gray-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={review.rating}/>
                <span className="text-body-sm text-bhg-gray-400">
                  {review.createdAt ? formatDate(review.createdAt) : ''}
                </span>
              </div>
              <p className="font-serif text-heading-sm text-bhg-black mb-1">&ldquo;{review.title}&rdquo;</p>
              {review.body && <p className="text-body-sm text-bhg-gray-600 mb-3">{review.body}</p>}
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-semibold text-bhg-black">{review.userName}</span>
                {review.isVerifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-caption text-bhg-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-bhg-success" aria-hidden="true"/>Verified buyer
                  </span>
                )}
              </div>
              {review.productName && <p className="text-body-sm text-bhg-copper mt-2 underline underline-offset-2">{review.productName}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
