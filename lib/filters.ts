/**
 * Filter/sort engine for the results page.
 *
 * The full filter state lives in the URL query string, which gives us
 * shareable result links for free and keeps all student input out of any
 * storage. `parseFilters`/`serializeFilters` are the two sides of that
 * round-trip; `applyFilters` does the actual client-side filtering.
 */

import { CATEGORY_META } from "./categories";
import { haversineMiles, type LatLng } from "./distance";
import { CATEGORIES, type Category, type Opportunity } from "./types";

/** Radius choices, in miles. `null` (not listed here) means "any distance". */
export const RADIUS_OPTIONS = [1, 3, 5, 10, 25] as const;

/** "Open to teens" toggle = no age minimum, or a minimum of 14 or under. */
export const TEEN_MAX_MIN_AGE = 14;

export type SortKey = "distance" | "name" | "category";

export interface Filters {
  /** Keyword search across name, description, category, and city. */
  q: string;
  /** ZIP the user typed. Empty string = no ZIP entered. */
  zip: string;
  /** Radius in miles; null = any distance. Only applies when location is set. */
  radius: number | null;
  /** Selected categories; empty = all categories. */
  categories: Category[];
  /** Quick toggles (all default off = don't filter). */
  verifiesHours: boolean;
  virtualOk: boolean;
  teenFriendly: boolean;
  groupFriendly: boolean;
  oneTimeOk: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: Filters = {
  q: "",
  zip: "",
  radius: null,
  categories: [],
  verifiesHours: false,
  virtualOk: false,
  teenFriendly: false,
  groupFriendly: false,
  oneTimeOk: false,
  sort: "distance",
};

/** Read filter state out of a URL query string. Unknown values fall back to defaults. */
export function parseFilters(params: URLSearchParams): Filters {
  const radiusRaw = Number.parseInt(params.get("radius") ?? "", 10);
  const radius = (RADIUS_OPTIONS as readonly number[]).includes(radiusRaw) ? radiusRaw : null;

  const categories = (params.get("cats") ?? "")
    .split(",")
    .filter((c): c is Category => (CATEGORIES as readonly string[]).includes(c));

  const sortRaw = params.get("sort");
  const sort: SortKey =
    sortRaw === "name" || sortRaw === "category" ? sortRaw : "distance";

  return {
    q: params.get("q") ?? "",
    zip: params.get("zip") ?? "",
    radius,
    categories,
    verifiesHours: params.get("verified") === "1",
    virtualOk: params.get("virtual") === "1",
    teenFriendly: params.get("teens") === "1",
    groupFriendly: params.get("group") === "1",
    oneTimeOk: params.get("onetime") === "1",
    sort,
  };
}

/** Write filter state into a query string (no leading "?"), omitting defaults. */
export function serializeFilters(f: Filters): string {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.zip) params.set("zip", f.zip);
  if (f.radius !== null) params.set("radius", String(f.radius));
  if (f.categories.length > 0) params.set("cats", f.categories.join(","));
  if (f.verifiesHours) params.set("verified", "1");
  if (f.virtualOk) params.set("virtual", "1");
  if (f.teenFriendly) params.set("teens", "1");
  if (f.groupFriendly) params.set("group", "1");
  if (f.oneTimeOk) params.set("onetime", "1");
  if (f.sort !== "distance") params.set("sort", f.sort);
  return params.toString();
}

/** An opportunity plus its distance from the user (null when location unknown). */
export interface ScoredOpportunity {
  opportunity: Opportunity;
  distanceMi: number | null;
}

function matchesKeyword(o: Opportunity, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    o.name,
    o.description,
    CATEGORY_META[o.category].label,
    o.address.city,
    o.address.state,
  ]
    .join(" ")
    .toLowerCase();
  // Every word the student typed must appear somewhere in the listing.
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

/** True when the listing has no age minimum, or one a young teen can meet. */
export function isTeenFriendly(o: Opportunity): boolean {
  return o.minAge === undefined || o.minAge <= TEEN_MAX_MIN_AGE;
}

/** True when a student can do this as a single outing rather than a weekly commitment. */
export function isOneTimeOk(o: Opportunity): boolean {
  return (
    o.timeCommitment === "OneTime" ||
    o.timeCommitment === "EventBased" ||
    o.timeCommitment === "Flexible"
  );
}

/**
 * Filter + sort the full dataset.
 *
 * Radius rules: the radius only applies when the user has set a location.
 * Virtual opportunities always pass the radius filter — they can be done from
 * home, so distance doesn't limit them.
 */
export function applyFilters(
  opportunities: Opportunity[],
  filters: Filters,
  userLocation: LatLng | null
): ScoredOpportunity[] {
  const scored: ScoredOpportunity[] = opportunities
    .filter((o) => {
      if (!matchesKeyword(o, filters.q)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(o.category))
        return false;
      if (filters.verifiesHours && !o.verifiesHours) return false;
      if (filters.virtualOk && !o.isVirtual) return false;
      if (filters.teenFriendly && !isTeenFriendly(o)) return false;
      if (filters.groupFriendly && !o.groupFriendly) return false;
      if (filters.oneTimeOk && !isOneTimeOk(o)) return false;
      return true;
    })
    .map((o) => ({
      opportunity: o,
      distanceMi: userLocation
        ? haversineMiles(userLocation, { lat: o.lat, lng: o.lng })
        : null,
    }))
    .filter(
      ({ opportunity, distanceMi }) =>
        userLocation === null ||
        filters.radius === null ||
        opportunity.isVirtual ||
        (distanceMi !== null && distanceMi <= filters.radius)
    );

  const byName = (a: ScoredOpportunity, b: ScoredOpportunity) =>
    a.opportunity.name.localeCompare(b.opportunity.name);

  switch (filters.sort) {
    case "name":
      scored.sort(byName);
      break;
    case "category":
      scored.sort(
        (a, b) =>
          CATEGORY_META[a.opportunity.category].label.localeCompare(
            CATEGORY_META[b.opportunity.category].label
          ) || byName(a, b)
      );
      break;
    case "distance":
      // Without a location there are no distances; fall back to name order.
      scored.sort((a, b) => {
        if (a.distanceMi === null && b.distanceMi === null) return byName(a, b);
        if (a.distanceMi === null) return 1;
        if (b.distanceMi === null) return -1;
        return a.distanceMi - b.distanceMi || byName(a, b);
      });
      break;
  }

  return scored;
}
