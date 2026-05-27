import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <div className="container-bhg py-12">
          <h1 className="text-display-md font-serif text-bhg-black mb-8">Shop</h1>
          {/* ProductGrid with filters will go here */}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
