import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";

function tryLoadServiceAccount() {
  const raw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
  if (!raw) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[firebase-admin] FIREBASE_ADMIN_SERVICE_ACCOUNT is not set — server-side Firestore reads will fail until you paste the service account JSON into .env.local."
      );
    }
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `FIREBASE_ADMIN_SERVICE_ACCOUNT is set but is not valid JSON: ${(err as Error).message}`
    );
  }
}

const serviceAccount = tryLoadServiceAccount();

// Firebase Admin rejects { credential: undefined } — only set the field when present.
// With no credential, the SDK falls back to Application Default Credentials; reads will
// fail at call time and the fetchers' try/catches surface null/[] (graceful degradation).
const adminApp: App =
  getApps()[0] ??
  initializeApp({
    ...(serviceAccount ? { credential: cert(serviceAccount) } : {}),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
export const adminStorage: Storage = getStorage(adminApp);

export default adminApp;
