import Link from 'next/link';
import type { SeasonalContent } from '@/types';

const DEFAULTS: SeasonalContent = {
  isActive: true,
  label: 'Seasonal Collection',
  headline: 'Celebrate Christmas Our Way',
  description:
    'Discover ornaments, cards, and holiday décor that honor Black traditions and the artists keeping them alive.',
  image: '',
  imageCaption: 'Featured · Holiday Collection',
  ctaText: 'Shop Christmas Collection',
  ctaLink: '/shop/christmas',
};

export function SeasonalFeature({ content }: { content: SeasonalContent | null }) {
  const c = content && content.isActive ? content : DEFAULTS;

  return (
    <section className="bg-bhg-cream-warm py-16 md:py-22" aria-label="Seasonal collection">
      <div className="container-bhg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover aspect-[3/4] lg:aspect-[4/5] bg-gradient-to-br from-red-900/30 via-amber-800/40 to-stone-800/60">
            <div className="absolute inset-0 bg-gradient-to-br from-red-700/50 via-rose-600/30 to-amber-900/60"/>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-caption uppercase tracking-widest text-white/70 font-sans">{c.imageCaption}</p>
            </div>
          </div>
          <div>
            <p className="section-label mb-4">{c.label}</p>
            <h2 className="font-serif text-display-lg md:text-display-xl text-bhg-black leading-[1.08] mb-6">{c.headline}</h2>
            <p className="text-body-lg text-bhg-gray-600 max-w-lg mb-8 leading-relaxed">{c.description}</p>
            <Link href={c.ctaLink} className="inline-flex items-center justify-center bg-bhg-black text-white font-sans font-medium text-body-md px-8 py-4 rounded-button transition-all duration-200 hover:bg-bhg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bhg-black">
              {c.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
