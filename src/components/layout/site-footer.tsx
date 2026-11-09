import Link from 'next/link';
import { site } from '@/content/site';

const pageLinks = [
  { label: 'About', href: '/about' },
  { label: 'Appraisals', href: '/appraisal' },
  { label: 'Contact', href: '/contact' },
];

const socialLabels = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
] as const;

export function SiteFooter() {
  const { contact } = site;
  const socials = socialLabels.filter(({ key }) => site.social[key]);

  return (
    <footer className="bg-white border-t border-bhg-gray-200">
      <div className="container-bhg py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/icons/logo-mark.svg"
                alt=""
                width={22}
                height={28}
                className="h-7 w-auto"
              />
              <span className="font-serif text-heading-sm text-bhg-copper">{site.galleryName}</span>
            </div>
            <p className="text-body-sm text-bhg-gray-600 mb-6">
              {site.tagline}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map(({ key, label }) => (
                  <a
                    key={key}
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-bhg-cream flex items-center justify-center text-bhg-gray-600 hover:bg-bhg-copper hover:text-white transition-colors"
                    aria-label={label}
                  >
                    <span className="text-body-sm">{label[0]}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-4">Visit</h3>
            <ul className="space-y-2">
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-body-sm text-bhg-gray-600 hover:text-bhg-copper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-body-sm text-bhg-gray-600">
              {site.location && <p>{site.location}</p>}
              {contact.phone && (
                <p>
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:text-bhg-copper transition-colors">{contact.phone}</a>
                </p>
              )}
              {contact.email && (
                <p>
                  <a href={`mailto:${contact.email}`} className="hover:text-bhg-copper transition-colors">{contact.email}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-bhg-gray-200">
        <div className="container-bhg py-4">
          <p className="text-body-sm text-bhg-gray-400">
            © {new Date().getFullYear()} {site.galleryName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
