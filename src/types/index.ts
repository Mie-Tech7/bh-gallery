import { Timestamp } from 'firebase/firestore';

// ============================================
// Product Types
// ============================================

export type ProductCategory =
  | 'ornaments'
  | 'wrapping_paper'
  | 'cards'
  | 'figurines'
  | 'decor'
  | 'apparel'
  | 'artwork';

export type ProductOccasion =
  | 'christmas'
  | 'mothers_day'
  | 'fathers_day'
  | 'wedding'
  | 'black_history'
  | 'juneteenth'
  | 'kwanzaa';

export type ProductTheme =
  | 'religious'
  | 'black_history'
  | 'organizations'
  | 'family'
  | 'professionals';

export type ProductType =
  | 'artwork'
  | 'home_decor'
  | 'stationery'
  | 'fashion'
  | 'african_decor';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // cents
  compareAtPrice: number | null;
  category: ProductCategory;
  subcategory: string | null;
  tags: string[];
  occasion: ProductOccasion[];
  theme: ProductTheme[];
  type: ProductType[];
  images: string[];
  artist: string | null;
  artistId: string | null;
  inventory: number;
  isActive: boolean;
  isFeatured: boolean;
  featuredOrder: number;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// Order Types
// ============================================

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// User Types
// ============================================

export type UserRole = 'customer' | 'artist' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  shippingAddresses: ShippingAddress[];
  interests: string[];
  createdAt: Timestamp;
  lastActive: Timestamp;
}

// ============================================
// Collection Types (User Portfolio)
// ============================================

export type CollectionItemSource = 'purchase' | 'manual' | 'appraisal';

export interface CollectionItem {
  id: string;
  source: CollectionItemSource;
  productId: string | null;
  name: string;
  artist: string;
  artistId: string | null;
  images: string[];
  category: string;
  medium: string | null;
  dimensions: string | null;
  yearAcquired: number | null;
  purchasePrice: number | null;
  appraisedValue: number | null;
  estimatedValue: number | null;
  appraisalId: string | null;
  appraisalDate: Timestamp | null;
  notes: string | null;
  isPublic: boolean;
  addedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CollectionStats {
  totalItems: number;
  totalAppraisedValue: number;
  totalEstimatedValue: number;
  categories: Record<string, number>;
  artists: Record<string, number>;
}

// ============================================
// Artist Types
// ============================================

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  style: string;
  profileImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  featuredOrder: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// ============================================
// Review Types
// ============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  isVerifiedBuyer: boolean;
  productName: string;
  productImage: string;
  createdAt: Timestamp;
  isApproved: boolean;
}

// ============================================
// Site Content Types (CMS)
// ============================================

export interface HeroContent {
  headline: string;
  headlineAccent: string;
  subtitle: string;
  tagline: string;
  ctaPrimary: { text: string; link: string };
  ctaSecondary: { text: string; link: string };
  carouselItems: Array<{
    image: string;
    title: string;
    link: string;
  }>;
}

export interface SeasonalContent {
  isActive: boolean;
  label: string;
  headline: string;
  description: string;
  image: string;
  imageCaption: string;
  ctaText: string;
  ctaLink: string;
}

export interface FeaturedCollectionItem {
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface FeaturedCollectionsContent {
  headline: string;
  subtitle: string;
  items: FeaturedCollectionItem[];
}

export interface ShopCategoryCard {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface ShopCategoriesContent {
  occasion: ShopCategoryCard;
  theme: ShopCategoryCard;
  type: ShopCategoryCard;
}

export interface FooterContent {
  tagline: string;
  phone: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    zip: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    pinterest: string;
    linkedin: string;
  };
}

// ============================================
// Appraisal Types
// ============================================

export type AppraisalPurpose =
  | 'insurance'
  | 'resale'
  | 'estate'
  | 'donation'
  | 'curiosity';

export type AppraisalUrgency = 'standard' | 'expedited' | 'rush';

export type AppraisalStatus =
  | 'pending'
  | 'in_review'
  | 'completed'
  | 'cancelled';

export interface AppraisalRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  userId: string | null;
  artworkDescription: string;
  purpose: AppraisalPurpose;
  images: string[];
  urgency: AppraisalUrgency;
  status: AppraisalStatus;
  assignedTo: string | null;
  appraisalReport: string | null;
  estimatedValue: number | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// Newsletter Types
// ============================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  interests: string[];
  source: 'website' | 'checkout' | 'popup';
  isActive: boolean;
  createdAt: Timestamp;
}

// ============================================
// Cart Types (Client-side + Firestore sync)
// ============================================

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
