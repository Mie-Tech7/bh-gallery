'use client';

import dynamic from 'next/dynamic';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Headphones, LayoutGrid } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/gallery/types';
import { formatPrice } from '@/lib/gallery/from-product';
import { cn } from '@/lib/utils';
import { ArtworkDetails } from './artwork-details';

// Three.js only loads when someone opens the Museum view.
const MuseumView = dynamic(() => import('./museum-view'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#e9e2d8] font-sans text-body-md text-bhg-gray-600">
      Opening the museum…
    </div>
  ),
});

type View = 'normal' | 'museum';

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function setViewInUrl(view: View) {
  const url = new URL(window.location.href);
  if (view === 'museum') url.searchParams.set('view', 'museum');
  else url.searchParams.delete('view');
  window.history.replaceState(null, '', url);
}

export function GalleryViews({ artworks }: { artworks: GalleryArtwork[] }) {
  const [view, setView] = useState<View>('normal');
  const [selected, setSelected] = useState<GalleryArtwork | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const openMuseum = useCallback(() => {
    if (!hasWebGL()) {
      setNotice("Museum view needs 3D graphics, which this device or browser doesn't support. Here's the normal view.");
      setView('normal');
      setViewInUrl('normal');
      return;
    }
    setNotice(null);
    setView('museum');
    setViewInUrl('museum');
  }, []);

  const openNormal = useCallback(() => {
    setView('normal');
    setViewInUrl('normal');
  }, []);

  const fallback = useCallback(() => {
    setNotice('The museum view stopped working on this device, so we switched you to the normal view.');
    openNormal();
  }, [openNormal]);

  // Lock page scroll while the museum fills the screen.
  useEffect(() => {
    if (view !== 'museum') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [view]);

  const closeDetails = useCallback(() => setSelected(null), []);
  const hasPlaceholders = artworks.some((a) => a.isPlaceholder);

  return (
    <>
      <Suspense fallback={null}>
        <MuseumLinkWatcher onMuseum={openMuseum} />
      </Suspense>
      <ViewToggle view={view} onNormal={openNormal} onMuseum={openMuseum} className="mx-auto mb-8" />

      {notice && (
        <p role="status" className="mx-auto mb-6 max-w-xl rounded-card bg-bhg-cream p-3 text-center text-body-sm text-bhg-gray-600">
          {notice}
        </p>
      )}

      {hasPlaceholders && (
        <p className="mx-auto mb-6 max-w-xl text-center text-body-sm text-bhg-gray-600">
          These are placeholders. Real artwork photos and details are coming soon.
        </p>
      )}

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art, i) => (
          <li key={art.id}>
            <button
              type="button"
              onClick={() => setSelected(art)}
              className="group block w-full overflow-hidden rounded-card bg-white text-left shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-bhg-cream">
                {art.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={art.imageUrl} alt={art.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <PlaceholderSwatch index={i} />
                )}
                {art.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-bhg-copper px-2.5 py-1 text-caption font-semibold uppercase text-white">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4 font-sans">
                <p className="font-serif text-heading-sm text-bhg-black">{art.title}</p>
                <p className="text-body-sm text-bhg-gray-600">{art.artist}</p>
                <div className="mt-2 flex items-center justify-between text-body-sm">
                  <span className="text-bhg-copper">{formatPrice(art.price) ?? ''}</span>
                  {art.commentary && (
                    <span className="flex items-center gap-1 text-bhg-gray-600">
                      <Headphones size={14} /> Commentary
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {view === 'museum' && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bhg-black" role="region" aria-label="Museum view">
          <div className="flex h-14 shrink-0 items-center justify-between bg-white px-3 shadow-nav sm:px-5">
            <p className="hidden font-serif text-heading-sm text-bhg-copper sm:block">Black Heritage Gallery</p>
            <ViewToggle view={view} onNormal={openNormal} onMuseum={openMuseum} />
          </div>
          <div className="relative flex-1">
            <MuseumView
              artworks={artworks}
              paused={selected != null}
              reducedMotion={reducedMotion}
              onSelect={setSelected}
              onFallback={fallback}
            />
          </div>
        </div>
      )}

      {selected && <ArtworkDetails artwork={selected} onClose={closeDetails} />}
    </>
  );
}

/** Opens the museum when the address has ?view=museum, e.g. from the header link. */
function MuseumLinkWatcher({ onMuseum }: { onMuseum: () => void }) {
  const wantsMuseum = useSearchParams().get('view') === 'museum';
  useEffect(() => {
    if (wantsMuseum) onMuseum();
  }, [wantsMuseum, onMuseum]);
  return null;
}

function ViewToggle({
  view,
  onNormal,
  onMuseum,
  className,
}: {
  view: View;
  onNormal: () => void;
  onMuseum: () => void;
  className?: string;
}) {
  const item = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 rounded-full px-4 py-2 text-body-sm font-sans font-semibold transition-colors',
      active ? 'bg-bhg-black text-white' : 'text-bhg-gray-600 hover:text-bhg-black',
    );
  return (
    <div role="group" aria-label="Choose a view" className={cn('flex w-fit rounded-full bg-bhg-cream p-1', className)}>
      <button type="button" aria-pressed={view === 'normal'} onClick={onNormal} className={item(view === 'normal')}>
        <LayoutGrid size={16} /> Normal view
      </button>
      <button type="button" aria-pressed={view === 'museum'} onClick={onMuseum} className={item(view === 'museum')}>
        <Box size={16} /> Museum view
      </button>
    </div>
  );
}

const SWATCHES = [
  'from-[#c17f3e] to-[#3b2a1e]',
  'from-[#2f4858] to-[#c17f3e]',
  'from-[#5b3a29] to-[#d4a574]',
  'from-[#8c2f39] to-[#2b2d42]',
];

function PlaceholderSwatch({ index }: { index: number }) {
  return (
    <div className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br', SWATCHES[index % SWATCHES.length])}>
      <span className="rounded bg-black/60 px-3 py-1 font-sans text-caption font-bold uppercase tracking-wider text-white">
        Placeholder
      </span>
    </div>
  );
}
