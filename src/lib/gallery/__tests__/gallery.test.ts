import { describe, expect, it } from 'vitest';
import {
  BENCHES,
  fitToSlot,
  moveStep,
  placeArtworks,
  PLAYER_RADIUS,
  resolveCollision,
  ROOM,
  viewpointFor,
  WALL_SLOTS,
} from '../museum-layout';
import { isMuseumProduct, orderForMuseum, productToArtwork } from '../from-product';
import { PLACEHOLDER_ARTWORKS } from '../placeholders';

const base = {
  id: 'p1',
  name: 'Real Title',
  description: 'About the piece',
  price: 12500,
  images: ['https://example.com/a.jpg'],
  artist: 'Real Artist',
  isActive: true,
  tags: ['museum'],
  isFeatured: false,
};

describe('walls keep the visitor in the room', () => {
  it('clamps to the room bounds', () => {
    const p = resolveCollision({ x: 100, z: -100 });
    expect(p.x).toBeCloseTo(ROOM.halfWidth - PLAYER_RADIUS);
    expect(p.z).toBeCloseTo(-ROOM.halfDepth + PLAYER_RADIUS);
  });

  it('pushes the visitor out of a bench', () => {
    const b = BENCHES[0];
    const p = resolveCollision({ x: 0, z: (b.minZ + b.maxZ) / 2 });
    const insideX = p.x > b.minX - PLAYER_RADIUS + 1e-6 && p.x < b.maxX + PLAYER_RADIUS - 1e-6;
    const insideZ = p.z > b.minZ - PLAYER_RADIUS + 1e-6 && p.z < b.maxZ + PLAYER_RADIUS - 1e-6;
    expect(insideX && insideZ).toBe(false);
  });

  it('cannot walk through the north wall', () => {
    let pos = { x: 0, z: -10 };
    for (let i = 0; i < 100; i++) pos = moveStep(pos, 0, 1, 0, 0.2);
    expect(pos.z).toBeGreaterThanOrEqual(-ROOM.halfDepth + PLAYER_RADIUS - 1e-9);
  });

  it('walks forward toward -z when yaw is 0', () => {
    const p = moveStep({ x: 0, z: 9 }, 0, 1, 0, 1);
    expect(p.z).toBeCloseTo(8);
    expect(p.x).toBeCloseTo(0);
  });
});

describe('artwork placement', () => {
  it('fits wide and tall art inside the slot', () => {
    const slot = WALL_SLOTS[3];
    for (const aspect of [0.3, 1, 3]) {
      const { width, height } = fitToSlot(aspect, slot);
      expect(width).toBeLessThanOrEqual(slot.maxWidth + 1e-9);
      expect(height).toBeLessThanOrEqual(slot.maxHeight + 1e-9);
      expect(width / height).toBeCloseTo(aspect);
    }
  });

  it('puts the first piece on the hero wall and ignores extras', () => {
    const placements = placeArtworks(new Array(30).fill(1));
    expect(placements[0].slot.hero).toBe(true);
    expect(placements).toHaveLength(WALL_SLOTS.length);
  });

  it('viewpoints sit inside the room facing the art', () => {
    for (const slot of WALL_SLOTS) {
      const vp = viewpointFor(slot);
      expect(Math.abs(vp.x)).toBeLessThan(ROOM.halfWidth);
      expect(Math.abs(vp.z)).toBeLessThan(ROOM.halfDepth);
      // Looking direction (-sin yaw, -cos yaw) points at the art.
      const dx = slot.x - vp.x;
      const dz = slot.z - vp.z;
      const dot = (-Math.sin(vp.yaw) * dx - Math.cos(vp.yaw) * dz) / Math.hypot(dx, dz);
      expect(dot).toBeGreaterThan(0.95);
    }
  });
});

describe('artwork data', () => {
  it('only shows active products tagged museum', () => {
    expect(isMuseumProduct(base)).toBe(true);
    expect(isMuseumProduct({ ...base, tags: ['heritage'] })).toBe(false);
    expect(isMuseumProduct({ ...base, isActive: false })).toBe(false);
  });

  it('maps commentary, audio and featured flag', () => {
    const art = productToArtwork({
      ...base,
      museum: { featured: true, commentary: ' A note ', commentaryAudioUrl: 'https://example.com/a.mp3', commentaryBy: 'Curator' },
    });
    expect(art.featured).toBe(true);
    expect(art.commentary).toEqual({ text: 'A note', audioUrl: 'https://example.com/a.mp3', by: 'Curator' });
    expect(art.isPlaceholder).toBe(false);
    expect(art.price).toBe(12500);
  });

  it('has no commentary when the text is blank', () => {
    expect(productToArtwork({ ...base, museum: { commentary: '  ' } }).commentary).toBeNull();
  });

  it('orders featured pieces first', () => {
    const a = productToArtwork(base);
    const b = productToArtwork({ ...base, id: 'p2', museum: { featured: true } });
    expect(orderForMuseum([a, b]).map((x) => x.id)).toEqual(['p2', 'p1']);
  });

  it('placeholders are labeled and carry no real names or prices', () => {
    for (const p of PLACEHOLDER_ARTWORKS) {
      expect(p.isPlaceholder).toBe(true);
      expect(p.title).toMatch(/Placeholder/);
      expect(p.price).toBeNull();
    }
    expect(PLACEHOLDER_ARTWORKS.filter((p) => p.commentary)).toHaveLength(1);
  });
});
