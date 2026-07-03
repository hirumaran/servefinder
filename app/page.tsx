import Link from "next/link";
import type { CSSProperties } from "react";

import { SquiggleConnector, SquiggleUnderline } from "@/components/doodles";
import { HomeSearchPanel } from "@/components/home/HomeSearchPanel";
import {
  IconArrowRight,
  IconCheck,
  IconKite,
  IconLaptop,
  IconLock,
  IconPaw,
  IconPin,
  IconSearch,
  IconShieldHeart,
  IconSignCheck,
  IconSparkle,
  IconSpeech,
} from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_META } from "@/lib/categories";
import { getAllOpportunities } from "@/lib/opportunities";
import { CATEGORIES } from "@/lib/types";

/**
 * Home / Search. The hero search card is the primary CTA; everything below it
 * (causes, how-it-works, safety) supports first-time visitors who don't know
 * what to search for yet. Layout leans "hand-placed": tilted sticker chips,
 * squiggle accents, and an off-center hero instead of stacked centered bands.
 */

/** Deterministic sticker tilts so the cause wall looks hand-placed, not random. */
const TILTS = [-2, 1.5, -1, 2.2, -1.6, 1.2, -2.4, 1.8, -1.2, 2, -1.8, 1.4, -2.2, 1.6, -1.4];

