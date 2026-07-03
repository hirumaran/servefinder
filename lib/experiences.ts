/**
 * The volunteer journal: entries a student logs after each shift.
 *
 * Everything journal-related is deliberately device-local. Entries live in
 * this browser's localStorage only — no accounts, no server, nothing ever
 * uploaded — so the site still holds zero data about students. The school's
 * signed form remains the official record; this is the student's own
 * scratchpad (and it powers the "what next?" suggestions in lib/suggestions.ts).
 */

import { CATEGORIES, type Category } from "./types";

/** One logged shift or visit. */
export interface Experience {
  id: string;
  /** Listing id when logged from a listing on this site; absent for other orgs. */
  opportunityId?: string;
  /** Organization name, as the student wants to remember it. */
  orgName: string;
  category: Category;
  /** ISO date (YYYY-MM-DD) of the shift. */
  date: string;
  /** Hours volunteered this shift. */
  hours: number;
  /** Personal notes — what you did, who to ask for next time. */
  notes?: string;
  /** ISO timestamp when the entry was created (stable sort tiebreak). */
  loggedAt: string;
}

/** Everything the student provides; id/loggedAt are filled in on add. */
export type NewExperience = Omit<Experience, "id" | "loggedAt">;

export const JOURNAL_STORAGE_KEY = "pitch-in:journal:v1";

/** The 40-hour graduation requirement the whole site is built around. */
export const HOURS_GOAL = 40;

/** Longest believable single shift; anything above is a typo. */
export const MAX_SHIFT_HOURS = 24;

function isValidDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** Validate one stored record; anything malformed is dropped, never repaired. */
function isValidExperience(raw: unknown): raw is Experience {
  if (typeof raw !== "object" || raw === null) return false;
  const e = raw as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    e.id.length > 0 &&
    typeof e.orgName === "string" &&
    e.orgName.trim().length > 0 &&
    (CATEGORIES as readonly string[]).includes(e.category as string) &&
    isValidDate(e.date) &&
    typeof e.hours === "number" &&
    Number.isFinite(e.hours) &&
    e.hours > 0 &&
    e.hours <= MAX_SHIFT_HOURS &&
    (e.notes === undefined || typeof e.notes === "string") &&
    (e.opportunityId === undefined || typeof e.opportunityId === "string") &&
    typeof e.loggedAt === "string"
  );
}

/**
 * Parse whatever was in localStorage. Malformed JSON or entries (an old
 * version, a manual edit) degrade to "fewer entries", never to a crash.
 */
export function parseJournal(raw: string | null): Experience[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidExperience);
  } catch {
    return [];
  }
}

export function serializeJournal(entries: readonly Experience[]): string {
  return JSON.stringify(entries);
}

/** Most recent shift first; same-day entries newest-logged first. */
export function sortExperiences(entries: readonly Experience[]): Experience[] {
  return [...entries].sort(
    (a, b) => b.date.localeCompare(a.date) || b.loggedAt.localeCompare(a.loggedAt)
  );
}

/** Sum of logged hours, kept to one decimal (half-hour entries are common). */
export function totalHours(entries: readonly Experience[]): number {
  const sum = entries.reduce((acc, e) => acc + e.hours, 0);
  return Math.round(sum * 10) / 10;
}

export function makeExperienceId(): string {
  // Secure contexts have randomUUID; the fallback only needs local uniqueness.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `exp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
