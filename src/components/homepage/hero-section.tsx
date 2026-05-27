'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HeroContent } from '@/types';

const DEFAULTS: HeroContent = {
  headline: 'The Black Heritage Gallery',
  headlineAccent: 'Returns',
  subtitle: 'Join Our Community',
  tagline: 'Celebrating Black art and the voices of Black & African artists.',
  ctaPrimary: { text: 'Learn Our Story', link: '/about' },
  ctaSecondary: { text: 'Appraisal Services', link: '/appraisal' },
  carouselItems: [
    { image: '', title: 'Contemporary African Expression', link: '/gallery' },
    { image: '', title: 'Emerging Black Artists', link: '/artists' },
    { image: '', title: 'Heritage Art Treasures', link: '/shop' },
  ],
};

export function HeroSection({ content }: { content: HeroContent | null }) {
  const d = content || DEFAULTS;
  const items = d.carouselItems?.length ? d.carouselItems : DEFAULTS.carouselItems;

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [noMotion, setNoMotion] = useState(false);
  const ref = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setNoMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setNoMotion(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (paused || noMotion || items.length <= 1) return;
    ref.current = setInterval(() => setSlide((p) => (p + 1) % items.length), 5000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [paused, noMotion, items.length]);

  const next = useCallback(() => setSlide((p) => (p + 1) % items.length), [items.length]);
  const prev = useCallback(() => setSlide((p) => p === 0 ? items.length - 1 : p - 1), [items.length]);
  const anim = (ms: string) => !noMotion ? `animate-fade-up [animation-delay:${ms}]` : '';

  return (
    <section className="relative bg-bhg-cream-warm overflow-hidden" aria-label="Welcome to Black Heritage Gallery">
      <div className="container-bhg py-12 md:py-16 lg:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className={cn('font-serif text-display-xl md:text-[3.75rem] lg:text-[4.25rem] text-bhg-black leading-[1.05] mb-4', anim('0ms'))}>
              {d.headline} <em className="text-bhg-copper not-italic font-serif italic">{d.headlineAccent}</em>
            </h1>
            <p className={cn('font-serif text-heading-lg md:text-display-sm text-bhg-black mb-3', anim('200ms'))}>{d.subtitle}</p>
            <p className={cn('text-body-lg text-bhg-gray-600 max-w-md mb-8', anim('300ms'))}>{d.tagline}</p>
            <div className={cn('flex flex-wrap items-center gap-4', anim('400ms'))}>
              <Link href={d.ctaPrimary.link} className="btn-primary text-body-md py-3.5 px-7">
                <BookOpen size={18} aria-hidden="true"/>{d.ctaPrimary.text}
              </Link>
              <Link href={d.ctaSecondary.link} className="btn-secondary text-body-md py-3.5 px-7">
                <Sparkles size={18} aria-hidden="true"/>{d.ctaSecondary.text}
              </Link>
            </div>
          </div>

          <div className={cn('order-1 lg:order-2', anim('200ms'))}>
            <div className="relative rounded-2xl overflow-hidden shadow-card-hover"
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
              onKeyDown={(e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); } if (e.key === 'ArrowRight') { e.preventDefault(); next(); } }}
              role="region" aria-roledescription="carousel" aria-label="Featured artworks">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${slide * 100}%)`, ...(noMotion ? { transition: 'none' } : {}) }}>
                {items.map((item, i) => (
                  <div key={i} className="min-w-full aspect-[4/3] relative bg-gradient-to-br from-amber-900/40 via-stone-800/60 to-stone-900/90"
                    role="group" aria-roledescription="slide" aria-label={`Slide ${i + 1} of ${items.length}: ${item.title}`} aria-hidden={i !== slide}>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/90 text-body-lg font-serif">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              {items.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors focus-visible:outline-2 focus-visible:outline-white" aria-label="Previous slide"><ChevronLeft size={20}/></button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors focus-visible:outline-2 focus-visible:outline-white" aria-label="Next slide"><ChevronRight size={20}/></button>
                </>
              )}
            </div>
            {items.length > 1 && (
              <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Slide navigation">
                {items.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} className={cn('w-2.5 h-2.5 rounded-full transition-all duration-300', i === slide ? 'bg-bhg-copper scale-125' : 'bg-bhg-copper/30 hover:bg-bhg-copper/50')} role="tab" aria-selected={i === slide} aria-label={`Go to slide ${i + 1}`}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
