/**
 * Every public fact about the gallery lives here, in one place.
 *
 * Fill a value in only once Robbie Lee has confirmed it. Contact fields
 * that are null are simply hidden. Photos still missing show as marked
 * placeholders (see components/ui/placeholder.tsx).
 */

export interface SiteFacts {
  galleryName: string;
  /** Original name of the gallery (her words, Nov 9). */
  formerName: string;
  founderName: string;
  /** From the gallery's old printed flyer. */
  mission: string;
  /** Her story, from her answers on Nov 9. One paragraph per entry. */
  story: string[];
  /** Short founder bio for the About page. */
  founderBio: string[];
  /** Artists she knows deeply (her words, Nov 9). */
  artistsKnown: string[];
  /** Houston artists she knows deeply (her words, Nov 9). */
  houstonArtistsKnown: string[];
  /** Artists the gallery carried, from the old flyer ("and many more"). */
  artistsCarried: string[];
  /** Approved by her (Josh, Nov 8). Adapted from the LinkedIn About draft. */
  biggersLine: string;
  /** City and state shown publicly, e.g. "Houston, Texas". */
  location: string | null;
  /** Short line under the logo in the footer. */
  tagline: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    /** Street address. Null: no public address (the gallery has no storefront now). */
    address: string | null;
    /** e.g. "By appointment". Null hides the row. */
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
  formerName: "Sutton's Black Heritage Gallery",
  founderName: 'Robbie Lee',
  mission: 'Offering the African American community and its artists a space to see and be seen.',
  story: [
    "Robbie Lee's love of art started in elementary school, in the art department at Texas Southern University. She and her friends modeled for Dr. John Biggers and his students.",
    'Her collecting began on a trip to East Orange, New Jersey, with art she found hanging on a fence on her way to the train station.',
    "She went on to found Sutton's Black Heritage Gallery, which became Black Heritage Gallery, and ran it in a physical space for 37 years, including on Almeda Road near Houston's Museum District. For the past 13 years she has continued to sell and appraise art.",
  ],
  founderBio: [
    'Before the gallery, Robbie Lee earned a business degree and started her career at the Federal Reserve Bank.',
  ],
  artistsKnown: ['Dr. John Biggers', 'Jacob Lawrence', 'Romare Bearden', 'Elizabeth Catlett'],
  houstonArtistsKnown: ['Bert Long', 'Lionel Lofton'],
  artistsCarried: [
    'Andrew Thompson', 'Annie Lee', 'Ava Cosey', 'Brenda Joysmith', 'Burford Evans', 'Burl Washington',
    'Caryle Thompson', 'Charles Bibbs', 'Charles Criner', 'Charles Washington', 'Charles White',
    'Elizabeth Catlett', 'Ellis Wilson', 'Emaniah Shinar', 'Ernest Snell', 'Ernie Barnes',
    'Elizabeth Shelton', 'Frank Frazier', 'Gilbert Young', 'Hughie Lee Smith', 'Jacob Lawrence',
    'James Denmark', 'John Hollyfield', 'John T. Biggers', 'Jonathan Green', 'Joseph Holston', 'Karl Hall',
    'Kathleen Wilson', 'Lee White', 'Leroy Campbell', 'LeShaun Beal', 'Lionel Lofton', 'Lymon Jackson',
    'Patti Sinex', 'Paul Goodnight', 'Romare Bearden', 'Ted Ellis', 'Tom McKinney', 'Varnette Honeywood',
    'William Tolliver',
  ],
  biggersLine:
    'Decades of showing and selling the work of Dr. John Biggers have made Robbie Lee one of the leading authorities on Dr. Biggers and his art.',
  location: 'Houston, Texas',
  tagline: 'The Source for African and Black Imagery.',
  contact: {
    // Email only, no phone (her answer, Nov 9).
    phone: null,
    email: 'bhgnow@icloud.com',
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

/** "a, b and c" */
export function listToText(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
