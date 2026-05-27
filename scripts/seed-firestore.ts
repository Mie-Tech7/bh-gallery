/**
 * Firestore Seed Script
 *
 * Populates all collections needed for the homepage to render.
 * Run once during dev setup, or after a fresh Firestore wipe.
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 *
 * Requires:
 *   FIREBASE_ADMIN_SERVICE_ACCOUNT env var set, or
 *   running against the Firestore emulator.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

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
const now = Timestamp.now();

async function seed() {
  console.log('Seeding Firestore...\n');

  // ==========================================
  // 1. site_content/hero
  // ==========================================
  await db.doc('site_content/hero').set({
    headline: 'The Black Heritage Gallery',
    headlineAccent: 'Returns',
    subtitle: 'Join Our Community',
    tagline: 'Celebrating Black art and the voices of Black & African artists.',
    ctaPrimary: { text: 'Learn Our Story', link: '/about' },
    ctaSecondary: { text: 'Appraisal Services', link: '/appraisal' },
    carouselItems: [
      { image: '/images/collections/contemporary-african.jpg', title: 'Contemporary African Expression', link: '/gallery' },
      { image: '/images/collections/emerging-artists.jpg', title: 'Emerging Black Artists', link: '/artists' },
      { image: '/images/collections/heritage-treasures.jpg', title: 'Heritage Art Treasures', link: '/shop' },
    ],
  });
  console.log('  ✓ site_content/hero');

  // ==========================================
  // 2. site_content/seasonal
  // ==========================================
  await db.doc('site_content/seasonal').set({
    isActive: true,
    label: 'Seasonal Collection',
    headline: 'Celebrate Christmas Our Way',
    description: 'Discover ornaments, cards, and holiday décor that honor Black traditions and the artists keeping them alive.',
    image: '/images/seasonal/christmas-hero.jpg',
    imageCaption: 'Featured · Holiday Collection',
    ctaText: 'Shop Christmas Collection',
    ctaLink: '/shop/christmas',
  });
  console.log('  ✓ site_content/seasonal');

  // ==========================================
  // 3. site_content/featured_collections
  // ==========================================
  await db.doc('site_content/featured_collections').set({
    headline: 'Featured Collections',
    subtitle: 'Discover our curated collection of exceptional Black and African art, spanning traditional and contemporary expressions',
    items: [
      { image: '/images/collections/rhythms.jpg', title: 'Rhythms of Heritage', subtitle: 'Contemporary Mixed Media', link: '/gallery?collection=rhythms' },
      { image: '/images/collections/ancestral.jpg', title: 'Ancestral Wisdom', subtitle: 'Traditional Carved Wood', link: '/gallery?collection=ancestral' },
      { image: '/images/collections/woven.jpg', title: 'Woven Stories', subtitle: 'Hand-woven Textile', link: '/gallery?collection=woven' },
      { image: '/images/collections/liberation.jpg', title: 'Liberation Form', subtitle: 'Contemporary Sculpture', link: '/gallery?collection=liberation' },
    ],
  });
  console.log('  ✓ site_content/featured_collections');

  // ==========================================
  // 5. site_content/shop_categories
  // ==========================================
  await db.doc('site_content/shop_categories').set({
    occasion: {
      title: 'Shop by Occasion',
      description: "Christmas, Mother's Day, Father's Day, Weddings, and more.",
      image: '/images/categories/occasion.jpg',
      link: '/shop?view=occasion',
    },
    theme: {
      title: 'Shop by Theme',
      description: 'Religious, Black History, Organizations, Family, Professionals.',
      image: '/images/categories/theme.jpg',
      link: '/shop?view=theme',
    },
    type: {
      title: 'Shop by Type',
      description: 'Artwork, Home Décor, Stationery, Fashion, African Décor & Fashion.',
      image: '/images/categories/type.jpg',
      link: '/shop?view=type',
    },
  });
  console.log('  ✓ site_content/shop_categories');

  // ==========================================
  // 8. site_content/footer
  // ==========================================
  await db.doc('site_content/footer').set({
    tagline: 'Celebrating Black art and the voices of Black & African artists for over three decades.',
    phone: '678-916-6545',
    email: 'info@bh-gallery.com',
    address: {
      street: '154 Selig Drive Southwest',
      suite: 'Suite A',
      city: 'Atlanta',
      state: 'GA',
      zip: '30336',
    },
    socialLinks: {
      instagram: 'https://instagram.com/blackheritagegallery',
      facebook: 'https://facebook.com/blackheritagegallery',
      twitter: '',
      pinterest: '',
      linkedin: '',
    },
  });
  console.log('  ✓ site_content/footer');

  // ==========================================
  // 4. artists (featured)
  // ==========================================
  const artists = [
    { name: 'D.D. Ike Art Gallery', slug: 'dd-ike', bio: 'Mixed media artist whose jazz-inspired works capture the rhythm and soul of Black cultural expression.', style: 'Mixed Media · Jazz', featuredOrder: 1 },
    { name: 'Michael Wallace Art Gallery', slug: 'michael-wallace', bio: 'Known for cubist portraiture that reimagines Black identity through fragmented forms and bold color.', style: 'Cubist Portraiture', featuredOrder: 2 },
    { name: 'Ted Ellis Art Gallery', slug: 'ted-ellis', bio: 'Cultural narrative painter documenting the richness of everyday Black life and Southern heritage.', style: 'Cultural Narrative', featuredOrder: 3 },
    { name: 'Ernie Barnes Art Gallery', slug: 'ernie-barnes', bio: 'Iconic neo-mannerist painter celebrated for elongated figures that dance with energy and grace.', style: 'Neo-Mannerism', featuredOrder: 4 },
    { name: 'Gerald Ivey Art Gallery', slug: 'gerald-ivey', bio: 'Abstract figurative artist exploring the tension between form and emotion in Black experience.', style: 'Abstract Figuration', featuredOrder: 5 },
  ];

  for (const artist of artists) {
    await db.collection('artists').add({
      ...artist,
      profileImage: '',
      galleryImages: [],
      isFeatured: true,
      isActive: true,
      sortOrder: artist.featuredOrder,
      createdAt: now,
    });
  }
  console.log(`  ✓ artists (${artists.length} featured)`);

  // ==========================================
  // 7. products (featured / top rated)
  // ==========================================
  const products = [
    { name: 'The Thinker Short Sleeve Unisex T-Shirt', slug: 'thinker-tshirt', price: 2999, category: 'apparel', rating: { average: 4.9, count: 85 }, featuredOrder: 1 },
    { name: 'The Last Supper', slug: 'last-supper', price: 14999, category: 'artwork', rating: { average: 5.0, count: 103 }, featuredOrder: 2 },
    { name: 'Soul on Fire Interior Floor Mat', slug: 'soul-on-fire-mat', price: 4999, category: 'decor', rating: { average: 4.8, count: 80 }, featuredOrder: 3 },
    { name: 'Funeral Procession', slug: 'funeral-procession', price: 7999, category: 'artwork', rating: { average: 4.9, count: 79 }, featuredOrder: 4 },
    { name: 'Life on Purpose Interior Floor Mat', slug: 'life-on-purpose-mat', price: 4999, category: 'decor', rating: { average: 4.9, count: 74 }, featuredOrder: 5 },
    { name: 'Heritage Christmas Ornament Set', slug: 'heritage-ornament-set', price: 3499, category: 'ornaments', rating: { average: 4.7, count: 42 }, featuredOrder: 6 },
    { name: 'Kwanzaa Celebration Wrapping Paper', slug: 'kwanzaa-wrapping', price: 1299, category: 'wrapping_paper', rating: { average: 4.6, count: 31 }, featuredOrder: 7 },
    { name: 'Black Santa Figurine Collection', slug: 'black-santa-figurine', price: 5999, category: 'figurines', rating: { average: 4.9, count: 67 }, featuredOrder: 8 },
  ];

  for (const product of products) {
    await db.collection('products').add({
      ...product,
      description: `A beautiful ${product.category} piece from the Black Heritage Gallery collection.`,
      compareAtPrice: null,
      subcategory: null,
      tags: ['heritage', 'black-art'],
      occasion: product.category === 'ornaments' || product.category === 'wrapping_paper' || product.category === 'figurines' ? ['christmas'] : [],
      theme: ['black_history'],
      type: product.category === 'artwork' ? ['artwork'] : product.category === 'decor' ? ['home_decor'] : product.category === 'apparel' ? ['fashion'] : ['home_decor'],
      images: [],
      artist: null,
      artistId: null,
      inventory: 50,
      isActive: true,
      isFeatured: true,
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log(`  ✓ products (${products.length} featured)`);

  // ==========================================
  // 6. reviews (approved)
  // ==========================================
  const reviews = [
    { title: 'Sassy hat, stylish!', body: '', userName: 'Vanady', rating: 5, productName: 'Abeke Madagascar Big Brim Raffia Sun Hat', daysAgo: 20 },
    { title: "Feelin' Good", body: 'The picture is a beautiful piece of art.', userName: 'Michael R.', rating: 5, productName: "Feelin' Good — The Bassist", daysAgo: 17 },
    { title: 'Absolutely beautiful!!!', body: '', userName: 'Teresa', rating: 5, productName: 'Mama Queen', daysAgo: 30 },
    { title: 'Perfect gift for my mother', body: 'She loved the cultural significance. Beautifully made.', userName: 'David L.', rating: 5, productName: 'Heritage Christmas Ornament Set', daysAgo: 5 },
    { title: 'Outstanding quality', body: 'The colors are even more vibrant in person.', userName: 'Patricia W.', rating: 5, productName: 'Soul on Fire Interior Floor Mat', daysAgo: 12 },
    { title: 'A masterpiece for the home', body: 'Conversation starter every time guests visit.', userName: 'James T.', rating: 5, productName: 'The Last Supper', daysAgo: 8 },
  ];

  for (const review of reviews) {
    const createdAt = Timestamp.fromDate(
      new Date(Date.now() - review.daysAgo * 24 * 60 * 60 * 1000)
    );
    await db.collection('reviews').add({
      productId: '',
      userId: '',
      userName: review.userName,
      rating: review.rating,
      title: review.title,
      body: review.body,
      isVerifiedBuyer: true,
      productName: review.productName,
      productImage: '',
      createdAt,
      isApproved: true,
    });
  }
  console.log(`  ✓ reviews (${reviews.length} approved)`);

  console.log('\nSeed complete. All homepage sections have data.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
