import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Placeholder } from '@/components/ui/placeholder';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `How to reach ${site.galleryName}.`,
};

export default function ContactPage() {
  const { contact } = site;

  const rows = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email ? (
        <a href={`mailto:${contact.email}`} className="hover:text-bhg-copper">{contact.email}</a>
      ) : (
        <Placeholder>public email</Placeholder>
      ),
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone ? (
        <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="hover:text-bhg-copper">{contact.phone}</a>
      ) : (
        <Placeholder>public phone</Placeholder>
      ),
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contact.address ?? site.location ?? <Placeholder>city, or full address if visits are open</Placeholder>,
    },
    {
      icon: Clock,
      label: 'Visits',
      value: contact.hours ?? <Placeholder>hours, or &quot;by appointment&quot;</Placeholder>,
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <section className="bg-bhg-cream-warm py-16 md:py-20">
          <div className="container-bhg max-w-3xl">
            <h1 className="section-heading mb-4">Contact</h1>
            <p className="text-body-lg text-bhg-gray-600">
              Questions about a piece, a visit or the collection? Reach {site.galleryName} here.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-bhg max-w-3xl">
            <ul className="space-y-6">
              {rows.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4 items-start">
                  <Icon size={22} aria-hidden="true" className="text-bhg-copper shrink-0 mt-0.5" />
                  <div>
                    <p className="text-caption uppercase tracking-widest text-bhg-black font-sans font-semibold mb-1">{label}</p>
                    <div className="text-body-md text-bhg-gray-600">{value}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 card p-6 border border-bhg-gray-200">
              <p className="text-body-md text-bhg-gray-600">
                Looking for a value on a piece you own? Appraisals are handled by a separate family company.{' '}
                <Link href="/appraisal" className="text-bhg-copper font-medium hover:underline">Request an appraisal</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
