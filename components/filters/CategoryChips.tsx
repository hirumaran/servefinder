"use client";

import { CATEGORY_META } from "@/lib/categories";
import { CATEGORIES, type Category } from "@/lib/types";

interface CategoryChipsProps {
  selected: Category[];
  onChange: (categories: Category[]) => void;
}

/** Multi-select category chips. Scrolls horizontally on small screens. */
export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  function toggle(category: Category) {
    onChange(
      selected.includes(category)
        ? selected.filter((c) => c !== category)
        : [...selected, category]
    );
  }

  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold text-slate-800">
        Categories{" "}
        <span className="font-normal text-slate-500">
          {selected.length > 0 ? `(${selected.length} selected)` : "(all)"}
        </span>
      </legend>
      <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          const active = selected.includes(category);
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(category)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-300 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {meta.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
