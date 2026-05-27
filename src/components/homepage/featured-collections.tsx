import Link from 'next/link';
import type { FeaturedCollectionsContent } from '@/types';

const DEFAULTS: FeaturedCollectionsContent = {
  headline: 'Featured Collections',
  subtitle:
    'Discover our curated collection of exceptional Black and African art, spanning traditional and contemporary expressions',
  items: [
    { image: '', title: 'Rhythms of Heritage', subtitle: 'Contemporary Mixed Media', link: '/gallery/rhythms-of-heritage' },
    { image: '', title: 'Ancestral Wisdom', subtitle: 'Traditional Carved Wood', link: '/gallery/ancestral-wisdom' },
    { image: '', title: 'Woven Stories', subtitle: 'Hand-woven Textile', link: '/gallery/woven-stories' },
    { image: '', title: 'Liberation Form', subtitle: 'Contemporary Sculpture', link: '/gallery/liberation-form' },
  ],
};

export function FeaturedCollections({ content }: { content: FeaturedCollectionsContent | null }) {
  const c = content && content.items?.length ? content : DEFAULTS;

  return (
    <section className="relative py-16 md:py-22 overflow-hidden" aria-label="Featured collections">
      <div className="absolute inset-0 bg-dot-pattern opacity-40" aria-hidden="true"/>
      <div className="container-bhg relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-heading mb-4">{c.headline}</h2>
          <p className="text-body-lg text-bhg-gray-600">{c.subtitle}</p>
          <div className="w-12 h-1 bg-bhg-copper mx-auto mt-6 rounded-full" aria-hidden="true"/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.items.map((item, i) => (
            <Link key={i} href={item.link} className="group block">
              <div className="card overflow-hidden">
                <div className="aspect-square relative bg-gradient-to-br from-stone-200 to-stone-400 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-800/20 to-stone-700/30 group-hover:from-amber-800/30 group-hover:to-stone-700/40 transition-all duration-500"/>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-heading-sm text-bhg-black group-hover:text-bhg-copper transition-colors duration-200">{item.title}</h3>
                  <p className="text-body-sm text-bhg-gray-600 mt-1">{item.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
