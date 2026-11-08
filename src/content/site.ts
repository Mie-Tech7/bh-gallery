/**
 * Every public fact about the gallery lives here, in one place.
 *
 * A value of null means "not confirmed yet". Pages show a marked
 * placeholder for it (see components/ui/placeholder.tsx) instead of
 * guessing. Fill a value in only once Robbie Lee has confirmed it.
 */

export interface SiteFacts {
  galleryName: string;
  /** Earlier name of the gallery, per Josh (Nov 3). */
  formerName: string;
  founderName: string;
  /** Approved by her (Josh, Nov 8). Adapted from the LinkedIn About draft. */
  biggersLine: string;
  /** City and state shown publicly, e.g. "Houston, Texas". */
  location: string | null;
  /** Short line under the logo in the footer. */
  tagline: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    /** Street address, or null if visits are by appointment only. */
    address: string | null;
    /** e.g. "By appointment". */
    hours: string | null;
  };
  /** Leave a link empty to hide that icon. */
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  /**
   * Appraisals are a separate three generation family company, not the
   * gallery (see mom-task/trust-and-structure-2026-11-07.md). Its name is
   * not chosen yet.
   */
  appraisalBrand: {
    name: string | null;
    website: string | null;
    email: string | null;
  };
}

export const site: SiteFacts = {
  galleryName: 'Black Heritage Gallery',
  formerName: "Sutton's Art Gallery",
  founderName: 'Robbie Lee',
  biggersLine:
    'Decades of showing and selling the work of Dr. John Biggers have made Robbie Lee one of the leading authorities on Dr. Biggers and his art.',
  location: null,
  tagline: null,
  contact: {
    phone: null,
    email: null,
    address: null,
    hours: null,
  },
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },
  appraisalBrand: {
    name: null,
    website: null,
    email: null,
  },
};

/** Shown in place of the appraisal company's name until one is chosen (Josh, Nov 8). */
export const APPRAISAL_BRAND_COMING_SOON = 'name coming soon';
