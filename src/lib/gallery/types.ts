/**
 * Shared artwork shape for both gallery views (Normal and Museum).
 * Both views read the same list, so a piece looks the same everywhere.
 */
export interface ArtworkCommentary {
  /** Written note shown in the details panel. */
  text: string;
  /** Optional recorded audio (mp3 or m4a). Falls back to read aloud when absent. */
  audioUrl: string | null;
  /** Who is speaking, e.g. the curator. */
  by: string | null;
}

export interface GalleryArtwork {
  id: string;
  title: string;
  artist: string;
  medium: string | null;
  dimensions: string | null;
  year: string | null;
  description: string;
  /** Price in cents, or null when not for sale or not set. */
  price: number | null;
  /** Photo of the piece. Null means a generated placeholder is drawn. */
  imageUrl: string | null;
  /** Width divided by height, used to size the frame. */
  aspect: number;
  /** Featured pieces get the best wall and a spotlight. */
  featured: boolean;
  commentary: ArtworkCommentary | null;
  /** True for stand in content that is not real art. Always labeled on screen. */
  isPlaceholder: boolean;
}

/**
 * A museum room. Only "permanent" is built today. "show" and "auction"
 * are the planned kinds for online art shows and auctions.
 */
export type MuseumRoomKind = 'permanent' | 'show' | 'auction';

export interface MuseumRoom {
  id: string;
  name: string;
  kind: MuseumRoomKind;
  artworkIds: string[];
  /** For shows and auctions: when the room opens and closes (ISO strings). */
  opensAt: string | null;
  closesAt: string | null;
}
