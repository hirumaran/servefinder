import Link from "next/link";

import { IconSparkle } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_META } from "@/lib/categories";
import type { Suggestion } from "@/lib/suggestions";

/**
 * One "picked for you" match on the home dash. Same stretched-link recipe as
 * OpportunityCard, plus the personal reason ("Because you picked …") as a
 * little amber sticky note.
 */
export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const o = suggestion.opportunity;
  const meta = CATEGORY_META[o.category];

  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap gap-1.5">
        <Badge colorClass={meta.badgeClass} icon={meta.icon}>
          {meta.label}
        </Badge>
        {o.verifiesHours && (
          <Badge colorClass="bg-emerald-100 text-emerald-900">Verifies hours</Badge>
        )}
      </div>

      <h3 className="mt-2 font-display text-base leading-snug font-bold text-slate-900">
        <Link
          href={`/opportunities/${o.id}`}
          className="after:absolute after:inset-0 after:rounded-2xl hover:text-emerald-800"
        >
          {o.name}
        </Link>
      </h3>
      <p className="mt-0.5 text-sm text-slate-500">
        {o.isVirtual ? "Virtual-friendly · " : ""}
        {o.address.city}, {o.address.state}
      </p>

      <p className="mt-auto flex items-start gap-1.5 pt-3 text-xs font-semibold text-amber-900">
        <IconSparkle aria-hidden="true" className="mt-px size-3.5 shrink-0 text-amber-500" />
        {suggestion.reason}
      </p>
    </article>
  );
}
