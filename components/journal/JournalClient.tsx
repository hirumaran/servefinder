"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  IconArrowRight,
  IconCompass,
  IconLock,
  IconNotebook,
  IconPrinter,
} from "@/components/icons";
import { ExperienceCard } from "@/components/journal/ExperienceCard";
import { ExperienceForm } from "@/components/journal/ExperienceForm";
import { HoursProgress } from "@/components/journal/HoursProgress";
import { SuggestionCard } from "@/components/journal/SuggestionCard";
import { Reveal } from "@/components/Reveal";
import { useExperiences } from "@/lib/experiences-context";
import type { NewExperience } from "@/lib/experiences";
import { suggestOpportunities } from "@/lib/suggestions";
import type { Opportunity } from "@/lib/types";

/**
 * The whole journal page: 40-hour tally, log-a-shift form, entries, and
 * journal-powered suggestions. Everything reads/writes the device-local
 * experiences context — nothing here talks to a server.
 */
export function JournalClient({ opportunities }: { opportunities: Opportunity[] }) {
  const {
    experiences,
    hydrated,
    totalHours,
    addExperience,
    updateExperience,
    removeExperience,
    clearJournal,
  } = useExperiences();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Capture ?log=<id> once (from the "Add it to your journal" links on detail
  // pages), then clean the URL so a reload doesn't re-prefill the form.
  const [prefillId] = useState(() => {
    const id = searchParams.get("log");
    return id && opportunities.some((o) => o.id === id) ? id : undefined;
  });
  useEffect(() => {
    if (searchParams.get("log")) router.replace("/journal", { scroll: false });
  }, [searchParams, router]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const editing = experiences.find((e) => e.id === editingId) ?? null;
  const listingIds = useMemo(() => new Set(opportunities.map((o) => o.id)), [opportunities]);
  const placeCount = new Set(experiences.map((e) => e.orgName.trim().toLowerCase())).size;
  const suggestions = useMemo(
    () => suggestOpportunities(experiences, opportunities, 3),
    [experiences, opportunities]
  );

  function announce(message: string) {
    setFlash(message);
    setTimeout(() => setFlash(null), 2500);
  }

  function handleSave(values: NewExperience) {
    if (editingId) {
      updateExperience(editingId, values);
      setEditingId(null);
      announce("Changes saved.");
    } else {
      addExperience(values);
      announce("Added to your journal — nice work.");
    }
  }

  function startEditing(id: string) {
    setEditingId(id);
    // The form sits above the list on small screens — bring it into view.
    requestAnimationFrame(() => {
      document.getElementById("journal-form")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Margin doodle, out of the way on small screens. */}
      <IconNotebook
        aria-hidden="true"
        className="animate-float-y absolute top-10 right-[3%] hidden size-14 -rotate-6 text-emerald-600/20 lg:block"
      />

      <header className="animate-rise-in max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          My volunteer journal
        </h1>
        <p className="mt-2 text-lg leading-relaxed text-slate-600">
          Log each shift, watch your hours stack up, and grab an idea for what&apos;s
          next. Everything stays on this device — it&apos;s your notebook, not ours.
        </p>
      </header>

      {!hydrated ? (
        /* Hold the layout until localStorage has been read — no flash of
           "empty journal" for someone with thirty logged hours. */
        <div role="status" aria-label="Loading your journal" className="mt-6 animate-pulse">
          <div className="h-40 rounded-2xl bg-stone-200" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="h-96 rounded-2xl bg-stone-200" />
            <div className="space-y-3">
              <div className="h-32 rounded-2xl bg-stone-200" />
              <div className="h-32 rounded-2xl bg-stone-200" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <HoursProgress
              totalHours={totalHours}
              shiftCount={experiences.length}
              placeCount={placeCount}
            />
          </div>

          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div id="journal-form" className="print-hide scroll-mt-24 lg:sticky lg:top-24">
              <ExperienceForm
                key={editing?.id ?? prefillId ?? "new"}
                opportunities={opportunities}
                editing={editing}
                prefillOpportunityId={prefillId}
                onSave={handleSave}
                onCancelEdit={() => setEditingId(null)}
              />
              {/* Announce saves to screen readers (and everyone else). */}
              <p aria-live="polite" className="mt-2 min-h-5 text-sm font-semibold text-emerald-800">
                {flash}
              </p>
            </div>

            <section aria-labelledby="entries-heading">
              <h2
                id="entries-heading"
                className="font-display text-lg font-bold text-slate-900"
              >
                Your shifts{" "}
                {experiences.length > 0 && (
                  <span className="font-semibold text-slate-400">({experiences.length})</span>
                )}
              </h2>

              {experiences.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
                  <IconNotebook aria-hidden="true" className="mx-auto size-10 text-slate-300" />
                  <h3 className="font-display mt-3 text-lg font-bold text-slate-900">
                    Nothing logged yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
                    After your first shift, come back and jot it down. Your hours add up
                    here, and your entries teach this page what to suggest next.
                  </p>
                  <Link
                    href="/opportunities"
                    className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800"
                  >
                    Find your first opportunity
                    <IconArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              ) : (
                <ul className="mt-3 space-y-3">
                  {experiences.map((experience) => (
                    <li key={experience.id}>
                      <ExperienceCard
                        experience={experience}
                        opportunityExists={
                          experience.opportunityId !== undefined &&
                          listingIds.has(experience.opportunityId)
                        }
                        onEdit={() => startEditing(experience.id)}
                        onDelete={() => removeExperience(experience.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* ── Suggestions from the journal ─────────────────────────────── */}
          {experiences.length > 0 && (
            <section aria-labelledby="suggestions-heading" className="print-hide mt-12">
              <h2
                id="suggestions-heading"
                className="flex items-center gap-2 font-display text-2xl font-extrabold text-slate-900"
              >
                <IconCompass aria-hidden="true" className="size-6 text-emerald-700" />
                Your next good deed?
              </h2>
              <p className="mt-1 text-slate-600">
                Picked from the causes you keep showing up for. Figured out right here in
                your browser — your journal never leaves this device.
              </p>

              {suggestions.length > 0 ? (
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((suggestion, i) => (
                    <li key={suggestion.opportunity.id}>
                      <Reveal delay={i * 100} className="h-full">
                        <SuggestionCard suggestion={suggestion} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-600">
                  You&apos;ve already logged every place we&apos;d suggest for your causes —{" "}
                  <Link
                    href="/opportunities"
                    className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
                  >
                    browse everything
                  </Link>{" "}
                  and pick a brand-new adventure.
                </p>
              )}
            </section>
          )}

          {/* ── Privacy + data controls ──────────────────────────────────── */}
          <section
            aria-labelledby="journal-privacy-heading"
            className="print-hide mt-12 rounded-2xl bg-stone-100 p-5 sm:p-6"
          >
            <h2
              id="journal-privacy-heading"
              className="flex items-center gap-2 font-display text-lg font-bold text-slate-900"
            >
              <IconLock aria-hidden="true" className="size-5 text-emerald-700" />
              Your journal is yours
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Entries are saved only in this browser, on this device — nothing is
              uploaded, and there&apos;s still no account. That also means clearing your
              browser data (or switching devices) leaves it behind, and it&apos;s not the
              official record: <strong>keep getting your school form signed</strong>.
              Print a copy any time for your counselor.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800"
              >
                <IconPrinter aria-hidden="true" className="size-4" />
                Print my journal
              </button>
              {experiences.length > 0 &&
                (confirmingClear ? (
                  <>
                    <span className="text-sm font-semibold text-slate-700">
                      This wipes every entry from this device. Sure?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearJournal();
                        setConfirmingClear(false);
                        setEditingId(null);
                        announce("Journal deleted from this device.");
                      }}
                      className="inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700"
                    >
                      Yes, delete it all
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingClear(false)}
                      className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-600"
                    >
                      Keep it
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(true)}
                    className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 hover:border-rose-400 hover:bg-rose-50"
                  >
                    Delete everything
                  </button>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
