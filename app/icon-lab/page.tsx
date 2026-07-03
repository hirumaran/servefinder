import type { ComponentType } from "react";

import * as Icons from "@/components/icons";
import { CATEGORY_META } from "@/lib/categories";
import { CATEGORIES } from "@/lib/types";

/**
 * Design-review sheet for the hand-inked icon set (not linked from the site).
 * Shows every icon at review size, inline size, and on the primary color,
 * plus the category icons inside their real badge chips.
 */

const UI_ICONS = [
  "IconSearch",
  "IconPin",
  "IconSprout",
  "IconArrowRight",
  "IconArrowLeft",
  "IconSparkle",
  "IconShieldHeart",
  "IconHeart",
  "IconClipboardCheck",
  "IconSpeech",
  "IconLaptop",
  "IconSignCheck",
  "IconChevronDown",
  "IconClock",
  "IconCopy",
  "IconPhone",
  "IconMail",
  "IconGlobe",
  "IconCompass",
  "IconCheck",
  "IconX",
  "IconFilter",
  "IconMap",
  "IconPrinter",
  "IconShare",
  "IconUser",
  "IconExternal",
  "IconNavigation",
  "IconAlert",
  "IconLock",
  "IconNotebook",
  "IconTrash",
] as const;

type IconComponent = ComponentType<{ className?: string }>;

export default function IconLabPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl font-extrabold text-slate-900">
        Pitch In&apos;s hand-inked icon set
      </h1>
      <p className="mt-1 text-slate-600">
        Every icon drawn for this site — no stock packs. Review sheet only.
      </p>

      <h2 className="mt-8 font-display text-lg font-bold text-slate-900">Causes</h2>
      <ul className="mt-3 flex flex-wrap gap-3">
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          return (
            <li
              key={category}
              className={`${meta.badgeClass} inline-flex items-center gap-2 rounded-2xl border-2 border-white px-3 py-2 shadow-sm`}
            >
              <Icon aria-hidden className="size-8" />
              <Icon aria-hidden className="size-4" />
              <span className="text-sm font-bold">{meta.label}</span>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 font-display text-lg font-bold text-slate-900">UI</h2>
      <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {UI_ICONS.map((name) => {
          const Icon = (Icons as Record<string, unknown>)[name] as IconComponent;
          return (
            <li key={name} className="flex items-center gap-3">
              <Icon aria-hidden className="size-9 text-slate-800" />
              <Icon aria-hidden className="size-5 text-slate-800" />
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
                <Icon aria-hidden className="size-5" />
              </span>
              <span className="font-mono text-xs text-slate-500">{name.replace(/^Icon/, "")}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
