"use client";

import { Download, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

import { CATEGORY_META } from "@/lib/categories";
import {
  CATEGORIES,
  TIME_COMMITMENTS,
  type Category,
  type Opportunity,
  type TimeCommitment,
} from "@/lib/types";

const PLACEHOLDER_COMMENT =
  "⚠️ PLACEHOLDER DATA — replace with real, verified local organizations before launch. Confirm each org's contact info AND hour-verification policy directly with the org, and set lastVerified. See README → 'Adding & editing opportunities'.";

/** Editable form model: everything as strings/booleans for easy inputs. */
interface FormState {
  id: string;
  name: string;
  description: string;
  category: Category;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: string;
  lng: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  minAge: string;
  parentalConsentRequired: boolean;
  verifiesHours: boolean;
  timeCommitment: TimeCommitment;
  isVirtual: boolean;
  groupFriendly: boolean;
  requirements: string; // one per line
  hoursNotes: string;
  howToStart: string; // one step per line
  lastVerified: string;
}

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  description: "",
  category: "Community",
  street: "",
  city: "",
  state: "",
  zip: "",
  lat: "",
  lng: "",
  phone: "",
  email: "",
  website: "",
  contactPerson: "",
  minAge: "",
  parentalConsentRequired: false,
  verifiesHours: true,
  timeCommitment: "Flexible",
  isVirtual: false,
  groupFriendly: false,
  requirements: "",
  hoursNotes: "",
  howToStart: "",
  lastVerified: "",
};

function toForm(o: Opportunity): FormState {
  return {
    id: o.id,
    name: o.name,
    description: o.description,
    category: o.category,
    street: o.address.street,
    city: o.address.city,
    state: o.address.state,
    zip: o.address.zip,
    lat: String(o.lat),
    lng: String(o.lng),
    phone: o.contact.phone ?? "",
    email: o.contact.email ?? "",
    website: o.contact.website ?? "",
    contactPerson: o.contact.contactPerson ?? "",
    minAge: o.minAge === undefined ? "" : String(o.minAge),
    parentalConsentRequired: o.parentalConsentRequired ?? false,
    verifiesHours: o.verifiesHours,
    timeCommitment: o.timeCommitment,
    isVirtual: o.isVirtual,
    groupFriendly: o.groupFriendly,
    requirements: (o.requirements ?? []).join("\n"),
    hoursNotes: o.hoursNotes ?? "",
    howToStart: o.howToStart,
    lastVerified: o.lastVerified ?? "",
  };
}

/** Convert the form back into an Opportunity, or return an error message. */
function fromForm(form: FormState, existingIds: string[]): Opportunity | string {
  const id = form.id.trim() || slugify(form.name);
  if (!id) return "Name (or id) is required.";
  if (!/^[a-z0-9-]+$/.test(id)) return "Id must be lowercase letters, numbers, and dashes.";
  if (existingIds.includes(id)) return `Id "${id}" is already used by another listing.`;
  if (!form.name.trim()) return "Name is required.";
  if (!form.description.trim()) return "Description is required.";
  if (!form.howToStart.trim()) return "“How to get started” is required.";
  if (!form.street.trim() || !form.city.trim() || !form.state.trim() || !form.zip.trim()) {
    return "Full address (street, city, state, ZIP) is required.";
  }

  const lat = Number.parseFloat(form.lat);
  const lng = Number.parseFloat(form.lng);
  if (Number.isNaN(lat) || lat < -90 || lat > 90) return "Latitude must be between -90 and 90.";
  if (Number.isNaN(lng) || lng < -180 || lng > 180) return "Longitude must be between -180 and 180.";

  const minAge = form.minAge.trim() === "" ? undefined : Number.parseInt(form.minAge, 10);
  if (minAge !== undefined && (Number.isNaN(minAge) || minAge < 0 || minAge > 25)) {
    return "Minimum age must be a number between 0 and 25 (or blank for none).";
  }
  if (form.lastVerified && !/^\d{4}-\d{2}-\d{2}$/.test(form.lastVerified)) {
    return "Last verified must be a date (YYYY-MM-DD) or blank.";
  }

  const requirements = form.requirements
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    id,
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    address: {
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zip: form.zip.trim(),
    },
    lat,
    lng,
    contact: {
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.email.trim() && { email: form.email.trim() }),
      ...(form.website.trim() && { website: form.website.trim() }),
      ...(form.contactPerson.trim() && { contactPerson: form.contactPerson.trim() }),
    },
    ...(minAge !== undefined && { minAge }),
    ...(form.parentalConsentRequired && { parentalConsentRequired: true }),
    verifiesHours: form.verifiesHours,
    timeCommitment: form.timeCommitment,
    isVirtual: form.isVirtual,
    groupFriendly: form.groupFriendly,
    ...(requirements.length > 0 && { requirements }),
    ...(form.hoursNotes.trim() && { hoursNotes: form.hoursNotes.trim() }),
    howToStart: form.howToStart
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n"),
    ...(form.lastVerified && { lastVerified: form.lastVerified }),
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const inputClass =
  "h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-slate-900";
