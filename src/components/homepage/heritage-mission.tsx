export function HeritageMission() {
  return (
    <section className="bg-white py-16 md:py-22" aria-label="Our heritage and mission">
      <div className="container-bhg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover aspect-[3/4] bg-gradient-to-br from-amber-900/60 via-stone-700/40 to-stone-800/70" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-tr from-bhg-copper/10 via-transparent to-bhg-cream/10"/>
          </div>

          {/* Copy column */}
          <div>
            <div className="w-12 h-1 bg-bhg-copper rounded-full mb-6" aria-hidden="true"/>
            <h2 className="font-serif text-display-lg md:text-display-xl text-bhg-black leading-[1.1] mb-8">
              Our Heritage &amp; Mission
            </h2>
            <div className="space-y-5 text-body-lg text-bhg-gray-600 leading-relaxed">
              <p>
                Founded by renowned art expert <strong className="font-semibold text-bhg-black">Robbie Lee</strong>, the Black Heritage Gallery has been a cornerstone of our community&apos;s artistic legacy for over three decades.
              </p>
              <p>
                Robbie Lee&apos;s extensive background in art history and appraisal, combined with deep connections to Black and African artistic communities, established our gallery as a trusted space for both emerging and established artists.
              </p>
              <p>
                Today, as a second-generation family business, we continue this legacy of celebrating Black art and amplifying the voices of Black &amp; African artists, while providing professional appraisal services to collectors and institutions worldwide.
              </p>
            </div>

            <blockquote className="mt-8 border-2 border-bhg-copper rounded-xl p-6 bg-bhg-cream-warm/40">
              <p className="font-serif italic text-body-lg text-bhg-black leading-relaxed">
                &ldquo;Art is the bridge between cultures, and our gallery serves as that bridge, connecting communities through the powerful expressions of Black and African artists.&rdquo;
              </p>
              <footer className="mt-3 text-body-sm text-bhg-copper font-sans font-medium">
                — Robbie Lee, Founder
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
