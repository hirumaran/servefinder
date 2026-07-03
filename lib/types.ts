/**
 * Core data model for ServeFinder.
 *
 * `Opportunity` is the single source-of-truth shape for every listing in
 * `data/opportunities.json`. It is deliberately storage-agnostic: today the
 * data lives in a JSON file, but the shape maps 1:1 onto a database table so
 * the app can move to SQLite/Postgres later without touching the UI.
 */

/** Every category a listing can belong to. Order here drives display order. */
export const CATEGORIES = [
  "Animals",
  "Environment",
  "FoodAndHunger",
  "Seniors",
  "HealthAndHospitals",
  "EducationAndTutoring",
  "Community",
  "FaithBased",
  "ArtsAndMuseums",
  "Library",
  "ParksAndOutdoors",
  "DisabilityServices",
  "Homelessness",
  "Youth",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** How much time a volunteer is signing up for. */
export const TIME_COMMITMENTS = ["OneTime", "Ongoing", "Flexible", "EventBased"] as const;

export type TimeCommitment = (typeof TIME_COMMITMENTS)[number];

export const TIME_COMMITMENT_LABELS: Record<TimeCommitment, string> = {
  OneTime: "One-time",
  Ongoing: "Ongoing",
  Flexible: "Flexible",
  EventBased: "Event-based",
};

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Contact {
  phone?: string;
  email?: string;
  website?: string;
  /** Name (and optionally role) of the person a student should ask for. */
  contactPerson?: string;
}

export interface Opportunity {
  /** Stable unique slug, used in URLs (e.g. "whisker-city-animal-shelter"). */
  id: string;
  /** Organization / opportunity name. */
  name: string;
  /** What the org does and what the volunteer actually does. */
  description: string;
  category: Category;
  address: Address;
  /** Coordinates of the address above (used for map pins + distance). */
  lat: number;
  lng: number;
  contact: Contact;
  /** Minimum volunteer age. Omitted = no age minimum. */
  minAge?: number;
  /** True when a parent/guardian must sign a consent form for minors. */
  parentalConsentRequired?: boolean;
  /**
   * Will the org sign/verify a school service-hour form? Schools require
   * documentation, so this is one of the most important fields we show.
   */
  verifiesHours: boolean;
  timeCommitment: TimeCommitment;
  /** True when the work can be done remotely (no transportation needed). */
  isVirtual: boolean;
  /** True when a club/group can volunteer together. */
  groupFriendly: boolean;
  /** e.g. "Background check", "Orientation session", "Application form". */
  requirements?: string[];
  /** How to get hours documented at this org. */
  hoursNotes?: string;
  /**
   * Concrete steps a student should take to get involved.
   * Newline-separated; each line renders as one step in the UI.
   */
  howToStart: string;
  /** ISO date (YYYY-MM-DD) the operator last confirmed this info is accurate. */
  lastVerified?: string;
}

/** Shape of data/opportunities.json (a wrapper so the file can carry a warning). */
export interface OpportunityFile {
  $comment: string;
  opportunities: Opportunity[];
}
