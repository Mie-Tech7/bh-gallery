/**
 * Removes the placeholder content the old seed script wrote to Firestore:
 * another gallery's footer (Atlanta address and phone), invented artists,
 * products with made up ratings, and fake "verified buyer" reviews.
 *
 * Dry run by default: it only lists what it would delete.
 *
 *   npx tsx --env-file=.env.local scripts/remove-seeded-content.ts
 *   npx tsx --env-file=.env.local scripts/remove-seeded-content.ts --confirm
 *
 * Only deletes documents that match the old seed exactly (by doc path,
 * artist slug, product slug, or review title plus empty userId), so real
 * content added later is left alone.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, type DocumentReference } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT)
  : undefined;

const app =
  getApps().length === 0
    ? initializeApp({ credential: serviceAccount ? cert(serviceAccount) : undefined })
    : getApps()[0];

const db = getFirestore(app);
const confirm = process.argv.includes('--confirm');

const SITE_CONTENT_DOCS = ['seasonal', 'featured_collections', 'shop_categories', 'footer'];
const ARTIST_SLUGS = ['dd-ike', 'michael-wallace', 'ted-ellis', 'ernie-barnes', 'gerald-ivey'];
const PRODUCT_SLUGS = [
  'thinker-tshirt', 'last-supper', 'soul-on-fire-mat', 'funeral-procession',
  'life-on-purpose-mat', 'heritage-ornament-set', 'kwanzaa-wrapping', 'black-santa-figurine',
];
const REVIEW_TITLES = [
  'Sassy hat, stylish!', "Feelin' Good", 'Absolutely beautiful!!!',
  'Perfect gift for my mother', 'Outstanding quality', 'A masterpiece for the home',
];

async function main() {
  const targets: DocumentReference[] = [];

  for (const id of SITE_CONTENT_DOCS) {
    const ref = db.doc(`site_content/${id}`);
    if ((await ref.get()).exists) targets.push(ref);
  }

  for (const slug of ARTIST_SLUGS) {
    const snap = await db.collection('artists').where('slug', '==', slug).get();
    snap.docs.forEach((d) => targets.push(d.ref));
  }

  for (const slug of PRODUCT_SLUGS) {
    const snap = await db.collection('products').where('slug', '==', slug).get();
    snap.docs.forEach((d) => targets.push(d.ref));
  }

  for (const title of REVIEW_TITLES) {
    const snap = await db.collection('reviews').where('title', '==', title).where('userId', '==', '').get();
    snap.docs.forEach((d) => targets.push(d.ref));
  }

  console.log(`${targets.length} seeded documents found:`);
  targets.forEach((r) => console.log(`  ${r.path}`));

  if (!confirm) {
    console.log('\nDry run. Run again with --confirm to delete them.');
    return;
  }

  const batch = db.batch();
  targets.forEach((r) => batch.delete(r));
  await batch.commit();
  console.log(`\nDeleted ${targets.length} documents.`);
}

main().catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
});
