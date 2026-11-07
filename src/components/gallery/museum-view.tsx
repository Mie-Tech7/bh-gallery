'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Headphones, HelpCircle, X } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/gallery/types';
import {
  BENCHES,
  moveStep,
  placeArtworks,
  ROOM,
  START_POSITION,
  START_YAW,
  viewpointFor,
  type Placement,
} from '@/lib/gallery/museum-layout';
import {
  floorTexture,
  letteringTexture,
  placeholderArtTexture,
  plaqueTexture,
} from './museum-textures';

export interface MuseumViewProps {
  artworks: GalleryArtwork[];
  /** True while the details panel is open; input is ignored. */
  paused: boolean;
  reducedMotion: boolean;
  onSelect: (artwork: GalleryArtwork) => void;
  /** Called if the 3D view can't run (for example the GPU context is lost). */
  onFallback: () => void;
}

interface Tween {
  from: { x: number; z: number; yaw: number; pitch: number };
  to: { x: number; z: number; yaw: number; pitch: number };
  t: number;
  duration: number;
}

const WALK_SPEED = 2.0;
const RUN_SPEED = 3.6;
const TURN_SPEED = 1.9; // radians per second for keyboard turning
const COMMENTARY_RANGE = 3.4;

function shortestAngle(from: number, to: number) {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export default function MuseumView({ artworks, paused, reducedMotion, onSelect, onFallback }: MuseumViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Latest props for use inside the render loop without rebuilding the scene.
  const pausedRef = useRef(paused);
  const onSelectRef = useRef(onSelect);
  const onFallbackRef = useRef(onFallback);
  const reducedRef = useRef(reducedMotion);
  pausedRef.current = paused;
  onSelectRef.current = onSelect;
  onFallbackRef.current = onFallback;
  reducedRef.current = reducedMotion;

  const joystickRef = useRef({ x: 0, y: 0 });
  const focusRef = useRef<(index: number) => void>(() => {});
  const placementsRef = useRef<Placement[]>([]);

  const [isTouch, setIsTouch] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [nearIndex, setNearIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  const shown = artworks.slice(0, placeArtworks(artworks.map((a) => a.aspect)).length);
  const hasPlaceholders = shown.some((a) => a.isPlaceholder);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
  }, []);

  // Leave pointer lock when the details panel opens.
  useEffect(() => {
    if (paused && document.pointerLockElement) document.exitPointerLock();
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // ---------- Renderer, scene, camera ----------
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: 'high-performance' });
    } catch {
      onFallbackRef.current();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e9e2d8');

    const camera = new THREE.PerspectiveCamera(coarse ? 75 : 68, 1, 0.05, 80);
    camera.rotation.order = 'YXZ';

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

    const W = ROOM.halfWidth;
    const D = ROOM.halfDepth;
    const H = ROOM.height;

    // ---------- Room ----------
    const floorMat = track(new THREE.MeshStandardMaterial({ map: track(floorTexture()), roughness: 0.62, metalness: 0 }));
    const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(W * 2, D * 2)), floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const ceilingMat = track(new THREE.MeshLambertMaterial({ color: '#f6f3ee', emissive: '#c9c0b3' }));
    const ceiling = new THREE.Mesh(track(new THREE.PlaneGeometry(W * 2, D * 2)), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = H;
    scene.add(ceiling);

    // Skylight panels, glowing, no real light cost.
    const panelMat = track(new THREE.MeshBasicMaterial({ color: '#fffaf0' }));
    const panelGeo = track(new THREE.BoxGeometry(2.4, 0.04, 5));
    for (const z of [-7, 0, 7]) {
      const p = new THREE.Mesh(panelGeo, panelMat);
      p.position.set(0, H - 0.02, z);
      scene.add(p);
    }

    const wallMat = track(new THREE.MeshLambertMaterial({ color: '#f1ebe2' }));
    const wallGeoLong = track(new THREE.PlaneGeometry(D * 2, H));
    const wallGeoShort = track(new THREE.PlaneGeometry(W * 2, H));
    const walls: [THREE.PlaneGeometry, number, number, number][] = [
      [wallGeoShort, 0, -D, 0], // north
      [wallGeoShort, 0, D, Math.PI], // south
      [wallGeoLong, W, 0, -Math.PI / 2], // east
      [wallGeoLong, -W, 0, Math.PI / 2], // west
    ];
    for (const [geo, x, z, ry] of walls) {
      const m = new THREE.Mesh(geo, wallMat);
      m.position.set(x, H / 2, z);
      m.rotation.y = ry;
      scene.add(m);
    }

    // Baseboards
    const baseMat = track(new THREE.MeshLambertMaterial({ color: '#2a2019' }));
    const baseNS = track(new THREE.BoxGeometry(W * 2, 0.14, 0.03));
    const baseEW = track(new THREE.BoxGeometry(0.03, 0.14, D * 2));
    for (const [geo, x, z] of [
      [baseNS, 0, -D + 0.015],
      [baseNS, 0, D - 0.015],
      [baseEW, W - 0.015, 0],
      [baseEW, -W + 0.015, 0],
    ] as const) {
      const b = new THREE.Mesh(geo, baseMat);
      b.position.set(x, 0.07, z);
      scene.add(b);
    }

    // Closed doorway on the south wall, a hint at more rooms later.
    const doorMat = track(new THREE.MeshStandardMaterial({ color: '#3a2a1f', roughness: 0.55 }));
    const door = new THREE.Mesh(track(new THREE.BoxGeometry(2.4, 3, 0.08)), doorMat);
    door.position.set(0, 1.5, D - 0.04);
    scene.add(door);
    const soonMat = track(
      new THREE.MeshBasicMaterial({ map: track(letteringTexture('More rooms', 'Coming soon')), transparent: true }),
    );
    const soon = new THREE.Mesh(track(new THREE.PlaneGeometry(2.6, 0.49)), soonMat);
    soon.position.set(0, 3.45, D - 0.02);
    soon.rotation.y = Math.PI;
    scene.add(soon);

    // Gallery name over the hero wall.
    const nameMat = track(
      new THREE.MeshBasicMaterial({
        map: track(letteringTexture('Black Heritage Art Gallery', 'Museum view')),
        transparent: true,
      }),
    );
    const nameSign = new THREE.Mesh(track(new THREE.PlaneGeometry(5.2, 0.975)), nameMat);
    nameSign.position.set(0, 3.85, -D + 0.02);
    scene.add(nameSign);

    // Benches
    const seatMat = track(new THREE.MeshStandardMaterial({ color: '#6b4a32', roughness: 0.5 }));
    const legMat = track(new THREE.MeshStandardMaterial({ color: '#1f1a17', roughness: 0.4, metalness: 0.4 }));
    for (const b of BENCHES) {
      const w = b.maxX - b.minX;
      const d = b.maxZ - b.minZ;
      const cx = (b.minX + b.maxX) / 2;
      const cz = (b.minZ + b.maxZ) / 2;
      const seat = new THREE.Mesh(track(new THREE.BoxGeometry(w, 0.08, d)), seatMat);
      seat.position.set(cx, 0.46, cz);
      scene.add(seat);
      const legGeo = track(new THREE.BoxGeometry(0.08, 0.42, d * 0.9));
      for (const lx of [b.minX + 0.15, b.maxX - 0.15]) {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 0.21, cz);
        scene.add(leg);
      }
    }

    // ---------- Lights ----------
    scene.add(new THREE.HemisphereLight('#fff6ea', '#8a6a50', 1.25));
    scene.add(new THREE.AmbientLight('#ffffff', 0.5));

    // ---------- Artworks ----------
    const placements = placeArtworks(artworks.map((a) => a.aspect));
    placementsRef.current = placements;
    const clickable: THREE.Object3D[] = [];
    const maxSpots = coarse ? 6 : 13;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    placements.forEach((pl, i) => {
      const art = artworks[i];
      const { slot, width, height } = pl;
      const group = new THREE.Group();
      group.position.set(slot.x, slot.y, slot.z);
      group.rotation.y = slot.rotationY;

      const frameMat = track(
        art.featured
          ? new THREE.MeshStandardMaterial({ color: '#b08d57', roughness: 0.35, metalness: 0.65 })
          : new THREE.MeshStandardMaterial({ color: '#2a1d14', roughness: 0.5, metalness: 0.1 }),
      );
      const border = art.featured ? 0.12 : 0.08;
      const frame = new THREE.Mesh(track(new THREE.BoxGeometry(width + border * 2, height + border * 2, 0.06)), frameMat);
      frame.position.z = 0.03;
      group.add(frame);

      const artMat = track(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 }));
      if (art.imageUrl) {
        artMat.color.set('#ddd5c8');
        loader.load(
          art.imageUrl,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 4;
            track(tex);
            artMat.map = tex;
            artMat.color.set('#ffffff');
            artMat.needsUpdate = true;
          },
          undefined,
          () => {
            artMat.map = track(placeholderArtTexture(art, i));
            artMat.color.set('#ffffff');
            artMat.needsUpdate = true;
          },
        );
      } else {
        artMat.map = track(placeholderArtTexture(art, i));
      }
      const canvasMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(width, height)), artMat);
      canvasMesh.position.z = 0.062;
      canvasMesh.userData.artIndex = i;
      frame.userData.artIndex = i;
      group.add(canvasMesh);
      clickable.push(canvasMesh, frame);

      const plaqueMat = track(new THREE.MeshBasicMaterial({ map: track(plaqueTexture(art)) }));
      const plaque = new THREE.Mesh(track(new THREE.PlaneGeometry(0.44, 0.22)), plaqueMat);
      plaque.position.set(width / 2 + border + 0.38, -0.3, 0.01);
      plaque.userData.artIndex = i;
      group.add(plaque);
      clickable.push(plaque);

      scene.add(group);

      if (i < maxSpots) {
        const normal = new THREE.Vector3(Math.sin(slot.rotationY), 0, Math.cos(slot.rotationY));
        const spot = new THREE.SpotLight('#ffe7c4', art.featured ? 70 : 42, 10, art.featured ? 0.5 : 0.42, 0.6, 1.6);
        spot.position.set(slot.x + normal.x * 1.9, H - 0.15, slot.z + normal.z * 1.9);
        spot.target.position.set(slot.x, slot.y, slot.z);
        scene.add(spot, spot.target);
      }
    });

    // ---------- Player state ----------
    const pos = { ...START_POSITION };
    let yaw = START_YAW;
    let pitch = 0;
    let tween: Tween | null = null;
    const keys = new Set<string>();

    focusRef.current = (index: number) => {
      const pl = placementsRef.current[index];
      if (!pl) return;
      const vp = viewpointFor(pl.slot, art_distance(pl));
      const to = { x: vp.x, z: vp.z, yaw: vp.yaw, pitch: 0 };
      if (reducedRef.current) {
        pos.x = to.x;
        pos.z = to.z;
        yaw = to.yaw;
        pitch = 0;
        tween = null;
      } else {
        tween = { from: { x: pos.x, z: pos.z, yaw, pitch }, to, t: 0, duration: 0.9 };
      }
    };
    // Stand far enough back that the whole piece fits on screen, even on a narrow phone.
    function art_distance(pl: Placement) {
      const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
      const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
      const frameW = pl.width + 0.5;
      const frameH = pl.height + 0.5;
      return Math.min(6, Math.max(2.2, frameW / (2 * Math.tan(hHalf)), frameH / (2 * Math.tan(vHalf))));
    }

    // ---------- Input: keyboard ----------
    const MOVE_KEYS = new Set([
      'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight',
    ]);
    const onKeyDown = (e: KeyboardEvent) => {
      if (pausedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (MOVE_KEYS.has(e.code)) {
        keys.add(e.code);
        tween = null;
        if (e.code.startsWith('Arrow')) e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    const onBlur = () => keys.clear();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    // ---------- Input: pointer (mouse look, drag look, tap to inspect) ----------
    const raycaster = new THREE.Raycaster();
    raycaster.far = 14;
    const ndc = new THREE.Vector2();
    const downs = new Map<number, { x: number; y: number; lastX: number; lastY: number; t: number; moved: boolean }>();

    const pickAt = (clientX: number | null, clientY: number | null) => {
      if (clientX == null || clientY == null) ndc.set(0, 0);
      else {
        const rect = canvas.getBoundingClientRect();
        ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      }
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(clickable, false)[0];
      const idx = hit?.object.userData.artIndex;
      return typeof idx === 'number' ? idx : null;
    };

    const lookSens = () => (reducedRef.current ? 0.0014 : 0.0022);
    const dragSens = () => (reducedRef.current ? 0.0035 : 0.005);

    const onPointerDown = (e: PointerEvent) => {
      if (pausedRef.current) return;
      downs.set(e.pointerId, { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, t: performance.now(), moved: false });
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pausedRef.current) return;
      if (document.pointerLockElement === canvas) {
        yaw -= e.movementX * lookSens();
        pitch -= e.movementY * lookSens();
        tween = null;
      } else {
        const d = downs.get(e.pointerId);
        if (!d) return;
        const dx = e.clientX - d.lastX;
        const dy = e.clientY - d.lastY;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) d.moved = true;
        if (d.moved) {
          yaw += dx * dragSens();
          pitch += dy * dragSens();
          tween = null;
        }
      }
      pitch = Math.max(-1.2, Math.min(1.2, pitch));
    };
    const onPointerUp = (e: PointerEvent) => {
      const d = downs.get(e.pointerId);
      downs.delete(e.pointerId);
      if (pausedRef.current) return;
      const isLocked = document.pointerLockElement === canvas;
      if (isLocked) {
        const idx = pickAt(null, null);
        if (idx != null) onSelectRef.current(artworks[idx]);
        return;
      }
      if (!d || d.moved || performance.now() - d.t > 600) return;
      const idx = pickAt(e.clientX, e.clientY);
      if (idx != null) {
        onSelectRef.current(artworks[idx]);
      } else if (e.pointerType === 'mouse' && canvas.requestPointerLock) {
        try {
          const r = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
          r?.catch?.(() => {});
        } catch {
          /* drag to look still works */
        }
      }
    };
    const onLockChange = () => setLocked(document.pointerLockElement === canvas);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    document.addEventListener('pointerlockchange', onLockChange);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      onFallbackRef.current();
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    // ---------- Resize ----------
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---------- Loop ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let lastNear: number | null = null;
    const withCommentary = artworks
      .map((a, i) => (a.commentary && i < placements.length ? i : -1))
      .filter((i) => i >= 0);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);

      if (!pausedRef.current) {
        const k = (c: string) => (keys.has(c) ? 1 : 0);
        const forward = k('KeyW') + k('ArrowUp') - k('KeyS') - k('ArrowDown') - joystickRef.current.y;
        const strafe = k('KeyD') - k('KeyA') + joystickRef.current.x;
        const turn = k('ArrowLeft') + k('KeyQ') - k('ArrowRight') - k('KeyE');
        yaw += turn * TURN_SPEED * (reducedRef.current ? 0.7 : 1) * dt;
        const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? RUN_SPEED : WALK_SPEED;
        if (forward !== 0 || strafe !== 0) {
          tween = null;
          const next = moveStep(pos, yaw, forward, strafe, speed * dt);
          pos.x = next.x;
          pos.z = next.z;
        }
      }

      if (tween) {
        tween.t = Math.min(1, tween.t + dt / tween.duration);
        const e = tween.t < 0.5 ? 2 * tween.t * tween.t : 1 - Math.pow(-2 * tween.t + 2, 2) / 2;
        pos.x = tween.from.x + (tween.to.x - tween.from.x) * e;
        pos.z = tween.from.z + (tween.to.z - tween.from.z) * e;
        yaw = tween.from.yaw + shortestAngle(tween.from.yaw, tween.to.yaw) * e;
        pitch = tween.from.pitch + (tween.to.pitch - tween.from.pitch) * e;
        if (tween.t >= 1) tween = null;
      }

      camera.position.set(pos.x, ROOM.eyeHeight, pos.z);
      camera.rotation.set(pitch, yaw, 0);

      // Commentary prompt when standing near a piece that has one and facing it.
      let near: number | null = null;
      for (const i of withCommentary) {
        const s = placements[i].slot;
        const dx = s.x - pos.x;
        const dz = s.z - pos.z;
        const dist = Math.hypot(dx, dz);
        const facing = (-Math.sin(yaw) * dx - Math.cos(yaw) * dz) / (dist || 1);
        if (dist < COMMENTARY_RANGE + Math.max(placements[i].width, 2) * 0.5 && facing > 0.6) near = i;
      }
      if (near !== lastNear) {
        lastNear = near;
        setNearIndex(near);
      }

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      document.removeEventListener('pointerlockchange', onLockChange);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [artworks]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const count = placementsRef.current.length;
      if (!count) return;
      const next = (focusIndex + dir + count) % count;
      setFocusIndex(next);
      focusRef.current(next);
    },
    [focusIndex],
  );

  const nearArt = nearIndex != null ? artworks[nearIndex] : null;

  return (
    <div ref={containerRef} className="absolute inset-0 select-none overflow-hidden bg-[#e9e2d8]">
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none outline-none"
        aria-label="3D museum room. Use the buttons below to move between artworks."
        tabIndex={0}
      />

      {locked && (
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-0 h-full w-px bg-white mix-blend-difference" />
          <div className="absolute top-1/2 left-0 h-px w-full bg-white mix-blend-difference" />
        </div>
      )}

      {hasPlaceholders && (
        <div className="absolute left-3 top-3 rounded-full bg-bhg-black/80 px-3 py-1 text-caption font-sans font-semibold uppercase text-bhg-cream">
          Placeholder art. Real pieces coming soon.
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowHelp((v) => !v)}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-bhg-black shadow-card"
        aria-label={showHelp ? 'Hide controls help' : 'Show controls help'}
      >
        <HelpCircle size={20} />
      </button>

      {showHelp && !paused && (
        <div className="absolute left-1/2 top-1/2 w-[min(92%,26rem)] -translate-y-1/2 -translate-x-1/2 rounded-card bg-white/95 p-4 text-body-sm font-sans text-bhg-black shadow-modal">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">How to walk around</p>
            <button type="button" onClick={() => setShowHelp(false)} aria-label="Close help" className="p-1">
              <X size={18} />
            </button>
          </div>
          {isTouch ? (
            <ul className="list-disc space-y-1 pl-5 text-bhg-gray-600">
              <li>Use the joystick at bottom left to walk.</li>
              <li>Drag anywhere else to look around.</li>
              <li>Tap a piece to see its details.</li>
              <li>Or use the arrows to jump between pieces.</li>
            </ul>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-bhg-gray-600">
              <li>W A S D or arrow keys to walk. Shift to walk faster.</li>
              <li>Click the room to look with your mouse. Esc to stop.</li>
              <li>You can also drag to look. Q and E or left and right arrows turn.</li>
              <li>Click a piece to see its details.</li>
            </ul>
          )}
        </div>
      )}

      {nearArt?.commentary && !paused && (
        <button
          type="button"
          onClick={() => onSelect(nearArt)}
          className="absolute left-1/2 top-14 flex max-w-[90%] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-bhg-copper px-4 py-2.5 text-body-sm font-sans font-semibold text-white shadow-modal"
        >
          <Headphones size={18} className="shrink-0" />
          <span className="truncate">Commentary on {nearArt.title}</span>
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex h-11 items-center gap-1 rounded-full bg-white/95 px-4 text-body-sm font-sans font-medium text-bhg-black shadow-card"
          aria-label="Go to previous artwork"
        >
          <ChevronLeft size={18} /> Prev
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex h-11 items-center gap-1 rounded-full bg-white/95 px-4 text-body-sm font-sans font-medium text-bhg-black shadow-card"
          aria-label="Go to next artwork"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {isTouch && <Joystick valueRef={joystickRef} disabled={paused} />}
    </div>
  );
}

function Joystick({ valueRef, disabled }: { valueRef: React.RefObject<{ x: number; y: number }>; disabled: boolean }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activeId = useRef<number | null>(null);
  const RADIUS = 44;

  const update = (clientX: number, clientY: number) => {
    const el = baseRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let dx = clientX - (r.left + r.width / 2);
    let dy = clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    setKnob({ x: dx, y: dy });
    valueRef.current.x = dx / RADIUS;
    valueRef.current.y = dy / RADIUS;
  };
  const reset = () => {
    activeId.current = null;
    setKnob({ x: 0, y: 0 });
    valueRef.current.x = 0;
    valueRef.current.y = 0;
  };

  useEffect(() => {
    if (disabled) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <div
      ref={baseRef}
      className="absolute bottom-20 left-5 h-28 w-28 touch-none rounded-full border border-white/70 bg-black/25 backdrop-blur-sm"
      onPointerDown={(e) => {
        if (disabled) return;
        activeId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (activeId.current === e.pointerId) update(e.clientX, e.clientY);
      }}
      onPointerUp={reset}
      onPointerCancel={reset}
      role="presentation"
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 h-12 w-12 rounded-full bg-white/90 shadow-card"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
