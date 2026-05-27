'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Artist } from '@/types';

const GRADIENT_COLORS = [
  'from-orange-500 to-blue-600',
  'from-indigo-600 to-rose-500',
  'from-green-600 to-lime-400',
  'from-amber-700 to-stone-600',
  'from-red-500 to-yellow-400',
];

const DEFAULTS: Pick<Artist, 'id' | 'name' | 'slug' | 'style' | 'profileImage'>[] = [
  { id: 'd-dd-ike', name: 'D.D. Ike Art Gallery', slug: 'dd-ike', style: 'Mixed Media · Jazz', profileImage: '' },
  { id: 'd-michael-wallace', name: 'Michael Wallace Art Gallery', slug: 'michael-wallace', style: 'Cubist Portraiture', profileImage: '' },
  { id: 'd-ted-ellis', name: 'Ted Ellis Art Gallery', slug: 'ted-ellis', style: 'Cultural Narrative', profileImage: '' },
  { id: 'd-ernie-barnes', name: 'Ernie Barnes Art Gallery', slug: 'ernie-barnes', style: 'Neo-Mannerism', profileImage: '' },
  { id: 'd-gerald-ivey', name: 'Gerald Ivey Art Gallery', slug: 'gerald-ivey', style: 'Abstract Figuration', profileImage: '' },
];

export function FeaturedArtists({ artists }: { artists: Artist[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  }, []);

  const list: Pick<Artist, 'id' | 'name' | 'slug' | 'style' | 'profileImage'>[] =
    artists.length ? artists : DEFAULTS;

  return (
    <section className="relative py-16 md:py-22 overflow-hidden" aria-label="Featured artists">
      <div className="absolute inset-0 bg-dot-pattern opacity-30" aria-hidden="true"/>
      <div className="container-bhg relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-heading mb-4">Featured Artists</h2>
          <p className="text-body-lg text-bhg-gray-600">Galleries dedicated to the lifework of artists shaping Black and African visual culture</p>
          <div className="w-12 h-1 bg-bhg-copper mx-auto mt-6 rounded-full" aria-hidden="true"/>
        </div>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory" role="list">
            {list.map((artist, i) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} className="group flex-shrink-0 w-[240px] md:w-[260px] snap-start" role="listitem">
                <div className={`aspect-[3/4] rounded-xl overflow-hidden shadow-card group-hover:shadow-card-hover transition-shadow duration-300 relative bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]}`}>
                  {artist.profileImage && (
                    <img src={artist.profileImage} alt={artist.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10"/>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-serif text-heading-sm text-bhg-black group-hover:text-bhg-copper transition-colors duration-200">{artist.name}</h3>
                  <p className="text-body-sm text-bhg-gray-600 mt-1">{artist.style}</p>
                </div>
              </Link>
            ))}
          </div>
          {list.length > 3 && (
            <>
              <button onClick={() => scroll('left')} className="hidden md:flex absolute left-0 top-1/3 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center text-bhg-gray-600 hover:text-bhg-copper hover:shadow-card-hover transition-all" aria-label="Scroll artists left"><ChevronLeft size={18}/></button>
              <button onClick={() => scroll('right')} className="hidden md:flex absolute right-0 top-1/3 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-card items-center justify-center text-bhg-gray-600 hover:text-bhg-copper hover:shadow-card-hover transition-all" aria-label="Scroll artists right"><ChevronRight size={18}/></button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
