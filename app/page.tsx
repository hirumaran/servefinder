import {
  ClipboardCheck,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { HomeSearchPanel } from "@/components/home/HomeSearchPanel";
import { CATEGORY_META } from "@/lib/categories";
import { getAllOpportunities } from "@/lib/opportunities";
import { CATEGORIES } from "@/lib/types";

/**
 * Home / Search. The hero search card is the primary CTA; everything below it
 * (categories, how-it-works, safety) supports first-time visitors who don't
 * know what to search for yet.
 */
export default function HomePage() {
  const opportunities = getAllOpportunities();

  const categoryCounts = new Map<string, number>();
  for (const o of opportunities) {
    categoryCounts.set(o.category, (categoryCounts.get(o.category) ?? 0) + 1);
  }
  const virtualCount = opportunities.filter((o) => o.isVirtual).length;

  return (
    <div>
      {/* ── Hero + search ─────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-900 uppercase">
              <Sparkles aria-hidden="true" className="size-3.5" />
              Free · No account needed
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Find volunteer work near you.
              <span className="block text-emerald-700">Earn your 40 hours.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              A curated directory of places that welcome high school volunteers —
              what they do, how far away they are, and whether they&apos;ll sign off
              on your service hours.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <HomeSearchPanel />
          </div>
        </div>
      </section>

      {/* ── Browse by cause ───────────────────────────────────────────── */}
      <section aria-labelledby="categories-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <h2 id="categories-heading" className="font-display text-2xl font-extrabold text-slate-900">
            Browse by cause
          </h2>
          <Link
            href="/opportunities"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            See all {opportunities.length} opportunities →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            const count = categoryCounts.get(category) ?? 0;
            const Icon = meta.icon;
            return (
              <li key={category}>
                <Link
                  href={`/opportunities?cats=${category}`}
                  className="flex h-full flex-col items-start gap-2 rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
                >
                  <span className={`flex size-9 items-center justify-center rounded-xl ${meta.badgeClass}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-sm leading-tight font-bold text-slate-900">{meta.label}</span>
                  <span className="text-xs text-slate-500">
                    {count} {count === 1 ? "listing" : "listings"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-sm text-slate-600">
          No ride? {virtualCount} of our listings are{" "}
          <Link
            href="/opportunities?virtual=1"
            className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
          >
            virtual — volunteer from home
          </Link>
          .
        </p>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section aria-labelledby="how-heading" className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="how-heading" className="font-display text-2xl font-extrabold text-slate-900">
            How it works
          </h2>
          <p className="mt-1 text-slate-600">
            ServeFinder is a <strong>finder, not a tracker</strong> — we help you discover
            places, and you take it from there.
          </p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "1. Search & compare",
                body: "Filter by cause, distance, age rules, and whether the org signs service-hour forms.",
              },
              {
                icon: HeartHandshake,
                title: "2. Reach out yourself",
                body: "Contact the organization directly using the info on its page — and loop in a parent or guardian.",
              },
              {
                icon: ClipboardCheck,
                title: "3. Confirm & serve",
                body: "Before you go, confirm details and that they'll sign your hour form. You keep your own records.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
              </li>
            ))}
          </ol>

          <Link
            href="/about"
            className="mt-6 inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            More about the 40-hour requirement and staying safe →
          </Link>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────────────────── */}
      <section aria-label="Privacy and safety" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-emerald-900 p-6 text-emerald-50 sm:flex-row sm:items-center sm:gap-6">
          <ShieldCheck aria-hidden="true" className="size-10 shrink-0 text-emerald-300" />
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Built to be safe for students
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-emerald-100">
              No accounts. No tracking. Location is optional and never leaves your
              browser. We only show organizations&apos; public contact info — and we
              always recommend involving a parent or guardian when you reach out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
