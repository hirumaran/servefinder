"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { LocationInput } from "@/components/filters/LocationInput";
import { QuickToggles, type ToggleKey } from "@/components/filters/QuickToggles";
import { RadiusSelect } from "@/components/filters/RadiusSelect";
import { IconArrowRight, IconSearch } from "@/components/icons";
import { DEFAULT_FILTERS, serializeFilters, type Filters } from "@/lib/filters";
import { useUserLocation } from "@/lib/location-context";

/** Starter searches for people who don't know what to type yet. */
const SUGGESTIONS = ["animals", "food bank", "tutoring", "outdoors"] as const;

/**
 * The hero search card. Collects keyword + location + radius + quick toggles,
 * then hands everything to /opportunities via the URL (which makes the search
 * shareable and keeps this component stateless after navigation).
 */
export function HomeSearchPanel() {
  const router = useRouter();
  const { location } = useUserLocation();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  function update(patch: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = serializeFilters(filters);
    router.push(query ? `/opportunities?${query}` : "/opportunities");
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search volunteer opportunities"
      className="relative space-y-5 rounded-3xl bg-white p-5 shadow-xl shadow-emerald-950/8 ring-1 ring-stone-900/10 sm:p-6"
    >
      <div className="space-y-2">
        <label htmlFor="home-q" className="block text-sm font-semibold text-slate-800">
          What do you care about?
        </label>
        <div className="relative">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
          />
          <input
            id="home-q"
            type="search"
            placeholder="Try “animals”, “food bank”, “tutoring”…"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            className="h-13 w-full rounded-xl border border-stone-300 bg-white pr-3 pl-10 text-base text-slate-900 placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-0.5">
          <span className="text-xs font-semibold text-slate-500">Stuck? Steal one of ours:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update({ q: s })}
              className={`inline-flex min-h-8 cursor-pointer items-center rounded-full border border-dashed px-3 text-xs font-semibold transition-all duration-150 ease-pop active:scale-90 ${
                filters.q === s
                  ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                  : "border-stone-300 text-slate-600 hover:-rotate-2 hover:border-emerald-600 hover:text-emerald-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:gap-4">
        <LocationInput
          idPrefix="home"
          zip={filters.zip}
          onZipCommit={(zip) => update({ zip })}
        />
        <div className="sm:w-44">
          <RadiusSelect
            idPrefix="home"
            radius={filters.radius}
            onChange={(radius) => update({ radius })}
            hasLocation={location !== null}
          />
        </div>
      </div>

      <QuickToggles
        filters={filters}
        onToggle={(key: ToggleKey) => update({ [key]: !filters[key] })}
      />

      <button
        type="submit"
        className="group inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-base font-bold text-white transition-all duration-150 hover:bg-emerald-800 active:scale-[0.98] sm:w-auto"
      >
        Show me what&apos;s out there
        <IconArrowRight
          aria-hidden="true"
          className="size-5 transition-transform duration-200 ease-pop group-hover:translate-x-1"
        />
      </button>
    </form>
  );
}
