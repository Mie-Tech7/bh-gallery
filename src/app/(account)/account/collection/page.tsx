import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function CollectionPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container-bhg py-12">
          <h1 className="text-display-md font-serif text-bhg-black mb-8">My Collection</h1>
          {/* Collection grid with value tracking */}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