const STEPS = [
  {
    icon: IconSearch,
    title: "Find your match",
    body: "Filter by cause, distance, and age rules — and see who actually signs service-hour forms before you commit a Saturday.",
  },
  {
    icon: IconSpeech,
    title: "Say hi (you've got this)",
    body: "Reach out using the contact info on the listing — orgs genuinely love hearing from students. Loop in a parent or guardian so everyone's in the know.",
  },
  {
    icon: IconSignCheck,
    title: "Do the thing, get it signed",
    body: "Confirm the details, show up, help out. Bring your hour form — orgs marked “Verifies hours” will sign it.",
  },
] as const;

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
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-emerald-50 to-stone-50">
        {/* Margin doodles — decorative only, out of the way on small screens. */}
        <IconSparkle
          aria-hidden="true"
          className="animate-float-y absolute top-14 left-[52%] hidden size-7 text-amber-400/80 lg:block"
        />
        <IconPaw
          aria-hidden="true"
          className="animate-float-y absolute top-8 right-[6%] hidden size-9 rotate-12 text-emerald-600/25 md:block [animation-delay:1.3s]"
        />
        <IconKite
          aria-hidden="true"
          className="animate-float-y absolute bottom-10 left-[2.5%] hidden size-11 -rotate-12 text-emerald-600/20 md:block [animation-delay:2.1s]"
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-20">
          <div className="animate-rise-in">
            <p className="inline-flex -rotate-1 items-center gap-1.5 rounded-lg border-2 border-white bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-900 uppercase shadow-sm">
              <IconSparkle aria-hidden="true" className="size-3.5" />
              Free · no accounts · no tracking
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06]">
              Your 40 hours are{" "}
              <span className="relative inline-block whitespace-nowrap">
                out there.
                <SquiggleUnderline className="draw-in absolute -bottom-1.5 left-0 h-3 w-full text-amber-400" />
              </span>
              <span className="block text-emerald-700">Let&apos;s go find them.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              A hand-checked directory of animal shelters, food pantries, libraries,
              and more that actually welcome high school volunteers — and will sign
              off on your service hours.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-600">
              <li className="flex items-center gap-1.5">
                <IconPin aria-hidden="true" className="size-4 text-emerald-700" />
                {opportunities.length} real places
              </li>
              <li className="flex items-center gap-1.5">
                <IconLaptop aria-hidden="true" className="size-4 text-emerald-700" />
                {virtualCount} doable from home
              </li>
              <li className="flex items-center gap-1.5">
                <IconLock aria-hidden="true" className="size-4 text-emerald-700" />
                zero accounts required
              </li>
            </ul>
          </div>

          {/* The search card sits on a couple of tilted paper layers, like a
              form someone actually handed you. */}
          <div className="animate-rise-in relative [animation-delay:150ms]">
            <div aria-hidden="true" className="absolute inset-0 -rotate-2 rounded-3xl bg-amber-200/70" />
            <div aria-hidden="true" className="absolute inset-0 rotate-1 rounded-3xl bg-emerald-200/50" />
            <HomeSearchPanel />
          </div>
        </div>
      </section>

      {/* ── Browse by cause: the sticker wall ─────────────────────────── */}
      <section aria-labelledby="causes-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="causes-heading" className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Pick your thing
            </h2>
            <p className="mt-1 text-slate-600">
              Whatever you&apos;re into, somebody nearby needs help with it.
            </p>
          </div>
          <Link
            href="/opportunities"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            See all {opportunities.length} opportunities
            <IconArrowRight
              aria-hidden="true"
              className="ease-pop size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap gap-3 sm:gap-x-4 sm:gap-y-5">
          {CATEGORIES.map((category, i) => {
            const meta = CATEGORY_META[category];
            const count = categoryCounts.get(category) ?? 0;
            const Icon = meta.icon;
            return (
              <li key={category}>
                <Reveal delay={Math.min(i * 35, 420)}>
                  <Link
                    href={`/opportunities?cats=${category}`}
                    style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
                    className={`${meta.badgeClass} ease-pop group inline-flex rotate-[var(--tilt)] items-center gap-2.5 rounded-2xl border-2 border-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:rotate-0 hover:shadow-md active:scale-95`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="ease-pop size-5 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
                    />
                    <span className="text-sm leading-tight font-bold">{meta.label}</span>
                    <span aria-hidden="true" className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold tabular-nums">
                      {count}
                    </span>
                    <span className="sr-only">
                      {count} {count === 1 ? "listing" : "listings"}
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <p className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
          <IconLaptop aria-hidden="true" className="size-5 text-emerald-700" />
          No ride? No problem —{" "}
          <Link
            href="/opportunities?virtual=1"
            className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
          >
            {virtualCount} of these are virtual
          </Link>{" "}
          and work from your bedroom.
        </p>
      </section>

      {/* ── How it works: sticky intro + journey rail ─────────────────── */}
      <section aria-labelledby="how-heading" className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <h2 id="how-heading" className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                How it works
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">
                ServeFinder is a{" "}
                <strong className="relative inline-block whitespace-nowrap">
                  finder, not a tracker
                  <SquiggleUnderline className="absolute -bottom-1 left-0 h-2 w-full text-amber-400" />
                </strong>{" "}
                — we point you at good places, and you take it from there.
              </p>
              <Link
                href="/about"
                className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                More about the 40-hour thing (and staying safe)
                <IconArrowRight
                  aria-hidden="true"
                  className="ease-pop size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

          <ol className="relative mt-10 space-y-12 lg:mt-1">
            <SquiggleConnector
              aria-hidden="true"
              className="absolute top-16 bottom-16 left-5 w-3 text-emerald-300"
            />
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <li key={step.title}>
                  <Reveal delay={i * 120}>
                    <div className="flex gap-5">
                      <span
                        className={`relative z-10 flex size-13 shrink-0 items-center justify-center rounded-2xl border-2 border-white font-display text-xl font-extrabold shadow-sm ${
                          i % 2 === 1
                            ? "rotate-2 bg-emerald-100 text-emerald-900"
                            : "-rotate-3 bg-amber-100 text-amber-900"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className={i === 1 ? "lg:translate-x-8" : ""}>
                        <h3 className="flex items-center gap-2 pt-1 font-display text-lg font-bold text-slate-900">
                          <StepIcon aria-hidden="true" className="size-5 shrink-0 text-emerald-700" />
                          {step.title}
                        </h3>
                        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── Safety note (taped to the page) + closer ──────────────────── */}
      <section aria-label="Privacy and safety" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="relative mx-auto max-w-3xl -rotate-[0.6deg] rounded-2xl bg-emerald-900 p-6 pt-8 text-emerald-50 shadow-xl shadow-emerald-900/15 sm:p-8">
            <span aria-hidden="true" className="absolute -top-3 left-10 h-6 w-16 -rotate-6 rounded-[3px] bg-amber-200/80 shadow-sm" />
            <span aria-hidden="true" className="absolute -top-3 right-10 h-6 w-16 rotate-3 rounded-[3px] bg-amber-200/80 shadow-sm" />
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
              <IconShieldHeart
                aria-hidden="true"
                className="size-12 shrink-0 text-emerald-300 sm:size-14"
              />
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Safe by design{" "}
                  <span className="font-semibold text-emerald-200">
                    (parents — this part&apos;s for you)
                  </span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-100">
                  ServeFinder is a plain directory of organizations&apos; public contact
                  info. There&apos;s nothing to sign up for, nothing to install, and
                  nothing that follows your kid around the internet.
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold text-emerald-50 sm:grid-cols-3">
                  {[
                    "No accounts, ever",
                    "Location stays on the device",
                    "Parents looped in by default",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-12 text-center">
          <Link
            href="/opportunities"
            className="group inline-flex items-center gap-2 font-display text-lg font-bold text-emerald-700 hover:text-emerald-900"
          >
            Okay — show me what&apos;s nearby
            <IconArrowRight
              aria-hidden="true"
              className="ease-pop size-5 transition-transform duration-200 group-hover:translate-x-1.5"
            />
          </Link>
        </p>
      </section>
    </div>
  );
}
