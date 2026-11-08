import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { site, APPRAISAL_BRAND_COMING_SOON } from '@/content/site';

/** Homepage pointer to the separate family appraisal service. */
export function AppraisalTeaser() {
  const brand = site.appraisalBrand.name;

  return (
    <section className="bg-bhg-cream-warm py-16 md:py-20" aria-label="Appraisals">
      <div className="container-bhg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-heading mb-4">Need a piece appraised?</h2>
          <p className="text-body-lg text-bhg-gray-600 mb-8">
            Appraisals are done by{' '}
            {brand ? <strong className="text-bhg-black">{brand}</strong> : 'our family appraisal company'}, a separate
            company founded by {site.founderName}{brand ? '' : ` (${APPRAISAL_BRAND_COMING_SOON})`}. The gallery sells art. The appraisal
            company values it. Keeping them apart keeps every appraisal independent.
          </p>
          <Link href="/appraisal" className="btn-primary text-body-md py-3.5 px-7 inline-flex">
            Request an appraisal <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
