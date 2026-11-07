/**
 * Pure geometry for the museum room: where walls, benches and frames go,
 * and how the visitor is kept inside the room. No Three.js here, so it can
 * be unit tested.
 *
 * Units are meters. +x is east, -z is north. The visitor starts near the
 * south wall looking north.
 */

export const ROOM = {
  halfWidth: 8, // x from -8 to 8
  halfDepth: 12, // z from -12 to 12
  height: 4.6,
  eyeHeight: 1.6,
  hangHeight: 1.65, // center of each artwork
} as const;

export const PLAYER_RADIUS = 0.55;

export interface Box2 {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/** Benches in the middle of the room (also used as obstacles). */
export const BENCHES: Box2[] = [
  { minX: -1.3, maxX: 1.3, minZ: -3.3, maxZ: -2.7 },
  { minX: -1.3, maxX: 1.3, minZ: 3.7, maxZ: 4.3 },
];

export const START_POSITION = { x: 0, z: 9.5 };
export const START_YAW = 0; // looking north (-z)

export type WallSide = 'north' | 'east' | 'west' | 'south';

export interface WallSlot {
  wall: WallSide;
  x: number;
  y: number;
  z: number;
  /** Rotation around Y so the art faces into the room. */
  rotationY: number;
  /** Largest width the frame may take on this slot. */
  maxWidth: number;
  maxHeight: number;
  /** Larger slots are for featured pieces. */
  hero: boolean;
}

const { halfWidth: W, halfDepth: D, hangHeight: Y } = ROOM;
const INSET = 0.06; // art sits just off the wall

/** Wall slots in the order they are filled. Featured pieces take the first ones. */
export const WALL_SLOTS: WallSlot[] = [
  // North wall: hero piece in the middle, two flanking.
  { wall: 'north', x: 0, y: Y + 0.15, z: -D + INSET, rotationY: 0, maxWidth: 3.2, maxHeight: 2.4, hero: true },
  { wall: 'north', x: -4.8, y: Y, z: -D + INSET, rotationY: 0, maxWidth: 2, maxHeight: 1.8, hero: false },
  { wall: 'north', x: 4.8, y: Y, z: -D + INSET, rotationY: 0, maxWidth: 2, maxHeight: 1.8, hero: false },
  // East wall, north to south. Faces west.
  ...[-7.5, -2.5, 2.5, 7.5].map((z) => ({
    wall: 'east' as const, x: W - INSET, y: Y, z, rotationY: -Math.PI / 2, maxWidth: 2.2, maxHeight: 1.8, hero: false,
  })),
  // West wall, north to south. Faces east.
  ...[-7.5, -2.5, 2.5, 7.5].map((z) => ({
    wall: 'west' as const, x: -W + INSET, y: Y, z, rotationY: Math.PI / 2, maxWidth: 2.2, maxHeight: 1.8, hero: false,
  })),
  // South wall, either side of the entrance. Faces north.
  { wall: 'south', x: -4.8, y: Y, z: D - INSET, rotationY: Math.PI, maxWidth: 2, maxHeight: 1.8, hero: false },
  { wall: 'south', x: 4.8, y: Y, z: D - INSET, rotationY: Math.PI, maxWidth: 2, maxHeight: 1.8, hero: false },
];

export interface Placement {
  slot: WallSlot;
  width: number;
  height: number;
}

/** Fit an artwork of the given aspect (width / height) inside a slot. */
export function fitToSlot(aspect: number, slot: WallSlot): { width: number; height: number } {
  const safe = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  let height = slot.maxHeight;
  let width = height * safe;
  if (width > slot.maxWidth) {
    width = slot.maxWidth;
    height = width / safe;
  }
  return { width, height };
}

/** Assign artworks to slots in order. Extra pieces beyond the slots are left for another room. */
export function placeArtworks(aspects: number[]): Placement[] {
  return aspects.slice(0, WALL_SLOTS.length).map((aspect, i) => {
    const slot = WALL_SLOTS[i];
    return { slot, ...fitToSlot(aspect, slot) };
  });
}

/** Where to stand to look at a slot: in front of it, facing it. */
export function viewpointFor(slot: WallSlot, distance = 2.6): { x: number; z: number; yaw: number } {
  // The art's front faces along (sin r, cos r), which points into the room.
  const normal = { x: Math.sin(slot.rotationY), z: Math.cos(slot.rotationY) };
  const pos = { x: slot.x + normal.x * distance, z: slot.z + normal.z * distance };
  const clamped = resolveCollision(pos);
  // Yaw 0 looks toward -z; yaw that faces the art is the slot rotation.
  return { ...clamped, yaw: slot.rotationY };
}

/**
 * Keep the visitor inside the room and out of the benches.
 * Returns a corrected position.
 */
export function resolveCollision(
  pos: { x: number; z: number },
  radius = PLAYER_RADIUS,
  obstacles: Box2[] = BENCHES,
): { x: number; z: number } {
  let x = Math.min(Math.max(pos.x, -W + radius), W - radius);
  let z = Math.min(Math.max(pos.z, -D + radius), D - radius);

  for (const b of obstacles) {
    const cx = Math.min(Math.max(x, b.minX), b.maxX);
    const cz = Math.min(Math.max(z, b.minZ), b.maxZ);
    const dx = x - cx;
    const dz = z - cz;
    const distSq = dx * dx + dz * dz;
    if (distSq < radius * radius) {
      if (distSq > 1e-9) {
        const dist = Math.sqrt(distSq);
        x = cx + (dx / dist) * radius;
        z = cz + (dz / dist) * radius;
      } else {
        // Center is inside the box: push out the shortest way.
        const pushes = [
          { d: x - b.minX, x: b.minX - radius, z },
          { d: b.maxX - x, x: b.maxX + radius, z },
          { d: z - b.minZ, x, z: b.minZ - radius },
          { d: b.maxZ - z, x, z: b.maxZ + radius },
        ].sort((a, c) => a.d - c.d);
        x = pushes[0].x;
        z = pushes[0].z;
      }
    }
  }
  return { x, z };
}

/**
 * Movement step from input. forward and strafe are in [-1, 1].
 * yaw 0 looks toward -z.
 */
export function moveStep(
  pos: { x: number; z: number },
  yaw: number,
  forward: number,
  strafe: number,
  distance: number,
): { x: number; z: number } {
  const len = Math.hypot(forward, strafe);
  if (len < 1e-6) return pos;
  const f = forward / Math.max(1, len);
  const s = strafe / Math.max(1, len);
  const dx = (-Math.sin(yaw) * f + Math.cos(yaw) * s) * distance;
  const dz = (-Math.cos(yaw) * f - Math.sin(yaw) * s) * distance;
  return resolveCollision({ x: pos.x + dx, z: pos.z + dz });
}
