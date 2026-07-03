"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  /** Widen the search radius (only offered when a radius is active). */
  onWidenRadius: (() => void) | null;
  /** Switch on the virtual filter (only offered when it's off). */
  onTryVirtual: (() => void) | null;
  onClearFilters: () => void;
}

/** Friendly no-results message with one-tap ways out. */
export function EmptyState({ onWidenRadius, onTryVirtual, onClearFilters }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <SearchX aria-hidden="true" className="mx-auto size-10 text-slate-300" />
      <h3 className="font-display mt-3 text-lg font-bold text-slate-900">
        No opportunities match yet
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
        Don&apos;t give up — try widening your search radius, or check out virtual
        opportunities you can do from home.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {onWidenRadius && (
          <button
            type="button"
            onClick={onWidenRadius}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Widen the radius
          </button>
        )}
        {onTryVirtual && (
          <button
            type="button"
            onClick={onTryVirtual}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
          >
            Show virtual options
          </button>
        )}
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
