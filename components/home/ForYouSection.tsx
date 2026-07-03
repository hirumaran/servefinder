"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { IconChevronDown, IconCompass } from "@/components/icons";
import { SuggestionCard } from "@/components/home/SuggestionCard";
import { InterestBubbles } from "@/components/onboarding/InterestBubbles";
import { Reveal } from "@/components/Reveal";
import { useInterests } from "@/lib/interests-context";
import { suggestOpportunities } from "@/lib/suggestions";
import type { Opportunity } from "@/lib/types";

/**
 * The heart of the dash: matches lined up from the causes picked during the
 * intro, worked out entirely in the browser. The picker is right here too, so
 * changing your mind re-deals the matches on the spot.
 *
 * Renders a skeleton until the interests store has hydrated (so static HTML
 * always matches), and hides itself from no-JS visitors via `.js-only`.
 */
export function ForYouSection({ opportunities }: { opportunities: Opportunity[] }) {
  const { interests, hydrated } = useInterests();
  const [editing, setEditing] = useState(false);

  const suggestions = useMemo(
    () => suggestOpportunities(interests, opportunities, 6),
    [interests, opportunities]
  );

  const noPicksYet = hydrated && interests.length === 0;

  return (
    <section
      aria-labelledby="for-you-heading"
      className="js-only mx-auto max-w-6xl px-4 py-14 sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="for-you-heading"
            className="flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl"
          >
            <IconCompass aria-hidden="true" className="size-7 text-emerald-700" />
            Picked for you
          </h2>
          <p className="mt-1 text-slate-600">
            Matched to your causes — worked out in your browser, never on a server.
          </p>
        </div>
        {!noPicksYet && (
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            aria-expanded={editing}
            aria-controls="for-you-picker"
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
          >
            Change my causes
            <IconChevronDown
              aria-hidden="true"
              className={`ease-pop size-4 transition-transform duration-200 ${editing ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {!hydrated ? (
        /* Pre-hydration skeleton keeps the layout steady while storage loads. */
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-36 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />
          ))}
        </ul>
      ) : noPicksYet ? (
        /* No picks (skipped the intro, or cleared them): invite, right here. */
        <div className="relative mt-6 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
          <span
            aria-hidden="true"
            className="absolute -top-3 left-8 h-6 w-16 -rotate-6 rounded-[3px] bg-amber-200/80 shadow-sm"
          />
          <h3 className="font-display text-lg font-bold text-slate-900">
            Tell us what you&apos;re into
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
            Pick a cause or three and matches show up right here. Your picks stay in
            this browser — never on a server.
          </p>
          <div className="mt-5">
            <InterestBubbles dense />
          </div>
        </div>
      ) : (
        <>
          {editing && (
            <div
              id="for-you-picker"
              className="animate-rise-in mt-6 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <InterestBubbles dense />
            </div>
          )}
          {suggestions.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
              Nothing lines up with those causes yet — try picking another, or{" "}
              <Link
                href="/opportunities"
                className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
              >
                browse everything
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, i) => (
                <li key={suggestion.opportunity.id}>
                  <Reveal delay={i * 90} className="h-full">
                    <SuggestionCard suggestion={suggestion} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
