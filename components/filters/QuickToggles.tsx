"use client";

import { BadgeCheck, CalendarCheck, Laptop, Users, UserCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Filters } from "@/lib/filters";

/** The five boolean quick filters, in display order. */
export type ToggleKey = Extract<
  keyof Filters,
  "verifiesHours" | "virtualOk" | "teenFriendly" | "groupFriendly" | "oneTimeOk"
>;

const TOGGLES: Array<{ key: ToggleKey; label: string; icon: LucideIcon; title: string }> = [
  {
    key: "verifiesHours",
    label: "Verifies hours",
    icon: BadgeCheck,
    title: "Only orgs that sign school service-hour forms",
  },
  {
    key: "virtualOk",
    label: "Virtual OK",
    icon: Laptop,
    title: "Can be done remotely — no ride needed",
  },
  {
    key: "teenFriendly",
    label: "Open to teens",
    icon: UserCheck,
    title: "No age minimum, or 14 and under",
  },
  {
    key: "groupFriendly",
    label: "Group friendly",
    icon: Users,
    title: "Clubs and groups can volunteer together",
  },
  {
    key: "oneTimeOk",
    label: "One-time OK",
    icon: CalendarCheck,
    title: "Single events — no weekly commitment",
  },
];

interface QuickTogglesProps {
  filters: Filters;
  onToggle: (key: ToggleKey) => void;
}

/** Pill-style boolean filters. Buttons with aria-pressed, not fake checkboxes. */
export function QuickToggles({ filters, onToggle }: QuickTogglesProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold text-slate-800">Quick filters</legend>
      <div className="flex flex-wrap gap-2">
        {TOGGLES.map(({ key, label, icon: Icon, title }) => {
          const active = filters[key];
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              title={title}
              onClick={() => onToggle(key)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-300 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
