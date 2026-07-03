"use client";

import dynamic from "next/dynamic";

import type { Opportunity } from "@/lib/types";

// ssr:false must live in a client component — this wrapper exists for that.
const DetailMap = dynamic(
  () => import("@/components/detail/DetailMap").then((m) => m.DetailMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full w-full animate-pulse items-center justify-center bg-stone-200 text-sm font-medium text-slate-500"
        role="status"
      >
        Loading map…
      </div>
    ),
  }
);

export function DetailMapSection({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div
      aria-label={`Map showing ${opportunity.name}`}
      role="region"
      className="print-hide h-56 overflow-hidden rounded-xl border border-stone-200"
    >
      <DetailMap opportunity={opportunity} />
    </div>
  );
}
