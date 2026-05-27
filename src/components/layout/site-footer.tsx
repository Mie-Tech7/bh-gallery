import Link from 'next/link';
import type { FooterContent } from '@/types';

const shopLinks = [
  { label: 'Account', href: '/account' },
  { label: 'Christmas Cards', href: '/shop/christmas/cards' },
  { label: 'Santa Claus Figurines', href: '/shop/christmas/figurines' },
  { label: 'Black History Collection', href: '/shop?theme=black_history' },
  { label: 'D.D. Ike Art Gallery', href: '/artists/dd-ike' },
  { label: 'Jigsaw Puzzles', href: '/shop?type=home_decor' },
  { label: 'Blog', href: '/blog' },
  { label: 'Reviews', href: '/reviews' },
];

const policyLinks = [
  { label: 'Submit Your Artwork', href: '/submit-artwork' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Easy Returns', href: '/returns' },
  { label: 'Limited Editions', href: '/limited-editions' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Layaway Plans', href: '/layaway' },
];

const DEFAULT_FOOTER: FooterContent = {
  tagline: 'Celebrating Black art and the voices of Black & African artists for over three decades.',
  phone: '678-916-6545',
  email: 'info@bh-gallery.com',
  address: { street: '154 Selig Drive Southwest', suite: 'Suite A', city: 'Atlanta', state: 'GA', zip: '30336' },
  socialLinks: { instagram: '', facebook: '', twitter: '', pinterest: '', linkedin: '' },
};

export function SiteFooter({ content }: { content?: FooterContent | null }) {
  const f = content || DEFAULT_FOOTER;

  return (
    <footer className="bg-white border-t border-bhg-gray-200">
      <div className="container-bhg py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/logo-mark.svg"
                alt="Black Heritage Gallery"
                width={22}
                height={28}
                className="h-7 w-auto"
              />
              <span className="font-serif text-heading-sm text-bhg-copper">Black Heritage Gallery</span>
            </div>
            <p className="text-body-sm text-bhg-gray-600 mb-6">{f.tagline}</p>
            <div className="flex items-center gap-2 mt-2">
              {(['Instagram', 'Facebook', 'Twitter', 'Pinterest', 'LinkedIn'] as const).map((p) => {
                const key = p.toLowerCase() as keyof typeof f.socialLinks;
                const url = f.socialLinks[key];
                return (
                  <a key={p} href={url || '#'} className="w-9 h-9 rounded-full bg-bhg-cream flex items-center justify-center text-bhg-gray-600 hover:bg-bhg-copper hover:text-white transition-colors" aria-label={p}>
                    <span className="text-body-sm">{p[0]}</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-4">Shop With Us</h3>
            <ul className="space-y-2">
              {shopLinks.map((l) => (<li key={l.href}><Link href={l.href} className="text-body-sm text-bhg-gray-600 hover:text-bhg-copper transition-colors">{l.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h3 className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              {policyLinks.map((l) => (<li key={l.href}><Link href={l.href} className="text-body-sm text-bhg-gray-600 hover:text-bhg-copper transition-colors">{l.label}</Link></li>))}
            </ul>
          </div>
          <div>
            <h3 className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-body-sm text-bhg-gray-600">
              <p>{f.address.street}<br/>{f.address.suite}<br/>{f.address.city}, {f.address.state} {f.address.zip}</p>
              <p><a href={`tel:${f.phone.replace(/\D/g, '')}`} className="hover:text-bhg-copper transition-colors">{f.phone}</a></p>
              <p><a href={`mailto:${f.email}`} className="hover:text-bhg-copper transition-colors">Email us</a></p>
            </div>
          </div>
          <div>
            <div className="bg-bhg-black text-white rounded-card p-4 text-center mb-4">
              <div className="text-display-sm font-serif">16,469</div>
              <div className="flex justify-center gap-0.5 my-1">{[1,2,3,4,5].map((s) => (<span key={s} className="text-bhg-copper">★</span>))}</div>
              <div className="text-caption uppercase tracking-widest">Verified Reviews</div>
            </div>
            <div className="text-body-sm text-bhg-gray-600">
              <p className="font-semibold mb-1">ATLANTA</p>
              <p>Member · Metropolitan Chamber of Commerce</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-bhg-gray-200">
        <div className="container-bhg py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-body-sm text-bhg-gray-400">© {new Date().getFullYear()} Black Heritage Gallery. All rights reserved.</p>
          <div className="text-body-sm text-bhg-gray-400">United States (USD $)</div>
        </div>
      </div>
    </footer>
  );
}
