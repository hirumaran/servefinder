/**
 * Data access layer for opportunity listings.
 *
 * Today the "database" is data/opportunities.json, imported statically so it
 * ships with the build. Every read goes through this module, so swapping the
 * JSON file for SQLite/Postgres later means changing only this file — the UI
 * never touches the raw data source.
 *
 * The loader validates the JSON at first read and throws a descriptive error
 * if an operator edit broke the shape (wrong category name, missing field,
 * out-of-range coordinates, duplicate id, …).
 */

import rawData from "@/data/opportunities.json";

import { isValidHttpUrl } from "./format";
import { CATEGORIES, TIME_COMMITMENTS, type Opportunity } from "./types";

function fail(id: string, message: string): never {
  throw new Error(
    `Invalid opportunity data (id: "${id}"): ${message}. ` +
      "Fix data/opportunities.json — see README “Adding & editing opportunities”."
  );
}

function assertNonEmptyString(id: string, field: string, value: unknown): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(id, `"${field}" must be a non-empty string`);
  }
}

/** Validate one raw JSON record and return it typed. */
function validateOpportunity(raw: unknown, seenIds: Set<string>): Opportunity {
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : "(missing id)";

  assertNonEmptyString(id, "id", o.id);
  if (seenIds.has(o.id)) fail(id, "duplicate id — ids must be unique");
  if (!/^[a-z0-9-]+$/.test(o.id)) fail(id, "id must be a lowercase kebab-case slug");

  assertNonEmptyString(id, "name", o.name);
  assertNonEmptyString(id, "description", o.description);
  assertNonEmptyString(id, "howToStart", o.howToStart);

  if (!(CATEGORIES as readonly string[]).includes(o.category as string)) {
    fail(id, `"category" must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (!(TIME_COMMITMENTS as readonly string[]).includes(o.timeCommitment as string)) {
    fail(id, `"timeCommitment" must be one of: ${TIME_COMMITMENTS.join(", ")}`);
  }

  const address = o.address as Record<string, unknown> | undefined;
  if (!address) fail(id, '"address" is required');
  for (const field of ["street", "city", "state", "zip"] as const) {
    assertNonEmptyString(id, `address.${field}`, address[field]);
  }

  if (typeof o.lat !== "number" || o.lat < -90 || o.lat > 90) {
    fail(id, '"lat" must be a number between -90 and 90');
  }
  if (typeof o.lng !== "number" || o.lng < -180 || o.lng > 180) {
    fail(id, '"lng" must be a number between -180 and 180');
  }

  if (typeof o.contact !== "object" || o.contact === null) {
    fail(id, '"contact" is required (use {} if truly unknown, but every listing should have at least one contact method)');
  }
  const website = (o.contact as Record<string, unknown>).website;
  if (website !== undefined) {
    assertNonEmptyString(id, "contact.website", website);
    if (!isValidHttpUrl(website)) {
      fail(id, '"contact.website" must be a full URL including the scheme, e.g. https://example.org');
    }
  }

  for (const field of ["verifiesHours", "isVirtual", "groupFriendly"] as const) {
    if (typeof o[field] !== "boolean") fail(id, `"${field}" must be true or false`);
  }

  if (o.minAge !== undefined && (typeof o.minAge !== "number" || o.minAge < 0 || o.minAge > 25)) {
    fail(id, '"minAge" must be a number between 0 and 25, or omitted');
  }

  if (o.requirements !== undefined) {
    if (!Array.isArray(o.requirements) || o.requirements.some((r) => typeof r !== "string")) {
      fail(id, '"requirements" must be an array of strings');
    }
  }

  if (o.lastVerified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(o.lastVerified as string)) {
    fail(id, '"lastVerified" must be an ISO date like 2026-06-15');
  }

  seenIds.add(o.id);
  return o as unknown as Opportunity;
}

let cache: Opportunity[] | null = null;

/** All listings, validated. Memoized after the first call. */
export function getAllOpportunities(): Opportunity[] {
  if (cache) return cache;

  const file = rawData as { opportunities?: unknown };
  if (!Array.isArray(file.opportunities)) {
    throw new Error(
      'data/opportunities.json must be an object with an "opportunities" array'
    );
  }

  const seenIds = new Set<string>();
  cache = file.opportunities.map((raw) => validateOpportunity(raw, seenIds));
  return cache;
}

export function getOpportunityById(id: string): Opportunity | undefined {
  return getAllOpportunities().find((o) => o.id === id);
}
