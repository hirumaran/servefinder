"use client";

import { Heart, ListFilter, MapIcon, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CategoryChips } from "@/components/filters/CategoryChips";
import { LocationInput } from "@/components/filters/LocationInput";
import { QuickToggles, type ToggleKey } from "@/components/filters/QuickToggles";
import { RadiusSelect } from "@/components/filters/RadiusSelect";
import { EmptyState } from "@/components/results/EmptyState";
import { OpportunityCard } from "@/components/results/OpportunityCard";
import { SortSelect } from "@/components/results/SortSelect";
import { useFavorites } from "@/lib/favorites-context";
import {
  applyFilters,
  parseFilters,
  RADIUS_OPTIONS,
  serializeFilters,
  type Filters,
} from "@/lib/filters";
import { zipToCoords } from "@/lib/geocode";
import { useUserLocation } from "@/lib/location-context";
import type { Opportunity } from "@/lib/types";

// Leaflet touches `window` at import time — load the map client-side only.
const ResultsMap = dynamic(
  () => import("@/components/results/ResultsMap").then((m) => m.ResultsMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full w-full animate-pulse items-center justify-center bg-stone-200 text-sm font-medium text-slate-500"
        role="status"
      >
        Loading map…
      </div>
    ),
  }
);

const KEYWORD_DEBOUNCE_MS = 300;

interface ResultsClientProps {
  opportunities: Opportunity[];
}

/**
 * The whole results experience: filter bar + card list + map, with all filter
 * state living in the URL (shareable searches, working back button).
 */
