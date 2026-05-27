/**
 * Server-side data fetchers for homepage sections.
 * These run in Next.js Server Components (not client-side).
 * Uses Firebase Admin SDK (no auth context needed for public reads).
 *
 * ISR: Each page.tsx that calls these sets `revalidate = 60`
 * so data refreshes every 60 seconds without a full rebuild.
 */

import { adminDb } from '@/lib/firebase/admin';
import type {
  HeroContent,
  SeasonalContent,
  FeaturedCollectionsContent,
  ShopCategoriesContent,
  FooterContent,
  Product,
  Artist,
  Review,
} from '@/types';

// ============================================
// Site Content (CMS documents)
// ============================================

async function getSiteDoc<T>(section: string): Promise<T | null> {
  try {
    const doc = await adminDb.collection('site_content').doc(section).get();
    if (!doc.exists) return null;
    return doc.data() as T;
  } catch (error) {
    console.error(`[Firestore] Failed to fetch site_content/${section}:`, error);
    return null;
  }
}

export async function fetchHeroContent(): Promise<HeroContent | null> {
  return getSiteDoc<HeroContent>('hero');
}

export async function fetchSeasonalContent(): Promise<SeasonalContent | null> {
  return getSiteDoc<SeasonalContent>('seasonal');
}

export async function fetchFeaturedCollections(): Promise<FeaturedCollectionsContent | null> {
  return getSiteDoc<FeaturedCollectionsContent>('featured_collections');
}

export async function fetchShopCategories(): Promise<ShopCategoriesContent | null> {
  return getSiteDoc<ShopCategoriesContent>('shop_categories');
}

export async function fetchFooterContent(): Promise<FooterContent | null> {
  return getSiteDoc<FooterContent>('footer');
}

// ============================================
// Featured Artists (collection query)
// ============================================

export async function fetchFeaturedArtists(limitCount = 5): Promise<Artist[]> {
  try {
    const snapshot = await adminDb
      .collection('artists')
      .where('isActive', '==', true)
      .where('isFeatured', '==', true)
      .orderBy('featuredOrder', 'asc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Artist[];
  } catch (error) {
    console.error('[Firestore] Failed to fetch featured artists:', error);
    return [];
  }
}

// ============================================
// Featured Products / Top Rated (collection query)
// ============================================

export async function fetchFeaturedProducts(limitCount = 5): Promise<Product[]> {
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('isActive', '==', true)
      .where('isFeatured', '==', true)
      .orderBy('featuredOrder', 'asc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error('[Firestore] Failed to fetch featured products:', error);
    return [];
  }
}

export async function fetchTopRatedProducts(limitCount = 5): Promise<Product[]> {
  try {
    // Firestore can't orderBy on nested field in composite index easily,
    // so we fetch active featured products sorted by featuredOrder
    // and sort by rating client-side. For a small set this is fine.
    const snapshot = await adminDb
      .collection('products')
      .where('isActive', '==', true)
      .where('isFeatured', '==', true)
      .orderBy('featuredOrder', 'asc')
      .limit(20)
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return products
      .sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0))
      .slice(0, limitCount);
  } catch (error) {
    console.error('[Firestore] Failed to fetch top rated products:', error);
    return [];
  }
}

// ============================================
// Recent Approved Reviews (collection query)
// ============================================

export async function fetchRecentReviews(limitCount = 6): Promise<Review[]> {
  try {
    const snapshot = await adminDb
      .collection('reviews')
      .where('isApproved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Serialize Firestore Timestamp for Next.js serialization
        createdAt: data.createdAt?.toDate?.()
          ? { seconds: data.createdAt.seconds, nanoseconds: data.createdAt.nanoseconds }
          : data.createdAt,
      };
    }) as Review[];
  } catch (error) {
    console.error('[Firestore] Failed to fetch reviews:', error);
    return [];
  }
}

// ============================================
// Aggregate: fetch all homepage data in parallel
// ============================================

export interface HomepageData {
  hero: HeroContent | null;
  seasonal: SeasonalContent | null;
  featuredCollections: FeaturedCollectionsContent | null;
  shopCategories: ShopCategoriesContent | null;
  footer: FooterContent | null;
  featuredArtists: Artist[];
  featuredProducts: Product[];
  topRatedProducts: Product[];
  recentReviews: Review[];
}

export async function fetchHomepageData(): Promise<HomepageData> {
  const [
    hero,
    seasonal,
    featuredCollections,
    shopCategories,
    footer,
    featuredArtists,
    featuredProducts,
    topRatedProducts,
    recentReviews,
  ] = await Promise.all([
    fetchHeroContent(),
    fetchSeasonalContent(),
    fetchFeaturedCollections(),
    fetchShopCategories(),
    fetchFooterContent(),
    fetchFeaturedArtists(5),
    fetchFeaturedProducts(5),
    fetchTopRatedProducts(5),
    fetchRecentReviews(6),
  ]);

  return {
    hero,
    seasonal,
    featuredCollections,
    shopCategories,
    footer,
    featuredArtists,
    featuredProducts,
    topRatedProducts,
    recentReviews,
  };
}
