import type { Product } from '@/types';
import type { GalleryArtwork } from './types';

export const MUSEUM_TAG = 'museum';

type ProductLike = Pick<
  Product,
  'id' | 'name' | 'description' | 'price' | 'images' | 'artist' | 'isActive' | 'tags' | 'isFeatured'
> & { museum?: Product['museum'] };

/** A product shows in the museum only when it is active and tagged "museum". */
export function isMuseumProduct(product: ProductLike): boolean {
  return product.isActive === true && Array.isArray(product.tags) && product.tags.includes(MUSEUM_TAG);
}

export function productToArtwork(product: ProductLike): GalleryArtwork {
  const m = product.museum ?? {};
  const commentaryText = m.commentary?.trim();
  return {
    id: product.id,
    title: product.name,
    artist: product.artist ?? 'Unknown artist',
    medium: m.medium ?? null,
    dimensions: m.dimensions ?? null,
    year: m.year ?? null,
    description: product.description ?? '',
    price: typeof product.price === 'number' && product.price > 0 ? product.price : null,
    imageUrl: product.images?.[0] ?? null,
    aspect: 1,
    featured: m.featured ?? product.isFeatured ?? false,
    commentary: commentaryText
      ? { text: commentaryText, audioUrl: m.commentaryAudioUrl ?? null, by: m.commentaryBy ?? null }
      : null,
    isPlaceholder: false,
  };
}

/** Featured pieces first, keeping the original order otherwise. */
export function orderForMuseum(artworks: GalleryArtwork[]): GalleryArtwork[] {
  return [...artworks.filter((a) => a.featured), ...artworks.filter((a) => !a.featured)];
}

export function formatPrice(cents: number | null): string | null {
  if (cents == null) return null;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}
