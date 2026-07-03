"use client";

import type { SortKey } from "@/lib/filters";

interface SortSelectProps {
  sort: SortKey;
  onChange: (sort: SortKey) => void;
  /** Distance sorting needs a location; we hint when it will act like A–Z. */
  hasLocation: boolean;
}

export function SortSelect({ sort, onChange, hasLocation }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="results-sort" className="text-sm font-semibold whitespace-nowrap text-slate-800">
        Sort by
      </label>
      <select
        id="results-sort"
        value={sort}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-11 cursor-pointer rounded-xl border border-stone-300 bg-white px-3 text-sm font-medium text-slate-900"
      >
        <option value="distance">
          {hasLocation ? "Distance (nearest first)" : "Distance (add a location)"}
        </option>
        <option value="name">Name (A–Z)</option>
        <option value="category">Category</option>
      </select>
    </div>
  );
}
