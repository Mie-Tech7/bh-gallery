import Link from 'next/link';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

/** Stand-in for pages that are not part of the launch site yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[60vh]">
        <div className="container-bhg py-20 text-center max-w-xl">
          <h1 className="text-display-md font-serif text-bhg-black mb-4">{title}</h1>
          <p className="text-body-lg text-bhg-gray-600 mb-8">This part of the site is coming soon.</p>
          <Link href="/contact" className="btn-primary">Contact the gallery</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
