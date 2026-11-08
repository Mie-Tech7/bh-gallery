import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { AppraisalService } from '@/components/appraisal/appraisal-service';

export const metadata: Metadata = {
  title: 'Appraisals',
  description: 'Request an art appraisal from the family appraisal company founded by Robbie Lee.',
};

export default function AppraisalPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <AppraisalService />
      </main>
      <SiteFooter />
    </>
  );
}
