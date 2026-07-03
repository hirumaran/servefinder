import type { Metadata } from "next";
import { Suspense } from "react";

import { JournalClient } from "@/components/journal/JournalClient";
import { getAllOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "My journal",
  description:
    "Your private volunteer journal: log each shift, watch your hours add up toward 40, and get ideas for what's next. Stored only on your device — never uploaded.",
};

/** Mirrors the journal layout while the client bundle hydrates. */
function JournalSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading your journal"
      className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6 sm:py-10"
    >
      <div className="h-10 w-80 max-w-full rounded-lg bg-stone-200" />
      <div className="mt-6 h-40 rounded-2xl bg-stone-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="h-96 rounded-2xl bg-stone-200" />
        <div className="space-y-3">
          <div className="h-32 rounded-2xl bg-stone-200" />
          <div className="h-32 rounded-2xl bg-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function JournalPage() {
  // Loaded server-side at build time; the journal itself lives in the browser.
  const opportunities = getAllOpportunities();

  return (
    // useSearchParams() inside JournalClient requires a Suspense boundary.
    <Suspense fallback={<JournalSkeleton />}>
      <JournalClient opportunities={opportunities} />
    </Suspense>
  );
}
