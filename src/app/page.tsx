import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { HeroSection } from '@/components/homepage/hero-section';
import { SeasonalFeature } from '@/components/homepage/seasonal-feature';
import { FeaturedCollections } from '@/components/homepage/featured-collections';
import { FeaturedArtists } from '@/components/homepage/featured-artists';
import { ShopByCategory } from '@/components/homepage/shop-by-category';
import { ReviewsSection } from '@/components/homepage/reviews-section';
import { TopRatedProducts } from '@/components/homepage/top-rated-products';
import { AppraisalPreview } from '@/components/homepage/appraisal-preview';
import { CommunitySignup } from '@/components/homepage/community-signup';
import { HeritageMission } from '@/components/homepage/heritage-mission';
import { fetchHomepageData } from '@/lib/firebase/homepage-data';

export const revalidate = 60; // ISR: regenerate every 60 seconds

export default async function HomePage() {
  const data = await fetchHomepageData();

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection content={data.hero} />
        <SeasonalFeature content={data.seasonal} />
        <FeaturedCollections content={data.featuredCollections} />
        <FeaturedArtists artists={data.featuredArtists} />
        <ShopByCategory content={data.shopCategories} />
        <ReviewsSection reviews={data.recentReviews} />
        <TopRatedProducts products={data.topRatedProducts} />
        <AppraisalPreview />
        <CommunitySignup />
        <HeritageMission />
      </main>
      <SiteFooter content={data.footer} />
    </>
  );
}