export function ResultsClient({ opportunities }: ResultsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { location, setLocation } = useUserLocation();
  const { favorites } = useFavorites();

  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const [qInput, setQInput] = useState(filters.q);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function commitFilters(patch: Partial<Filters>) {
    // Merge against the URL's *live* state, never this render's snapshot —
    // a debounced commit can fire after other filter changes have landed,
    // and must not silently revert them.
    const current = parseFilters(new URLSearchParams(window.location.search));
    const query = serializeFilters({ ...current, ...patch });
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function updateFilters(patch: Partial<Filters>) {
    // If a keyword commit is pending, fold it in now instead of letting the
    // timer fire later against whatever this change writes to the URL.
    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
      patch = { q: qInput, ...patch };
    }
    commitFilters(patch);
  }

  // ── Keyword input, debounced into the URL ─────────────────────────────
  useEffect(() => {
    // Follow external URL changes (back button, clear-all) — but never
    // clobber what the user is mid-typing (i.e. while a debounce is pending).
    if (debounceTimer.current === null) setQInput(filters.q);
  }, [filters.q]);

  // Never let a pending commit fire after this page unmounts (e.g. the user
  // clicked through to a detail page during the 300ms window).
  useEffect(
    () => () => {
      if (debounceTimer.current !== null) clearTimeout(debounceTimer.current);
    },
    []
  );

  function handleKeywordChange(value: string) {
    setQInput(value);
    if (debounceTimer.current !== null) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
      commitFilters({ q: value });
    }, KEYWORD_DEBOUNCE_MS);
  }

  // ── Hydrate location from a shared ?zip= link ─────────────────────────
  const attemptedZip = useRef<string | null>(null);
  useEffect(() => {
    if (location) {
      // Remember which ZIP the active location came from. When the user
      // clears it, `location` empties before the URL catches up — without
      // this marker we'd instantly re-hydrate the ZIP they just cleared.
      if (location.source === "zip" && location.zip) attemptedZip.current = location.zip;
      return;
    }
    if (!filters.zip || attemptedZip.current === filters.zip) return;
    attemptedZip.current = filters.zip;
    void zipToCoords(filters.zip).then((result) => {
      if (result.ok) {
        setLocation({ coords: result.coords, source: "zip", zip: filters.zip });
      }
    });
  }, [filters.zip, location, setLocation]);

  // ── Filtering + sorting ───────────────────────────────────────────────
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const results = useMemo(
    () => applyFilters(opportunities, filters, location?.coords ?? null),
    [opportunities, filters, location]
  );
  const visibleResults = useMemo(
    () =>
      showSavedOnly ? results.filter((r) => favorites.has(r.opportunity.id)) : results,
    [results, showSavedOnly, favorites]
  );

  // Dataset centroid — where the map looks with no results or location.
  const fallbackCenter = useMemo(() => {
    if (opportunities.length === 0) return { lat: 39.8283, lng: -98.5795 }; // continental US
    return {
      lat: opportunities.reduce((sum, o) => sum + o.lat, 0) / opportunities.length,
      lng: opportunities.reduce((sum, o) => sum + o.lng, 0) / opportunities.length,
    };
  }, [opportunities]);

  // ── Map pin ↔ card sync ───────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleSelectFromMap(id: string) {
    setSelectedId(id);
    // Scroll the matching card into view — desktop only, where list and map
    // are side by side. On mobile the pin popup itself links to the listing.
    if (window.matchMedia("(min-width: 768px)").matches) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById(`opp-${id}`)
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
  }

  // ── Mobile filter disclosure ──────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    (filters.q ? 1 : 0) +
    (filters.radius !== null ? 1 : 0) +
    filters.categories.length +
    (["verifiesHours", "virtualOk", "teenFriendly", "groupFriendly", "oneTimeOk"] as const)
      .filter((key) => filters[key]).length;

  const hasAnyFilter = activeFilterCount > 0 || filters.zip !== "" || location !== null;

  function clearAll() {
    // Cancel any pending keyword commit so it can't resurrect cleared filters.
    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    setShowSavedOnly(false);
    setLocation(null);
    attemptedZip.current = null;
    setQInput("");
    router.replace(pathname, { scroll: false });
  }

  function widenRadius() {
    const currentIndex = RADIUS_OPTIONS.indexOf(
      filters.radius as (typeof RADIUS_OPTIONS)[number]
    );
    const next = RADIUS_OPTIONS[currentIndex + 1] ?? null; // past 25 mi → any
    updateFilters({ radius: next });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
        Volunteer opportunities
      </h1>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <section
        aria-label="Search filters"
        className="print-hide mt-4 space-y-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              aria-label="Search by keyword, organization name, or cause"
              placeholder="Search by keyword…"
              value={qInput}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="h-12 w-full rounded-xl border border-stone-300 bg-white pr-3 pl-10 text-base text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="filter-panel"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800 md:hidden"
          >
            <ListFilter aria-hidden="true" className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-emerald-700 px-1.5 py-0.5 text-xs font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div id="filter-panel" className={`${filtersOpen ? "block" : "hidden"} space-y-4 md:block`}>
          <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
            <LocationInput
              idPrefix="results"
              zip={filters.zip}
              onZipCommit={(zip) => updateFilters({ zip })}
            />
            <RadiusSelect
              idPrefix="results"
              radius={filters.radius}
              onChange={(radius) => updateFilters({ radius })}
              hasLocation={location !== null}
            />
          </div>

          <CategoryChips
            selected={filters.categories}
            onChange={(categories) => updateFilters({ categories })}
          />

          <QuickToggles
            filters={filters}
            onToggle={(key: ToggleKey) => updateFilters({ [key]: !filters[key] })}
          />
        </div>
      </section>

      {/* ── Result count + sort ────────────────────────────────────────── */}
      <div className="print-hide mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-medium text-slate-600">
          <span className="font-bold text-slate-900">{visibleResults.length}</span>{" "}
          {visibleResults.length === 1 ? "opportunity" : "opportunities"} found
          {location === null && (
            <span className="block text-slate-500 sm:ml-1 sm:inline">
              · add a ZIP or use your location to see distances
            </span>
          )}
          {location !== null && filters.radius !== null && (
            <span className="block text-slate-500 sm:ml-1 sm:inline">
              · virtual listings are always included
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {favorites.size > 0 && (
            <button
              type="button"
              aria-pressed={showSavedOnly}
              onClick={() => setShowSavedOnly((v) => !v)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                showSavedOnly
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-stone-300 bg-white text-slate-700 hover:border-rose-400 hover:text-rose-600"
              }`}
            >
              <Heart aria-hidden="true" className="size-4" />
              Saved this visit ({favorites.size})
            </button>
          )}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              <X aria-hidden="true" className="size-4" />
              Clear all
            </button>
          )}
          <SortSelect
            sort={filters.sort}
            onChange={(sort) => updateFilters({ sort })}
            hasLocation={location !== null}
          />
        </div>
      </div>

      {/* ── List + map ─────────────────────────────────────────────────── */}
      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,44%)]">
        <div>
          {visibleResults.length === 0 ? (
            <EmptyState
              onWidenRadius={location !== null && filters.radius !== null ? widenRadius : null}
              onTryVirtual={!filters.virtualOk ? () => updateFilters({ virtualOk: true }) : null}
              onClearFilters={clearAll}
            />
          ) : (
            <ul className="space-y-3">
              {visibleResults.map((result) => (
                <li key={result.opportunity.id}>
                  <OpportunityCard
                    result={result}
                    highlighted={selectedId === result.opportunity.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <section
          id="results-map"
          aria-label="Map of search results"
          className="print-hide h-80 scroll-mt-20 overflow-hidden rounded-2xl border border-stone-200 md:sticky md:top-20 md:h-[calc(100dvh-6.5rem)]"
        >
          <ResultsMap
            results={visibleResults}
            selectedId={selectedId}
            onSelect={handleSelectFromMap}
            userLocation={location?.coords ?? null}
            fallbackCenter={fallbackCenter}
          />
        </section>
      </div>

      {/* Mobile: quick hop down to the (stacked) map. */}
      {visibleResults.length > 0 && (
        <a
          href="#results-map"
          className="print-hide fixed bottom-5 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg md:hidden"
        >
          <MapIcon aria-hidden="true" className="size-4" />
          View map
        </a>
      )}
    </div>
  );
}
