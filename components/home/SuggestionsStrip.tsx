"use client";

import Link from "next/link";
import { useMemo } from "react";

import { IconArrowRight, IconCompass } from "@/components/icons";
import { SuggestionCard } from "@/components/journal/SuggestionCard";
import { Reveal } from "@/components/Reveal";
import { useExperiences } from "@/lib/experiences-context";
import { suggestOpportunities } from "@/lib/suggestions";
import type { Opportunity } from "@/lib/types";

/**
 * Personalized picks on the home page, powered by the on-device journal.
 * Renders nothing for first-time visitors (and during the pre-hydration
 * pass, so the static HTML always matches).
 */
export function SuggestionsStrip({ opportunities }: { opportunities: Opportunity[] }) {
  const { experiences, hydrated } = useExperiences();
  const suggestions = useMemo(
    () => suggestOpportunities(experiences, opportunities, 3),
    [experiences, opportunities]
  );

  if (!hydrated || suggestions.length === 0) return null;

  return (
    <section aria-labelledby="for-you-heading" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="for-you-heading"
            className="flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl"
          >
            <IconCompass aria-hidden="true" className="size-7 text-emerald-700" />
            Welcome back — picked for you
          </h2>
          <p className="mt-1 text-slate-600">
            Based on your journal. Worked out in your browser; it never leaves your device.
          </p>
        </div>
        <Link
          href="/journal"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          Open my journal
          <IconArrowRight
            aria-hidden="true"
            className="ease-pop size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion, i) => (
          <li key={suggestion.opportunity.id}>
            <Reveal delay={i * 100} className="h-full">
              <SuggestionCard suggestion={suggestion} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
