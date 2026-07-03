/**
 * The causes a student picks during the intro, and the "seen the intro" flag.
 *
 * Privacy rationale (same rules as the rest of Servd): picks are saved in
 * this browser's localStorage only — nothing uploads, there is no sync, and
 * clearing the picks removes the key entirely. The picked causes are the only
 * personalization signal in the app; suggestions are computed client-side in
 * lib/suggestions.ts.
 */

import { CATEGORIES, type Category } from "./types";

export const INTERESTS_STORAGE_KEY = "servd:interests:v1";
export const ONBOARDED_STORAGE_KEY = "servd:onboarded:v1";

const KNOWN = new Set<string>(CATEGORIES);

/**
 * Parse a stored pick list. Order is meaningful (pick order drives suggestion
 * order), so this preserves it while dropping unknown ids and duplicates.
 * Never throws — malformed storage just means "no picks yet".
 */
export function parseInterests(raw: string | null): readonly Category[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const picks: Category[] = [];
    for (const value of parsed) {
      if (typeof value !== "string" || !KNOWN.has(value) || seen.has(value)) continue;
      seen.add(value);
      picks.push(value as Category);
    }
    return picks;
  } catch {
    return [];
  }
}

export function serializeInterests(interests: readonly Category[]): string {
  return JSON.stringify(interests);
}
