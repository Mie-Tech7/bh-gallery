import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container-bhg py-12">
          <h1 className="text-display-md font-serif text-bhg-black text-center mb-2">Gallery</h1>
          <p className="text-body-lg text-bhg-gray-600 text-center mb-12">
            Explore our curated collection of exceptional Black and African art
          </p>
          {/* Gallery browser with AR view */}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
