"use client";

import { BadgeCheck, Laptop, MapPin, Users } from "lucide-react";
import Link from "next/link";

import { FavoriteButton } from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_META } from "@/lib/categories";
import { formatMiles } from "@/lib/distance";
import type { ScoredOpportunity } from "@/lib/filters";
import { TIME_COMMITMENT_LABELS } from "@/lib/types";

interface OpportunityCardProps {
  result: ScoredOpportunity;
  /** True when this card's map pin is selected — shown as a ring. */
  highlighted: boolean;
}

/** Human age label: "Ages 16+" or "No age minimum". */
export function ageLabel(minAge: number | undefined): string {
  return minAge === undefined ? "No age minimum" : `Ages ${minAge}+`;
}

/**
 * One result card. The whole card is clickable via a stretched title link;
 * the heart button sits above it (z-index) so both stay independently usable.
 */
export function OpportunityCard({ result, highlighted }: OpportunityCardProps) {
  const { opportunity: o, distanceMi } = result;
  const meta = CATEGORY_META[o.category];

  return (
    <article
      id={`opp-${o.id}`}
      className={`relative rounded-2xl border bg-white p-4 transition-shadow sm:p-5 ${
        highlighted
          ? "border-emerald-600 shadow-md ring-2 ring-emerald-600"
          : "border-stone-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-snug font-bold text-slate-900">
            {/* after:absolute inset-0 stretches this link across the card. */}
            <Link
              href={`/opportunities/${o.id}`}
              className="after:absolute after:inset-0 after:rounded-2xl hover:text-emerald-800"
            >
              {o.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5" />
              {o.address.city}, {o.address.state}
            </span>
            {distanceMi !== null && (
              <span className="font-semibold text-emerald-800">
                {formatMiles(distanceMi)} away
              </span>
            )}
          </p>
        </div>
        {/* z-10 keeps the heart clickable above the stretched link. */}
        <div className="relative z-10">
          <FavoriteButton opportunityId={o.id} opportunityName={o.name} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{o.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge colorClass={meta.badgeClass} icon={meta.icon}>
          {meta.label}
        </Badge>
        {o.verifiesHours && (
          <Badge colorClass="bg-emerald-100 text-emerald-900" icon={BadgeCheck}>
            Verifies hours
          </Badge>
        )}
        <Badge srLabel="Age requirement:">{ageLabel(o.minAge)}</Badge>
        {o.isVirtual && (
          <Badge colorClass="bg-sky-100 text-sky-900" icon={Laptop}>
            Virtual
          </Badge>
        )}
        {o.groupFriendly && (
          <Badge icon={Users} srLabel="Group friendly:">
            Groups
          </Badge>
        )}
        <Badge srLabel="Time commitment:">{TIME_COMMITMENT_LABELS[o.timeCommitment]}</Badge>
      </div>
    </article>
  );
}
