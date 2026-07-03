import { SearchX } from "lucide-react";
import Link from "next/link";

/** 404 — shown for unknown routes and unknown opportunity ids. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <SearchX aria-hidden="true" className="mx-auto size-12 text-slate-300" />
      <h1 className="font-display mt-4 text-3xl font-extrabold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 leading-relaxed text-slate-600">
        This page doesn&apos;t exist — the listing may have been removed, or the link
        has a typo. The opportunities are still out there, though.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/opportunities"
          className="inline-flex min-h-12 items-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Browse opportunities
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-xl border border-stone-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-emerald-600"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
