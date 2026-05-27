import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { AppraisalPreview } from '@/components/homepage/appraisal-preview';

export default function AppraisalPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <AppraisalPreview />
      </main>
      <SiteFooter />
    </>
  );
}