const textareaClass =
  "w-full rounded-lg border border-stone-300 bg-white p-3 text-sm text-slate-900";
const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1";

interface AdminClientProps {
  initialOpportunities: Opportunity[];
}

/**
 * In-browser listing editor. Changes live in component state; the operator
 * exports them via download/copy (or a dev-only direct save) and redeploys.
 */
export function AdminClient({ initialOpportunities }: AdminClientProps) {
  const [items, setItems] = useState<Opportunity[]>(initialOpportunities);
  const [editing, setEditing] = useState<"new" | string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const fileJson = () =>
    JSON.stringify({ $comment: PLACEHOLDER_COMMENT, opportunities: items }, null, 2);

  function startEdit(o: Opportunity) {
    setEditing(o.id);
    setForm(toForm(o));
    setError(null);
    window.scrollTo({ top: 0 });
  }

  function startNew() {
    setEditing("new");
    setForm(EMPTY_FORM);
    setError(null);
    window.scrollTo({ top: 0 });
  }

  function cancelEdit() {
    setEditing(null);
    setError(null);
  }

  function saveForm() {
    const otherIds = items.filter((o) => o.id !== editing).map((o) => o.id);
    const result = fromForm(form, otherIds);
    if (typeof result === "string") {
      setError(result);
      return;
    }
    setItems((prev) =>
      editing === "new"
        ? [...prev, result]
        : prev.map((o) => (o.id === editing ? result : o))
    );
    setEditing(null);
    setError(null);
    setNotice("Saved to the working copy — remember to export when you're done.");
  }

  function remove(id: string) {
    if (!window.confirm("Delete this listing from the working copy?")) return;
    setItems((prev) => prev.filter((o) => o.id !== id));
    setNotice("Deleted from the working copy — remember to export when you're done.");
  }

  function download() {
    const blob = new Blob([fileJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "opportunities.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(fileJson());
      setNotice("JSON copied to clipboard.");
    } catch {
      setNotice("Couldn't copy — use Download instead.");
    }
  }

  async function saveToDisk() {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: fileJson(),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    setNotice(
      data.ok
        ? `Wrote ${items.length} listings to data/opportunities.json.`
        : (data.error ?? "Save failed.")
    );
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-extrabold text-slate-900">
        Listing editor{" "}
        <span className="text-base font-semibold text-slate-500">({items.length} listings)</span>
      </h1>

      <div className="mt-3 rounded-xl bg-stone-100 p-4 text-sm leading-relaxed text-slate-700">
        <strong>How this works:</strong> edits below change a working copy in your
        browser. When you&apos;re done, <strong>Download JSON</strong> and replace{" "}
        <code className="rounded bg-white px-1">data/opportunities.json</code> in the
        repo, then redeploy{isDev && " — or use “Save to disk” while developing locally"}.
        Find coordinates for an address on openstreetmap.org: search it, right-click the
        spot, and pick “Show address” to read lat/lng.
      </div>

      {notice && (
        <p aria-live="polite" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
          {notice}
        </p>
      )}

      {/* ── Export toolbar ─────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startNew}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"
        >
          <Plus aria-hidden="true" className="size-4" /> Add listing
        </button>
        <button
          type="button"
          onClick={download}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600"
        >
          <Download aria-hidden="true" className="size-4" /> Download JSON
        </button>
        <button
          type="button"
          onClick={copyJson}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600"
        >
          Copy JSON
        </button>
        {isDev && (
          <button
            type="button"
            onClick={saveToDisk}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-50 px-4 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
          >
            <Save aria-hidden="true" className="size-4" /> Save to disk (dev)
          </button>
        )}
      </div>

      {/* ── Edit form ──────────────────────────────────────────────────── */}
      {editing !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveForm();
          }}
          className="mt-6 space-y-4 rounded-2xl border border-emerald-300 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">
              {editing === "new" ? "New listing" : `Editing: ${editing}`}
            </h2>
            <button
              type="button"
              onClick={cancelEdit}
              aria-label="Cancel editing"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-stone-100"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-name" className={labelClass}>Name *</label>
              <input id="f-name" className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-id" className={labelClass}>Id (blank = auto from name)</label>
              <input id="f-id" className={inputClass} value={form.id} onChange={(e) => set("id", e.target.value)} placeholder={slugify(form.name) || "kebab-case-slug"} />
            </div>
            <div>
              <label htmlFor="f-category" className={labelClass}>Category *</label>
              <select id="f-category" className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_META[c].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-time" className={labelClass}>Time commitment *</label>
              <select id="f-time" className={inputClass} value={form.timeCommitment} onChange={(e) => set("timeCommitment", e.target.value as TimeCommitment)}>
                {TIME_COMMITMENTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="f-desc" className={labelClass}>Description * (what they do + what the volunteer does)</label>
            <textarea id="f-desc" rows={3} className={textareaClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className={labelClass}>Address *</legend>
            <div className="sm:col-span-2">
              <label htmlFor="f-street" className="sr-only">Street</label>
              <input id="f-street" className={inputClass} placeholder="Street" value={form.street} onChange={(e) => set("street", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-city" className="sr-only">City</label>
              <input id="f-city" className={inputClass} placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="f-state" className="sr-only">State</label>
                <input id="f-state" className={inputClass} placeholder="State" value={form.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div>
                <label htmlFor="f-zip" className="sr-only">ZIP</label>
                <input id="f-zip" className={inputClass} placeholder="ZIP" value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="f-lat" className={labelClass}>Latitude *</label>
              <input id="f-lat" className={inputClass} inputMode="decimal" placeholder="42.3601" value={form.lat} onChange={(e) => set("lat", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-lng" className={labelClass}>Longitude *</label>
              <input id="f-lng" className={inputClass} inputMode="decimal" placeholder="-71.0589" value={form.lng} onChange={(e) => set("lng", e.target.value)} />
            </div>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className={labelClass}>Contact (public info only)</legend>
            <div>
              <label htmlFor="f-phone" className="sr-only">Phone</label>
              <input id="f-phone" className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-email" className="sr-only">Email</label>
              <input id="f-email" type="email" className={inputClass} placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-website" className="sr-only">Website</label>
              <input id="f-website" type="url" className={inputClass} placeholder="Website (https://…)" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-person" className="sr-only">Contact person</label>
              <input id="f-person" className={inputClass} placeholder="Contact person" value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="f-minage" className={labelClass}>Minimum age (blank = none)</label>
              <input id="f-minage" className={inputClass} inputMode="numeric" value={form.minAge} onChange={(e) => set("minAge", e.target.value)} />
            </div>
            <div>
              <label htmlFor="f-verified" className={labelClass}>Last verified (YYYY-MM-DD)</label>
              <input id="f-verified" type="date" className={inputClass} value={form.lastVerified} onChange={(e) => set("lastVerified", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {(
              [
                ["verifiesHours", "Verifies service hours"],
                ["parentalConsentRequired", "Parental consent required"],
                ["isVirtual", "Virtual option"],
                ["groupFriendly", "Group friendly"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="size-4 accent-emerald-700"
                />
                {label}
              </label>
            ))}
          </div>

          <div>
            <label htmlFor="f-reqs" className={labelClass}>Requirements (one per line)</label>
            <textarea id="f-reqs" rows={3} className={textareaClass} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-hours" className={labelClass}>Hours notes (how hours get documented)</label>
            <textarea id="f-hours" rows={2} className={textareaClass} value={form.hoursNotes} onChange={(e) => set("hoursNotes", e.target.value)} />
          </div>
          <div>
            <label htmlFor="f-start" className={labelClass}>How to get started * (one step per line)</label>
            <textarea id="f-start" rows={4} className={textareaClass} value={form.howToStart} onChange={(e) => set("howToStart", e.target.value)} />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800"
          >
            <Save aria-hidden="true" className="size-4" />
            {editing === "new" ? "Add to working copy" : "Update working copy"}
          </button>
        </form>
      )}

      {/* ── Listing table ──────────────────────────────────────────────── */}
      <ul className="mt-6 divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
        {items.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-slate-900">{o.name}</p>
              <p className="text-xs text-slate-500">
                {CATEGORY_META[o.category].label} · {o.address.city}, {o.address.state} ·{" "}
                {o.verifiesHours ? "verifies hours" : "no hour verification"} ·{" "}
                {o.lastVerified ? `verified ${o.lastVerified}` : "never verified"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(o)}
                className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-sm font-semibold text-slate-700 hover:border-emerald-600"
              >
                <Pencil aria-hidden="true" className="size-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => remove(o.id)}
                className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 aria-hidden="true" className="size-3.5" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
