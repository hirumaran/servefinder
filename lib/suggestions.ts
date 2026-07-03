/**
 * "What next?" suggestions computed from the journal.
 *
 * Pure functions, no storage: given past experiences and the full listing set,
 * rank the places the student hasn't logged yet by how well they match the
 * causes they keep coming back to. All scoring happens in the browser, so a
 * student's interests never leave their device (see lib/experiences.ts).
 */

import type { Experience } from "./experiences";
import type { Category, Opportunity } from "./types";

export interface Suggestion {
  opportunity: Opportunity;
  /** Human reason shown under the card, e.g. "Because you volunteered with …". */
  reason: string;
  score: number;
}

/** How many of the most recent shifts get the "current interests" boost. */
const RECENT_SHIFTS = 3;
const RECENCY_BOOST = 1.5;

export function suggestOpportunities(
  experiences: readonly Experience[],
  opportunities: readonly Opportunity[],
  limit = 3
): Suggestion[] {
  if (experiences.length === 0) return [];

  const byId = new Map(opportunities.map((o) => [o.id, o]));

  // Interest profile: hours poured into each cause. Recent shifts count extra
  // so tastes can drift, and every entry counts at least one hour so a short
  // shift still registers as real interest.
  const newestFirst = [...experiences].sort(
    (a, b) => b.date.localeCompare(a.date) || b.loggedAt.localeCompare(a.loggedAt)
  );
  const categoryWeight = new Map<Category, number>();
  const latestOrgForCategory = new Map<Category, string>();
  const loggedIds = new Set<string>();
  const loggedOrgNames = new Set<string>();

  newestFirst.forEach((exp, index) => {
    const weight = Math.max(exp.hours, 1) * (index < RECENT_SHIFTS ? RECENCY_BOOST : 1);
    categoryWeight.set(exp.category, (categoryWeight.get(exp.category) ?? 0) + weight);
    if (!latestOrgForCategory.has(exp.category)) {
      latestOrgForCategory.set(exp.category, exp.orgName);
    }
    if (exp.opportunityId) loggedIds.add(exp.opportunityId);
    loggedOrgNames.add(exp.orgName.trim().toLowerCase());
  });

  // Secondary taste signal: a student whose logged listings lean virtual
  // probably wants more from-home options.
  const linkedListings = newestFirst
    .map((e) => (e.opportunityId ? byId.get(e.opportunityId) : undefined))
    .filter((o): o is Opportunity => o !== undefined);
  const leansVirtual =
    linkedListings.length > 0 &&
    linkedListings.filter((o) => o.isVirtual).length * 2 >= linkedListings.length;

  const scored: Suggestion[] = [];
  for (const o of opportunities) {
    // Never suggest somewhere they've already logged (by listing or by name).
    if (loggedIds.has(o.id)) continue;
    if (loggedOrgNames.has(o.name.trim().toLowerCase())) continue;

    // Only suggest causes they've actually shown interest in — an empty
    // section is better than a random one pretending to know them.
    const base = categoryWeight.get(o.category) ?? 0;
    if (base === 0) continue;

    let score = base;
    if (o.verifiesHours) score += 0.5; // students need the sign-off
    if (o.isVirtual && leansVirtual) score += 0.5;

    scored.push({
      opportunity: o,
      reason: `Because you volunteered with ${latestOrgForCategory.get(o.category)}`,
      score,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.opportunity.name.localeCompare(b.opportunity.name))
    .slice(0, limit);
}
