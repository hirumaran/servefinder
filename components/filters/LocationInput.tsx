"use client";

import { LocateFixed, MapPin, X } from "lucide-react";
import { useRef, useState } from "react";

import { isValidZip, ZIP_ERROR_MESSAGES, zipToCoords } from "@/lib/geocode";
import { useUserLocation } from "@/lib/location-context";

interface LocationInputProps {
  /** ZIP currently committed to the parent (usually mirrored into the URL). */
  zip: string;
  /** Called when a ZIP resolves ("02139") or the location is cleared (""). */
  onZipCommit: (zip: string) => void;
  /** Unique prefix so two instances (home + results) don't share input ids. */
  idPrefix: string;
}

/**
 * The location control: manual ZIP entry (default) plus an opt-in
 * "use my location" button. Location is optional everywhere — this component
 * only ever *offers* it, never requires it.
 */
export function LocationInput({ zip, onZipCommit, idPrefix }: LocationInputProps) {
  const { location, setLocation } = useUserLocation();

  const [zipInput, setZipInput] = useState(zip);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"zip" | "geo" | null>(null);
  // Tracks the most recent lookup so a slow response can't clobber a newer one.
  const lookupSeq = useRef(0);

  // If the parent's ZIP changes from elsewhere (URL nav, clear-all), follow it.
  // Adjusting state during render (not in an effect) avoids a cascading pass.
  const [prevZipProp, setPrevZipProp] = useState(zip);
  if (prevZipProp !== zip) {
    setPrevZipProp(zip);
    setZipInput(zip);
  }

  async function lookUpZip(candidate: string) {
    const seq = ++lookupSeq.current;
    setBusy("zip");
    setError(null);
    const result = await zipToCoords(candidate);
    if (seq !== lookupSeq.current) return; // a newer lookup superseded this one
    setBusy(null);

    if (result.ok) {
      setLocation({ coords: result.coords, source: "zip", zip: candidate });
      onZipCommit(candidate);
    } else {
      setError(ZIP_ERROR_MESSAGES[result.reason]);
    }
  }

  function handleZipChange(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 5);
    setZipInput(cleaned);
    setError(null);
    // Emptying the field while a ZIP location is active clears the filter —
    // otherwise results would stay sorted by a ZIP the input no longer shows.
    if (cleaned === "" && location?.source === "zip") {
      lookupSeq.current++; // abandon any in-flight lookup
      setBusy(null);
      setLocation(null);
      onZipCommit("");
      return;
    }
    // Look up automatically once we have 5 digits — no extra button press.
    if (isValidZip(cleaned) && cleaned !== location?.zip) void lookUpZip(cleaned);
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location. Try entering a ZIP instead.");
      return;
    }
    lookupSeq.current++; // a slow ZIP lookup must not clobber this choice
    setBusy("geo");
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBusy(null);
        setLocation({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          source: "geolocation",
        });
        setZipInput("");
        onZipCommit(""); // precise coords stay in memory, never in the URL
      },
      (err) => {
        setBusy(null);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was declined — no problem, a ZIP works just as well."
            : "Couldn't get your location. Try entering a ZIP instead."
        );
      },
      { timeout: 10_000, maximumAge: 300_000 }
    );
  }

  function clearLocation() {
    lookupSeq.current++; // abandon any in-flight lookup
    setBusy(null);
    setLocation(null);
    setZipInput("");
    setError(null);
    onZipCommit("");
  }

  const zipFieldId = `${idPrefix}-zip`;

  return (
    <div className="space-y-2">
      <label htmlFor={zipFieldId} className="block text-sm font-semibold text-slate-800">
        Location <span className="font-normal text-slate-500">(optional)</span>
      </label>

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-36 flex-1">
          <MapPin
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id={zipFieldId}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="ZIP code"
            value={zipInput}
            onChange={(e) => handleZipChange(e.target.value)}
            aria-describedby={`${idPrefix}-zip-status ${idPrefix}-privacy`}
            aria-invalid={error ? true : undefined}
            className="h-12 w-full rounded-xl border border-stone-300 bg-white pr-3 pl-9 text-base text-slate-900 placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={busy === "geo"}
          className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-600 hover:text-emerald-800 disabled:cursor-wait disabled:opacity-60"
        >
          <LocateFixed aria-hidden="true" className="size-4" />
          {busy === "geo" ? "Locating…" : "Use my location"}
        </button>
      </div>

      {/* Status + errors, announced politely to screen readers. */}
      <div id={`${idPrefix}-zip-status`} aria-live="polite" className="min-h-5 text-sm">
        {busy === "zip" && <span className="text-slate-500">Looking up ZIP…</span>}
        {error && <span className="font-medium text-red-700">{error}</span>}
        {!error && !busy && location && (
          <span className="inline-flex flex-wrap items-center gap-2 font-medium text-emerald-800">
            {location.source === "zip"
              ? `Using ZIP ${location.zip}`
              : "Using your device location"}
            <button
              type="button"
              onClick={clearLocation}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full bg-stone-200 px-3 text-sm font-semibold text-slate-700 hover:bg-stone-300"
            >
              <X aria-hidden="true" className="size-3.5" />
              Clear<span className="sr-only"> location</span>
            </button>
          </span>
        )}
      </div>

      <p id={`${idPrefix}-privacy`} className="text-xs text-slate-500">
        Used only to show distances. A ZIP you type appears in the page address so
        searches can be shared; your precise device location never leaves your browser.
      </p>
    </div>
  );
}
