"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LocationInput } from "@/components/filters/LocationInput";
import { QuickToggles, type ToggleKey } from "@/components/filters/QuickToggles";
import { RadiusSelect } from "@/components/filters/RadiusSelect";
import { DEFAULT_FILTERS, serializeFilters, type Filters } from "@/lib/filters";
import { useUserLocation } from "@/lib/location-context";

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
      className="space-y-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-lg shadow-stone-200/60 sm:p-6"
    >
      <div className="space-y-2">
        <label htmlFor="home-q" className="block text-sm font-semibold text-slate-800">
          What do you care about?
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400"
          />
          <input
            id="home-q"
            type="search"
            placeholder="Try “animals”, “food bank”, “tutoring”…"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            className="h-13 w-full rounded-xl border border-stone-300 bg-white pr-3 pl-10 text-base text-slate-900 placeholder:text-slate-400"
          />
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
        className="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-base font-bold text-white transition-colors hover:bg-emerald-800 sm:w-auto"
      >
        <Search aria-hidden="true" className="size-5" />
        Search opportunities
      </button>
    </form>
  );
}
