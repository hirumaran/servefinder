import type { Metadata } from "next";
import { Suspense } from "react";

import { ResultsClient } from "@/components/results/ResultsClient";
import { getAllOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Find opportunities",
  description:
    "Search and filter volunteer opportunities by cause, distance, age requirement, and whether the organization verifies service hours.",
};

/** Skeleton shown while the client bundle (and URL params) hydrate. */
function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-6 sm:px-6" role="status" aria-label="Loading results">
      <div className="h-8 w-72 rounded-lg bg-stone-200" />
      <div className="mt-4 h-44 rounded-2xl bg-stone-200" />
      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(320px,44%)]">
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-stone-200" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-stone-200 md:h-[calc(100dvh-6.5rem)]" />
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  // Loaded server-side at build time; the client filters this static list.
  const opportunities = getAllOpportunities();

  return (
    // useSearchParams() inside ResultsClient requires a Suspense boundary.
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsClient opportunities={opportunities} />
    </Suspense>
  );
}
