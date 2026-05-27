import Link from 'next/link';
import type { ShopCategoriesContent } from '@/types';

const DEFAULTS: ShopCategoriesContent = {
  occasion: { title: 'Shop by Occasion', description: "Christmas, Mother's Day, Father's Day, Weddings, and more.", image: '', link: '/shop?view=occasion' },
  theme: { title: 'Shop by Theme', description: 'Religious, Black History, Organizations, Family, Professionals.', image: '', link: '/shop?view=theme' },
  type: { title: 'Shop by Type', description: 'Artwork, Home Décor, Stationery, Fashion, African Décor & Fashion.', image: '', link: '/shop?view=type' },
};

export function ShopByCategory({ content }: { content: ShopCategoriesContent | null }) {
  const cats = content || DEFAULTS;
  const entries = [cats.occasion, cats.theme, cats.type];

  return (
    <section className="relative py-16 md:py-22 overflow-hidden" aria-label="Shop by category">
      <div className="absolute inset-0 bg-gradient-mesh" aria-hidden="true"/>
      <div className="absolute inset-0 bg-bhg-copper/5" aria-hidden="true"/>
      <div className="container-bhg relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {entries.map((cat, i) => (
            <Link key={i} href={cat.link} className="group relative">
              <div className="relative bg-bhg-black/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 min-h-[280px] flex flex-col justify-center items-center text-center border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/[0.03] to-transparent"/>
                <h3 className="font-serif text-display-sm text-white mb-3 relative z-10">{cat.title}</h3>
                <p className="text-body-md text-white/70 mb-6 max-w-xs relative z-10 leading-relaxed">{cat.description}</p>
                <span className="btn-dark text-body-sm py-2.5 px-6 relative z-10">Browse Collections</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
