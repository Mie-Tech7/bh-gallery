import * as THREE from 'three';
import type { GalleryArtwork } from '@/lib/gallery/types';

/**
 * All textures in the museum are drawn in code on small canvases, so the
 * view ships no image files and needs no third party assets.
 */

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, opts: { repeat?: [number, number]; anisotropy?: number } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (opts.repeat) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  t.anisotropy = opts.anisotropy ?? 4;
  return t;
}

// Small deterministic random so each placeholder looks the same every visit.
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const PALETTES = [
  ['#c17f3e', '#3b2a1e', '#e8d5b7', '#7a3b2e'],
  ['#2f4858', '#c17f3e', '#f2e8cf', '#86615c'],
  ['#5b3a29', '#d4a574', '#1f3a3d', '#e9dcc9'],
  ['#8c2f39', '#f7f3ee', '#2b2d42', '#c17f3e'],
];

/** Abstract placeholder canvas, stamped PLACEHOLDER so it never reads as real art. */
export function placeholderArtTexture(art: GalleryArtwork, index: number): THREE.Texture {
  const base = 512;
  const w = art.aspect >= 1 ? base : Math.round(base * art.aspect);
  const h = art.aspect >= 1 ? Math.round(base / art.aspect) : base;
  const { c, ctx } = canvas(w, h);
  const rand = seeded(index * 7919 + 17);
  const pal = PALETTES[index % PALETTES.length];

  ctx.fillStyle = pal[2];
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 9; i++) {
    ctx.globalAlpha = 0.55 + rand() * 0.4;
    ctx.fillStyle = pal[Math.floor(rand() * pal.length)];
    const x = rand() * w;
    const y = rand() * h;
    const r = (0.12 + rand() * 0.3) * Math.min(w, h);
    ctx.beginPath();
    if (rand() > 0.5) ctx.arc(x, y, r, 0, Math.PI * 2);
    else ctx.rect(x - r, y - r * 0.6, r * 2, r * 1.2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Label band
  const band = Math.round(h * 0.16);
  ctx.fillStyle = 'rgba(26,26,26,0.78)';
  ctx.fillRect(0, h / 2 - band / 2, w, band);
  ctx.fillStyle = '#f7f3ee';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.round(band * 0.42)}px system-ui, sans-serif`;
  ctx.fillText('PLACEHOLDER', w / 2, h / 2 - band * 0.12);
  ctx.font = `500 ${Math.round(band * 0.2)}px system-ui, sans-serif`;
  ctx.fillText('Artwork photo coming soon', w / 2, h / 2 + band * 0.28);
  return toTexture(c);
}

/** Small wall label under each piece. */
export function plaqueTexture(art: GalleryArtwork): THREE.Texture {
  const { c, ctx } = canvas(512, 256);
  ctx.fillStyle = '#f7f3ee';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'top';
  ctx.font = '600 40px Georgia, serif';
  ctx.fillText(truncate(ctx, art.title, 470), 24, 28);
  ctx.font = '400 30px system-ui, sans-serif';
  ctx.fillStyle = '#6b6b6b';
  ctx.fillText(truncate(ctx, art.artist, 470), 24, 86);
  ctx.fillText(truncate(ctx, art.medium ?? '', 470), 24, 128);
  ctx.fillStyle = '#c17f3e';
  ctx.font = '600 26px system-ui, sans-serif';
  ctx.fillText(art.commentary ? 'Commentary available. Tap the piece.' : 'Tap the piece for details', 24, 190);
  return toTexture(c);
}

function truncate(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t}…`;
}

/** Warm wood floor planks. */
export function floorTexture(): THREE.Texture {
  const { c, ctx } = canvas(512, 512);
  const rand = seeded(42);
  const plank = 64;
  for (let row = 0; row < 512 / plank; row++) {
    let x = -rand() * 200;
    while (x < 512) {
      const len = 160 + rand() * 180;
      const shade = 0.85 + rand() * 0.25;
      ctx.fillStyle = `rgb(${Math.round(122 * shade)}, ${Math.round(84 * shade)}, ${Math.round(56 * shade)})`;
      ctx.fillRect(x, row * plank, len, plank);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x, row * plank, 2, plank);
      x += len;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, row * plank, 512, 2);
  }
  // Light grain
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = rand() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(rand() * 512, rand() * 512, 40 + rand() * 80, 1);
  }
  ctx.globalAlpha = 1;
  return toTexture(c, { repeat: [5, 7], anisotropy: 8 });
}

/** Painted wall lettering, e.g. the gallery name over the hero piece. */
export function letteringTexture(title: string, subtitle: string): THREE.Texture {
  const { c, ctx } = canvas(1024, 192);
  ctx.clearRect(0, 0, 1024, 192);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '400 84px Georgia, serif';
  ctx.fillText(title, 512, 96);
  ctx.fillStyle = '#a06830';
  ctx.font = '600 30px system-ui, sans-serif';
  ctx.fillText(subtitle.toUpperCase(), 512, 158);
  return toTexture(c);
}
