"use client";

import { useState } from "react";

import { IconClipboardCheck } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_META } from "@/lib/categories";
import { MAX_SHIFT_HOURS, type Experience, type NewExperience } from "@/lib/experiences";
import { CATEGORIES, type Category, type Opportunity } from "@/lib/types";

/** Sentinel select value for "an org that isn't listed on this site". */
const CUSTOM = "__custom__";

/** Today's date in the user's timezone (toISOString would drift to UTC). */
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

interface ExperienceFormProps {
  opportunities: readonly Opportunity[];
  /** Entry being edited, or null when logging a new shift. */
  editing: Experience | null;
  /** Listing preselected via /journal?log=<id> (ignored while editing). */
  prefillOpportunityId?: string;
  onSave: (values: NewExperience) => void;
  onCancelEdit: () => void;
}

/**
 * Log-a-shift form. Pick one of the site's listings (category comes free) or
 * "somewhere else" with a typed name + cause. The parent remounts this
 * component (via key) when `editing` changes, so state can initialize simply.
 */
export function ExperienceForm({
  opportunities,
  editing,
  prefillOpportunityId,
  onSave,
  onCancelEdit,
}: ExperienceFormProps) {
  const listingIds = new Set(opportunities.map((o) => o.id));

  const initialChoice = editing
    ? editing.opportunityId && listingIds.has(editing.opportunityId)
      ? editing.opportunityId
      : CUSTOM
    : prefillOpportunityId && listingIds.has(prefillOpportunityId)
      ? prefillOpportunityId
      : "";

  const [orgChoice, setOrgChoice] = useState(initialChoice);
  const [customOrg, setCustomOrg] = useState(
    editing && initialChoice === CUSTOM ? editing.orgName : ""
  );
  const [customCategory, setCustomCategory] = useState<Category>(
    editing?.category ?? "Community"
  );
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [hours, setHours] = useState(editing ? String(editing.hours) : "");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const selectedListing =
    orgChoice && orgChoice !== CUSTOM
      ? opportunities.find((o) => o.id === orgChoice)
      : undefined;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!orgChoice) {
      setError("Pick a place — or choose “Somewhere else” and type it in.");
      return;
    }
    if (orgChoice === CUSTOM && customOrg.trim() === "") {
      setError("Type the organization's name.");
      return;
    }
    const parsedHours = Number(hours);
    if (!Number.isFinite(parsedHours) || parsedHours <= 0 || parsedHours > MAX_SHIFT_HOURS) {
      setError(`Hours should be a number between 0.5 and ${MAX_SHIFT_HOURS}.`);
      return;
    }
    if (!date) {
      setError("Pick the date of your shift.");
      return;
    }
    if (date > todayISO()) {
      setError("That date's in the future — log shifts once you've done them.");
      return;
    }

    setError(null);
    const trimmedNotes = notes.trim();
    onSave(
      selectedListing
        ? {
            opportunityId: selectedListing.id,
            orgName: selectedListing.name,
            category: selectedListing.category,
            date,
            hours: parsedHours,
            notes: trimmedNotes === "" ? undefined : trimmedNotes,
          }
        : {
            orgName: customOrg.trim(),
            category: customCategory,
            date,
            hours: parsedHours,
            notes: trimmedNotes === "" ? undefined : trimmedNotes,
          }
    );

    // Adding stays on the form, ready for the next shift; the parent handles
    // closing edit mode (this instance is remounted away).
    if (!editing) {
      setOrgChoice("");
      setCustomOrg("");
      setHours("");
      setNotes("");
      setDate(todayISO());
    }
  }

  const inputClass =
    "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400";
  const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-5"
      aria-label={editing ? "Edit journal entry" : "Log a shift"}
    >
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
        <IconClipboardCheck aria-hidden="true" className="size-5 text-emerald-700" />
        {editing ? "Edit this entry" : "Log a shift"}
      </h2>
      {editing && (
        <p className="mt-1 inline-flex rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
          Editing: {editing.orgName}
        </p>
      )}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="exp-org" className={labelClass}>
            Where did you volunteer?
          </label>
          <select
            id="exp-org"
            value={orgChoice}
            onChange={(e) => setOrgChoice(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Choose a place…
            </option>
            <optgroup label="From this site">
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Not listed here?">
              <option value={CUSTOM}>Somewhere else (type it in)</option>
            </optgroup>
          </select>

          {selectedListing && (
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <Badge
                colorClass={CATEGORY_META[selectedListing.category].badgeClass}
                icon={CATEGORY_META[selectedListing.category].icon}
              >
                {CATEGORY_META[selectedListing.category].label}
              </Badge>
              {selectedListing.address.city}, {selectedListing.address.state}
            </p>
          )}
        </div>

        {orgChoice === CUSTOM && (
          <>
            <div>
              <label htmlFor="exp-custom-org" className={labelClass}>
                Organization name
              </label>
              <input
                id="exp-custom-org"
                type="text"
                value={customOrg}
                onChange={(e) => setCustomOrg(e.target.value)}
                placeholder="e.g. St. Mary's Soup Kitchen"
                maxLength={120}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="exp-custom-category" className={labelClass}>
                What kind of cause?
              </label>
              <select
                id="exp-custom-category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_META[category].label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="exp-date" className={labelClass}>
              Date
            </label>
            <input
              id="exp-date"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="exp-hours" className={labelClass}>
              Hours
            </label>
            <input
              id="exp-hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="2"
              min={0.5}
              max={MAX_SHIFT_HOURS}
              step={0.5}
              inputMode="decimal"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="exp-notes" className={labelClass}>
            Notes <span className="font-normal text-slate-400">(just for you)</span>
          </label>
          <textarea
            id="exp-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="What did you do? Who should you ask for next time? Worth going back?"
            className={inputClass}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-semibold text-rose-600">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-800 active:scale-95"
          >
            {editing ? "Save changes" : "Add to journal"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
