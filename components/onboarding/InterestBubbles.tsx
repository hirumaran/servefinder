"use client";

import type { CSSProperties } from "react";

import { CATEGORY_META } from "@/lib/categories";
import { useInterests } from "@/lib/interests-context";
import { CATEGORIES } from "@/lib/types";

/** Same deterministic hand-placed tilts as the home sticker wall. */
const TILTS = [-2, 1.5, -1, 2.2, -1.6, 1.2, -2.4, 1.8, -1.2, 2, -1.8, 1.4, -2.2, 1.6, -1.4];

/**
 * The pick-your-causes bubbles (think the interest picker when you join
 * Spotify or X, but hand-inked). Tap to toggle; picks persist on-device via
 * the interests context. Used in the intro flow and inline on the home dash.
 */
export function InterestBubbles({ dense = false }: { dense?: boolean }) {
  const { interests, toggleInterest } = useInterests();

  return (
    <ul
      className={`flex flex-wrap ${dense ? "gap-2" : "gap-3 sm:gap-x-4 sm:gap-y-4"}`}
      aria-label="Causes to pick from"
    >
      {CATEGORIES.map((category, i) => {
        const meta = CATEGORY_META[category];
        const Icon = meta.icon;
        const pickedAt = interests.indexOf(category);
        const picked = pickedAt !== -1;
        return (
          <li key={category}>
            <button
              type="button"
              aria-pressed={picked}
              onClick={() => toggleInterest(category)}
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
              className={`ease-pop group inline-flex rotate-[var(--tilt)] items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-all duration-200 hover:rotate-0 active:scale-95 ${
                dense ? "min-h-10 py-1.5" : "min-h-11 py-2"
              } ${
                picked
                  ? `${meta.badgeClass} scale-105 border-white shadow-md`
                  : "border-stone-300 bg-white text-slate-600 hover:border-emerald-600 hover:text-emerald-800"
              }`}
            >
              <Icon
                aria-hidden="true"
                className={`ease-pop size-5 shrink-0 transition-transform duration-200 ${
                  picked ? "" : "group-hover:-rotate-6 group-hover:scale-110"
                }`}
              />
              {meta.label}
              {picked && (
                <span aria-hidden="true" className="text-xs font-extrabold opacity-70">
                  ✓
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
