"use client";

import { RADIUS_OPTIONS } from "@/lib/filters";

interface RadiusSelectProps {
  radius: number | null;
  onChange: (radius: number | null) => void;
  /** Radius only makes sense once a location is set. */
  hasLocation: boolean;
  idPrefix: string;
}

/** "Within X miles" selector. Disabled (with a hint) until a location is set. */
export function RadiusSelect({ radius, onChange, hasLocation, idPrefix }: RadiusSelectProps) {
  const id = `${idPrefix}-radius`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
        Distance
      </label>
      <select
        id={id}
        value={radius === null ? "any" : String(radius)}
        onChange={(e) => onChange(e.target.value === "any" ? null : Number(e.target.value))}
        disabled={!hasLocation}
        aria-describedby={hasLocation ? undefined : `${id}-hint`}
        className="h-12 w-full cursor-pointer rounded-xl border border-stone-300 bg-white px-3 text-base text-slate-900 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-slate-400"
      >
        <option value="any">Any distance</option>
        {RADIUS_OPTIONS.map((miles) => (
          <option key={miles} value={miles}>
            Within {miles} {miles === 1 ? "mile" : "miles"}
          </option>
        ))}
      </select>
      {!hasLocation && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          Add a ZIP or use your location to filter by distance.
        </p>
      )}
    </div>
  );
}
