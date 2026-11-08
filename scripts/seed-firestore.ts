/**
 * Firestore Seed Script
 *
 * Seeds only the homepage hero. The launch homepage reads nothing else
 * from Firestore.
 *
 * The earlier version also seeded another gallery's footer (an Atlanta
 * address and phone), invented artists, products with made up ratings and
 * fake "verified buyer" reviews. That content was removed. To delete what
 * it already wrote, see scripts/remove-seeded-content.ts.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 *
 * Requires:
 *   FIREBASE_ADMIN_SERVICE_ACCOUNT env var set, or
 *   running against the Firestore emulator.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
  : undefined;

const app =
  getApps().length === 0
    ? initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
      })
    : getApps()[0];

const db = getFirestore(app);

async function seed() {
  console.log('Seeding Firestore...\n');

  // ==========================================
  // 1. site_content/hero
  // ==========================================
  await db.doc('site_content/hero').set({
    headline: 'The Black Heritage Gallery',
    headlineAccent: 'Returns',
    subtitle: 'Founded by Robbie Lee',
    tagline: 'Celebrating Black art and the voices of Black & African artists.',
    ctaPrimary: { text: 'Learn Our Story', link: '/about' },
    ctaSecondary: { text: 'Appraisals', link: '/appraisal' },
    carouselItems: [],
  });
  console.log('  ✓ site_content/hero');

  console.log('\nSeed complete.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
