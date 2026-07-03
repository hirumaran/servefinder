/**
 * ZIP → coordinates lookup against the bundled dataset in /public/zip-data.
 *
 * The dataset (US Census ZCTA gazetteer, public domain) is sharded by the
 * first two ZIP digits, so looking up "02139" fetches only /zip-data/02.json
 * (~10–40 KB). Shards are cached in memory for the life of the page. No
 * external geocoding API is used — no keys, no rate limits, and the student's
 * location never leaves the browser.
 */

import type { LatLng } from "./distance";

type Shard = Record<string, [number, number]>;

const shardCache = new Map<string, Shard | null>();

export function isValidZip(zip: string): boolean {
  return /^\d{5}$/.test(zip.trim());
}

export type ZipLookupResult =
  | { ok: true; coords: LatLng }
  | { ok: false; reason: "invalid" | "not-found" | "network" };

/** Human-readable message for each failure mode, shown next to the ZIP field. */
export const ZIP_ERROR_MESSAGES: Record<Exclude<ZipLookupResult, { ok: true }>["reason"], string> = {
  invalid: "Please enter a 5-digit ZIP code.",
  "not-found": "We couldn't find that ZIP code — double-check it and try again.",
  network: "Couldn't load ZIP data. Check your connection and try again.",
};

export async function zipToCoords(rawZip: string): Promise<ZipLookupResult> {
  const zip = rawZip.trim();
  if (!isValidZip(zip)) return { ok: false, reason: "invalid" };

  const prefix = zip.slice(0, 2);

  let shard = shardCache.get(prefix);
  if (shard === undefined) {
    try {
      const res = await fetch(`/zip-data/${prefix}.json`);
      if (res.status === 404) {
        // No shard for this prefix means no such ZIP range exists.
        shard = null;
      } else if (!res.ok) {
        return { ok: false, reason: "network" };
      } else {
        shard = (await res.json()) as Shard;
      }
      shardCache.set(prefix, shard);
    } catch {
      // Don't cache network failures — the user may retry once back online.
      return { ok: false, reason: "network" };
    }
  }

  const entry = shard?.[zip];
  if (!entry) return { ok: false, reason: "not-found" };

  return { ok: true, coords: { lat: entry[0], lng: entry[1] } };
}
