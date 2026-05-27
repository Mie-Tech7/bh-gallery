/**
 * Firebase App Check Configuration
 *
 * CRITICAL SAFETY REQUIREMENT from firebase-ai-logic-basics skill:
 * App Check MUST be configured before using AI Logic in production.
 * This prevents unauthorized clients from consuming your Gemini API quota.
 *
 * Uses reCAPTCHA Enterprise provider for web apps.
 * See: https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
 *
 * SETUP:
 * 1. Enable App Check in Firebase Console
 * 2. Register your site with reCAPTCHA Enterprise
 * 3. Add your reCAPTCHA site key to environment variables
 * 4. Enforce App Check on Firestore, Storage, and AI Logic
 */

import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import app from './config';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/**
 * Initialize App Check.
 * Call this once at app startup, after Firebase is initialized.
 * Only runs on client side (not during SSR).
 */
export function initializeFirebaseAppCheck() {
  if (typeof window === 'undefined') return; // Skip during SSR

  if (!RECAPTCHA_SITE_KEY) {
    if (process.env.NODE_ENV === 'development') {
      // In development, use debug mode
      // @ts-expect-error - FIREBASE_APPCHECK_DEBUG_TOKEN is a Firebase-injected global, not in standard types
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      console.log('[App Check] Running in debug mode');
    } else {
      console.warn(
        '[App Check] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. ' +
        'AI Logic and other Firebase services will be unprotected. ' +
        'Set this before deploying to production.'
      );
      return;
    }
  }

  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        RECAPTCHA_SITE_KEY || 'debug-token'
      ),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error('[App Check] Initialization failed:', error);
  }
}
