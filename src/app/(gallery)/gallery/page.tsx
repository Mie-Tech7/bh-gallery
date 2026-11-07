import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { GalleryViews } from '@/components/gallery/gallery-views';
import { getGalleryArtworks } from '@/lib/gallery/get-artworks';

export const revalidate = 60;

export default async function GalleryPage() {
  const artworks = await getGalleryArtworks();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container-bhg py-12">
          <h1 className="text-display-md font-serif text-bhg-black text-center mb-2">Gallery</h1>
          <p className="text-body-lg text-bhg-gray-600 text-center mb-8">
            Explore our curated collection of exceptional Black and African art
          </p>
          <GalleryViews artworks={artworks} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
