'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '@/types';

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Sign in with email/password
export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await updateLastActive(result.user.uid);
  return result.user;
}

// Register with email/password
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await createUserProfile(result.user, displayName);
  return result.user;
}

// Sign in with Google
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

// Sign in with Apple
export async function signInWithApple() {
  const result = await signInWithPopup(auth, appleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

// Sign out
export async function signOut() {
  await firebaseSignOut(auth);
}

// Create user profile in Firestore
async function createUserProfile(user: User, displayName: string) {
  const userRef = doc(db, 'users', user.uid);
  // serverTimestamp() returns FieldValue at write time; it materializes as Timestamp on read.
  await setDoc(userRef, {
    displayName,
    email: user.email || '',
    phone: null,
    role: 'customer' satisfies UserProfile['role'],
    shippingAddresses: [],
    interests: [],
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp(),
  });
}

// Ensure profile exists for social sign-ins
async function ensureUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await createUserProfile(user, user.displayName || 'Collector');
  } else {
    await updateLastActive(user.uid);
  }
}

// Update last active timestamp
async function updateLastActive(uid: string) {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
}

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) return null;
  return { uid, ...userDoc.data() } as UserProfile;
}

// Check if user is admin
export async function checkIsAdmin(uid: string): Promise<boolean> {
  const profile = await getUserProfile(uid);
  return profile?.role === 'admin';
}

// Auth state listener
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
