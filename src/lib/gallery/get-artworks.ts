import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import type { Product } from '@/types';
import { PLACEHOLDER_ARTWORKS } from './placeholders';
import { isMuseumProduct, MUSEUM_TAG, orderForMuseum, productToArtwork } from './from-product';
import type { GalleryArtwork } from './types';

/**
 * Artworks for both gallery views. Reads products tagged "museum" from
 * Firestore. Until any exist (or Firestore can't be reached) it returns
 * clearly labeled placeholders, so the seeded demo products never show here.
 */
export async function getGalleryArtworks(): Promise<GalleryArtwork[]> {
  try {
    const snapshot = await adminDb
      .collection('products')
      .where('tags', 'array-contains', MUSEUM_TAG)
      .limit(40)
      .get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
    const artworks = products.filter(isMuseumProduct).map(productToArtwork);
    if (artworks.length > 0) return orderForMuseum(artworks);
  } catch (error) {
    console.error('[Firestore] Failed to fetch museum artworks, using placeholders:', error);
  }
  return PLACEHOLDER_ARTWORKS;
}
