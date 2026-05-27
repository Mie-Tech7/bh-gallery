import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ArtistsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container-bhg py-12">
          <h1 className="text-display-md font-serif text-bhg-black text-center mb-2">Featured Artists</h1>
          <p className="text-body-lg text-bhg-gray-600 text-center mb-12">
            Galleries dedicated to the lifework of artists shaping Black and African visual culture
          </p>
          {/* Artist cards grid */}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
