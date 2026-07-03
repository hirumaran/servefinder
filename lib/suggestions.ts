/**
 * "Picked for you" suggestions computed from the causes a student chose.
 *
 * Pure functions, no storage: given the picked causes (see lib/interests.ts)
 * and the full listing set, line up the best matches. All scoring happens in
 * the browser, so a student's interests never leave their device.
 */

import { CATEGORY_META } from "./categories";
import type { Category, Opportunity } from "./types";

export interface Suggestion {
  opportunity: Opportunity;
  /** Human reason shown under the card, e.g. "Because you picked Animals". */
  reason: string;
  score: number;
}

/** Verified sign-off matters most to students — it outranks everything else. */
const VERIFIES_HOURS_BOOST = 0.5;

export function suggestOpportunities(
  interests: readonly Category[],
  opportunities: readonly Opportunity[],
  limit = 6
): Suggestion[] {
  if (interests.length === 0) return [];

  const picked = new Set(interests);

  // Bucket candidates by cause, best-first within each bucket: places that
  // sign hour forms beat places that don't, then a stable name sort.
  const buckets = new Map<Category, Opportunity[]>();
  for (const o of opportunities) {
    if (!picked.has(o.category)) continue;
    const bucket = buckets.get(o.category);
    if (bucket) bucket.push(o);
    else buckets.set(o.category, [o]);
  }
  for (const bucket of buckets.values()) {
    bucket.sort(
      (a, b) =>
        Number(b.verifiesHours) - Number(a.verifiesHours) || a.name.localeCompare(b.name)
    );
  }

  // Deal one listing per cause per round, in pick order, so someone who chose
  // three causes sees all three represented — not one cause's whole roster.
  const dealOrder = interests.filter((c) => buckets.has(c));
  const suggestions: Suggestion[] = [];
  for (let round = 0; suggestions.length < limit; round++) {
    let dealt = false;
    for (const category of dealOrder) {
      const o = buckets.get(category)?.[round];
      if (!o) continue;
      suggestions.push({
        opportunity: o,
        reason: `Because you picked ${CATEGORY_META[o.category].label}`,
        score: 1 + (o.verifiesHours ? VERIFIES_HOURS_BOOST : 0),
      });
      dealt = true;
      if (suggestions.length >= limit) break;
    }
    // Every bucket ran dry before the limit — done.
    if (!dealt) break;
  }

  return suggestions;
}
