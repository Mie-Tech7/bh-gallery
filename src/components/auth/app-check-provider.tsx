'use client';

import { useEffect } from 'react';
import { initializeFirebaseAppCheck } from '@/lib/firebase/app-check';

/**
 * Initializes Firebase App Check on client mount.
 * Must run before any AI Logic or protected Firebase calls.
 */
export function AppCheckProvider() {
  useEffect(() => {
    initializeFirebaseAppCheck();
  }, []);

  return null; // No UI, just initialization side effect
}
