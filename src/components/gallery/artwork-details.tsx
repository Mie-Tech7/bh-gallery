'use client';

import { useEffect, useRef, useState } from 'react';
import { Headphones, Pause, X } from 'lucide-react';
import type { GalleryArtwork } from '@/lib/gallery/types';
import { formatPrice } from '@/lib/gallery/from-product';

/** Details panel used by both views. Shows commentary for featured pieces. */
export function ArtworkDetails({ artwork, onClose }: { artwork: GalleryArtwork; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [speaking, setSpeaking] = useState(false);
  const price = formatPrice(artwork.price);
  const canReadAloud = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [onClose]);

  const toggleReadAloud = () => {
    if (!artwork.commentary) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(artwork.commentary.text);
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  const facts: [string, string | null][] = [
    ['Artist', artwork.artist],
    ['Medium', artwork.medium],
    ['Size', artwork.dimensions],
    ['Year', artwork.year],
    ['Price', price],
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-details-title"
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-card bg-white p-5 font-sans shadow-modal sm:max-w-lg sm:rounded-card sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            {artwork.isPlaceholder && (
              <p className="mb-1 text-caption font-semibold uppercase text-bhg-copper">Placeholder</p>
            )}
            {artwork.featured && !artwork.isPlaceholder && (
              <p className="mb-1 text-caption font-semibold uppercase text-bhg-copper">Featured piece</p>
            )}
            <h2 id="artwork-details-title" className="font-serif text-heading-lg text-bhg-black">
              {artwork.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-bhg-gray-600 hover:bg-bhg-cream"
            aria-label="Close details"
          >
            <X size={20} />
          </button>
        </div>

        <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body-sm">
          {facts
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-bhg-gray-400">{k}</dt>
                <dd className="text-bhg-black">{v}</dd>
              </div>
            ))}
        </dl>

        {artwork.description && <p className="mb-4 text-body-md text-bhg-gray-600">{artwork.description}</p>}

        {artwork.commentary && (
          <section className="rounded-card bg-bhg-cream p-4" aria-label="Commentary">
            <p className="mb-1 flex items-center gap-2 text-body-sm font-semibold text-bhg-black">
              <Headphones size={16} className="text-bhg-copper" /> Commentary
              {artwork.commentary.by && <span className="font-normal text-bhg-gray-600">by {artwork.commentary.by}</span>}
            </p>
            <p className="mb-3 text-body-sm text-bhg-gray-600">{artwork.commentary.text}</p>
            {artwork.commentary.audioUrl ? (
              <audio controls preload="none" src={artwork.commentary.audioUrl} className="w-full">
                Your browser can&apos;t play this audio.
              </audio>
            ) : (
              canReadAloud && (
                <button
                  type="button"
                  onClick={toggleReadAloud}
                  className="flex items-center gap-2 rounded-button bg-bhg-copper px-3 py-2 text-body-sm font-semibold text-white hover:bg-bhg-copper-dark"
                >
                  {speaking ? <Pause size={16} /> : <Headphones size={16} />}
                  {speaking ? 'Stop' : 'Read it aloud'}
                </button>
              )
            )}
          </section>
        )}
      </div>
    </div>
  );
}
