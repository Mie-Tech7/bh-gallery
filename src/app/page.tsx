import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { HeroSection } from '@/components/homepage/hero-section';
import { HeritageMission } from '@/components/homepage/heritage-mission';
import { AppraisalTeaser } from '@/components/homepage/appraisal-teaser';
import { CommunitySignup } from '@/components/homepage/community-signup';

// Launch homepage. The shop, featured artists, collections, reviews and top
// rated sections are off until her real pieces and artists are online; their
// components are still in components/homepage. The page no longer reads the
// seeded Firestore content, which held another gallery's details.
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HeritageMission />
        <AppraisalTeaser />
        <CommunitySignup />
      </main>
      <SiteFooter />
    </>
  );
}
