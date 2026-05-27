import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Product,
  Order,
  Artist,
  Review,
  AppraisalRequest,
  CollectionItem,
  HeroContent,
  SeasonalContent,
  FeaturedCollectionsContent,
  ShopCategoriesContent,
  FooterContent,
  NewsletterSubscriber,
} from '@/types';

// ============================================
// Products
// ============================================

export async function getProducts(filters?: {
  category?: string;
  occasion?: string;
  theme?: string;
  type?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  limitCount?: number;
}) {
  const constraints: QueryConstraint[] = [];

  if (filters?.isActive !== false) {
    constraints.push(where('isActive', '==', true));
  }
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.occasion) {
    constraints.push(where('occasion', 'array-contains', filters.occasion));
  }
  if (filters?.theme) {
    constraints.push(where('theme', 'array-contains', filters.theme));
  }
  if (filters?.type) {
    constraints.push(where('type', 'array-contains', filters.type));
  }
  if (filters?.isFeatured) {
    constraints.push(where('isFeatured', '==', true));
  }
  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, 'products', id));
}

// ============================================
// Orders
// ============================================

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrdersByUser(userId: string) {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Order;
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
}

export async function getAllOrders(limitCount = 50) {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

// ============================================
// Artists
// ============================================

export async function getArtists(featuredOnly = false) {
  const constraints: QueryConstraint[] = [
    where('isActive', '==', true),
    orderBy('sortOrder', 'asc'),
  ];
  if (featuredOnly) {
    constraints.push(where('isFeatured', '==', true));
  }
  const q = query(collection(db, 'artists'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Artist));
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const q = query(collection(db, 'artists'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Artist;
}

export async function createArtist(artist: Omit<Artist, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'artists'), {
    ...artist,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateArtist(id: string, data: Partial<Artist>) {
  await updateDoc(doc(db, 'artists', id), data);
}

// ============================================
// Reviews
// ============================================

export async function getProductReviews(productId: string) {
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    where('isApproved', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
}

export async function getRecentReviews(limitCount = 10) {
  const q = query(
    collection(db, 'reviews'),
    where('isApproved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ============================================
// User Collections
// ============================================

export async function getUserCollection(userId: string) {
  const q = query(
    collection(db, 'user_collections', userId, 'items'),
    orderBy('addedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CollectionItem));
}

export async function addToCollection(
  userId: string,
  item: Omit<CollectionItem, 'id' | 'addedAt' | 'updatedAt'>
) {
  const docRef = await addDoc(collection(db, 'user_collections', userId, 'items'), {
    ...item,
    addedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCollectionItem(
  userId: string,
  itemId: string,
  data: Partial<CollectionItem>
) {
  const docRef = doc(db, 'user_collections', userId, 'items', itemId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function removeFromCollection(userId: string, itemId: string) {
  await deleteDoc(doc(db, 'user_collections', userId, 'items', itemId));
}

// ============================================
// Site Content (CMS)
// ============================================

export async function getSiteContent<T>(section: string): Promise<T | null> {
  const docRef = doc(db, 'site_content', section);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as T;
}

export async function updateSiteContent(section: string, data: Record<string, unknown>) {
  const docRef = doc(db, 'site_content', section);
  await setDoc(docRef, data, { merge: true });
}

// Typed content getters
export const getHeroContent = () => getSiteContent<HeroContent>('hero');
export const getSeasonalContent = () => getSiteContent<SeasonalContent>('seasonal');
export const getFeaturedCollections = () => getSiteContent<FeaturedCollectionsContent>('featured_collections');
export const getShopCategories = () => getSiteContent<ShopCategoriesContent>('shop_categories');
export const getFooterContent = () => getSiteContent<FooterContent>('footer');

// ============================================
// Appraisal Requests
// ============================================

export async function createAppraisalRequest(
  request: Omit<AppraisalRequest, 'id' | 'createdAt' | 'updatedAt'>
) {
  const docRef = await addDoc(collection(db, 'appraisal_requests'), {
    ...request,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAppraisalRequests(status?: AppraisalRequest['status']) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (status) {
    constraints.push(where('status', '==', status));
  }
  const q = query(collection(db, 'appraisal_requests'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AppraisalRequest));
}

export async function updateAppraisalRequest(id: string, data: Partial<AppraisalRequest>) {
  const docRef = doc(db, 'appraisal_requests', id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

// ============================================
// Newsletter
// ============================================

export async function subscribeNewsletter(
  subscriber: Omit<NewsletterSubscriber, 'id' | 'createdAt'>
) {
  const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
    ...subscriber,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
