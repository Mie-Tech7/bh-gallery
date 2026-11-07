import type { GalleryArtwork } from './types';

/**
 * Stand in pieces until real artwork photos and details come in.
 * Every field says "Placeholder" so nobody mistakes these for real art.
 * No real titles, artists or prices.
 */
const ASPECTS = [0.8, 1.25, 1, 0.75, 1.5, 0.8, 1.33, 1, 0.7, 1.25, 1, 0.8];

export const PLACEHOLDER_ARTWORKS: GalleryArtwork[] = ASPECTS.map((aspect, i) => {
  const n = i + 1;
  const featured = n === 1;
  return {
    id: `placeholder-${n}`,
    title: `Placeholder Artwork ${n}`,
    artist: 'Artist name coming soon',
    medium: 'Placeholder',
    dimensions: null,
    year: null,
    description:
      'Placeholder piece. The real photo, title, artist and details will come from the gallery.',
    price: null,
    imageUrl: null,
    aspect,
    featured,
    commentary: featured
      ? {
          text:
            'Placeholder commentary. This is where a curator note about a featured piece will go: the story behind the work, the artist, and why it matters. Visitors can read it here or listen to it as they stand in front of the piece.',
          audioUrl: null,
          by: 'Placeholder narrator',
        }
      : null,
    isPlaceholder: true,
  };
});
