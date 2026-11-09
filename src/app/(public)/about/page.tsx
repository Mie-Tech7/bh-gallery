import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Placeholder } from '@/components/ui/placeholder';
import { site, listToText } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: `The story of ${site.galleryName} and its founder, ${site.founderName}.`,
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <section className="bg-bhg-cream-warm py-16 md:py-20">
          <div className="container-bhg max-w-3xl">
            <h1 className="section-heading mb-4">About the gallery</h1>
            <p className="text-body-lg text-bhg-gray-600 leading-relaxed mb-3">
              {site.galleryName} was founded by {site.founderName}. It began as {site.formerName}.
            </p>
            <p className="font-serif italic text-body-lg text-bhg-black">{site.mission}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-bhg max-w-3xl space-y-14">
            <div>
              <h2 className="font-serif text-heading-lg text-bhg-black mb-4">Our story</h2>
              <div className="space-y-4 text-body-lg text-bhg-gray-600 leading-relaxed">
                {site.story.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-amber-900/60 via-stone-700/40 to-stone-800/70 flex items-center justify-center p-4">
                <Placeholder>headshot</Placeholder>
              </div>
              <div>
                <h2 className="font-serif text-heading-lg text-bhg-black mb-4">{site.founderName}</h2>
                <p className="text-body-md text-bhg-gray-600 mb-4">Founder and owner</p>
                <div className="space-y-4">
                  {site.founderBio.map((para) => (
                    <p key={para} className="text-body-lg text-bhg-gray-600 leading-relaxed">{para}</p>
                  ))}
                  <p className="text-body-lg text-bhg-gray-600 leading-relaxed">{site.biggersLine}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-heading-lg text-bhg-black mb-4">Artists we know best</h2>
              <p className="text-body-lg text-bhg-gray-600 leading-relaxed mb-3">
                {site.founderName} knows the early masters of African American art deeply:{' '}
                {listToText(site.artistsKnown)}. Closer to home, she knows the work of Houston
                artists {listToText(site.houstonArtistsKnown)}.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-heading-lg text-bhg-black mb-4">Artists the gallery has carried</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-body-md text-bhg-gray-600">
                {site.artistsCarried.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <p className="text-body-sm text-bhg-gray-600 mt-3">And many more.</p>
            </div>

            <div className="border-t border-bhg-gray-200 pt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">Get in touch</Link>
              <Link href="/appraisal" className="btn-secondary">Appraisals</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
