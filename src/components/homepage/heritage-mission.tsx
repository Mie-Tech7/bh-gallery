import Link from 'next/link';
import { site } from '@/content/site';
import { Placeholder } from '@/components/ui/placeholder';

export function HeritageMission() {
  return (
    <section className="bg-white py-16 md:py-22" aria-label="Our heritage">
      <div className="container-bhg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover aspect-[3/4] bg-gradient-to-br from-amber-900/60 via-stone-700/40 to-stone-800/70 flex items-center justify-center p-6">
            <Placeholder>photo of {site.founderName}, ideally with art behind her</Placeholder>
          </div>

          <div>
            <div className="w-12 h-1 bg-bhg-copper rounded-full mb-6" aria-hidden="true"/>
            <h2 className="font-serif text-display-lg md:text-display-xl text-bhg-black leading-[1.1] mb-8">
              Our Heritage
            </h2>
            <div className="space-y-5 text-body-lg text-bhg-gray-600 leading-relaxed">
              <p>
                {site.galleryName} was founded by{' '}
                <strong className="font-semibold text-bhg-black">{site.founderName}</strong>. It began as{' '}
                {site.formerName}, with one purpose: {site.mission.charAt(0).toLowerCase() + site.mission.slice(1)}
              </p>
              <p>{site.story[0]}</p>
              <p>{site.biggersLine}</p>
            </div>
            <Link href="/about" className="btn-secondary mt-8 inline-flex">Read her story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
