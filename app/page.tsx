import Link from "next/link";
import type { CSSProperties } from "react";

import { SquiggleConnector, SquiggleUnderline } from "@/components/doodles";
import { ForYouSection } from "@/components/home/ForYouSection";
import { HomeSearchPanel } from "@/components/home/HomeSearchPanel";
import {
  IconArrowRight,
  IconCheck,
  IconCompass,
  IconKite,
  IconLaptop,
  IconLock,
  IconPaw,
  IconPin,
  IconSearch,
  IconShieldHeart,
  IconSignCheck,
  IconSpeech,
} from "@/components/icons";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_META } from "@/lib/categories";
import { getAllOpportunities } from "@/lib/opportunities";
import { CATEGORIES } from "@/lib/types";

/**
 * Home / the dash. First-time visitors get the onboarding flow (Monet front
 * door → how it works → pick your causes) played over this page; everyone
 * else lands straight on it: search up top, "picked for you" matches from
 * their causes right under, browse-all and safety below. Layout leans
 * "hand-placed": tilted sticker chips, squiggle accents, and an off-center
 * hero instead of stacked centered bands.
 */

/** Deterministic sticker tilts so the cause wall looks hand-placed, not random. */
const TILTS = [-2, 1.5, -1, 2.2, -1.6, 1.2, -2.4, 1.8, -1.2, 2, -1.8, 1.4, -2.2, 1.6, -1.4];

/**
 * Hero "receipts": a few real listings shown as tappable proof the directory
 * is real. Curated ids for name + category variety; a renamed id just drops
 * its chip (and the "+ N more" count adjusts) rather than breaking the build.
 */
const RECEIPT_IDS: readonly string[] = [
  "whisker-city-animal-shelter",
  "bay-state-food-bank",
  "maplewood-library-teen-corps",
  "blue-hills-trail-days",
];

/** Gentler tilts than the sticker wall — the receipts should whisper. */
const RECEIPT_TILTS = [-1.2, 0.8, -0.6, 1];

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
  {
    icon: IconCompass,
    title: "Come back for round two",
    body: "The causes you picked live on your device and keep fresh matches waiting on this page. Forty hours goes quick when it's stuff you like.",
  },
] as const;

export default function HomePage() {
  const opportunities = getAllOpportunities();

  const categoryCounts = new Map<string, number>();
  for (const o of opportunities) {
    categoryCounts.set(o.category, (categoryCounts.get(o.category) ?? 0) + 1);
  }
  const virtualCount = opportunities.filter((o) => o.isVirtual).length;
  const receipts = opportunities.filter((o) => RECEIPT_IDS.includes(o.id));

  return (
    <div>
      {/* First-visit onboarding: Monet front door → how it works → causes. */}
      <OnboardingFlow />

      {/* ── Hero + search ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        {/* Margin doodles — decorative only, out of the way on small screens. */}
        <IconPaw
          aria-hidden="true"
          className="animate-float-y absolute top-8 right-[6%] hidden size-9 rotate-12 text-emerald-600/15 md:block [animation-delay:1.3s]"
        />
        <IconKite
          aria-hidden="true"
          className="animate-float-y absolute bottom-10 left-[2.5%] hidden size-11 -rotate-12 text-emerald-600/15 md:block [animation-delay:2.1s]"
        />

        {/* Three grid children so the receipts row sits under the headline on
            desktop (col 1, row 2) but after the search card on phones (plain
            DOM order) — the CTA stays within the first swipe either way. */}
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_auto] lg:gap-x-14 lg:gap-y-8 lg:pt-16 lg:pb-20">
          <div className="animate-rise-in">
            <p className="inline-flex -rotate-1 items-center gap-1.5 rounded-lg border-2 border-white bg-amber-100 px-3 py-1 text-xs font-bold tracking-wide text-amber-900 uppercase shadow-sm">
              <IconLock aria-hidden="true" className="size-3.5" />
              Free · no accounts · no tracking
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.06] xl:text-6xl xl:leading-[1.05]">
              Your 40 hours are{" "}
              <span className="relative inline-block whitespace-nowrap">
                out there.
                <SquiggleUnderline className="draw-in absolute -bottom-1.5 left-0 h-3 w-full text-amber-400" />
              </span>
              <span className="block text-emerald-700">Let&apos;s go find them.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
              A hand-checked directory of animal shelters, food pantries, libraries,
              and more that actually welcome high school volunteers — and will sign
              off on your service hours.
            </p>

            {/* The trust numbers, loud: these three facts are the pitch.
                Ledger rows on phones (numeral | label), columns from sm up. */}
            <ul className="mt-8 grid max-w-2xl divide-y-2 divide-dashed divide-stone-200 sm:grid-cols-3 sm:gap-4 sm:divide-y-0">
              <li className="flex items-center gap-4 pb-3 sm:block sm:pb-0">
                <span className="relative inline-block w-14 shrink-0 font-display text-4xl font-extrabold tracking-tight text-emerald-800 tabular-nums sm:w-auto sm:text-5xl">
                  {opportunities.length}
                  <SquiggleUnderline className="absolute -bottom-1 left-0 h-2.5 w-full text-amber-400" />
                </span>
                <span className="block sm:mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <IconPin aria-hidden="true" className="size-4 shrink-0 text-emerald-700" />
                    real places
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                    every one hand-checked
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-4 py-3 sm:block sm:border-l-2 sm:border-dashed sm:border-stone-200 sm:py-0 sm:pl-4">
                <span className="inline-block w-14 shrink-0 font-display text-4xl font-extrabold tracking-tight text-emerald-800 tabular-nums sm:w-auto sm:text-5xl">
                  {virtualCount}
                </span>
                <span className="block sm:mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <IconLaptop aria-hidden="true" className="size-4 shrink-0 text-emerald-700" />
                    doable from home
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                    no ride needed
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-4 pt-3 sm:block sm:border-l-2 sm:border-dashed sm:border-stone-200 sm:pt-0 sm:pl-4">
                <span className="inline-block w-14 shrink-0 font-display text-4xl font-extrabold tracking-tight text-emerald-800 tabular-nums sm:w-auto sm:text-5xl">
                  0
                </span>
                <span className="block sm:mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <IconLock aria-hidden="true" className="size-4 shrink-0 text-emerald-700" />
                    accounts, ever
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">
                    nothing to sign up for
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* The search card: one clean elevation, held to the page by a strip
              of "tape" — same vocabulary as the safety note further down. */}
          <div className="animate-rise-in relative [animation-delay:150ms] lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <span
              aria-hidden="true"
              className="absolute -top-3 left-8 z-10 h-6 w-16 -rotate-6 rounded-[3px] bg-amber-200/80 shadow-sm"
            />
            <HomeSearchPanel />
          </div>

          {/* Receipts: a few real listings you can actually tap. */}
          <div className="animate-rise-in [animation-delay:250ms] lg:col-start-1 lg:row-start-2 lg:self-end">
            <p className="inline-block -rotate-1 text-xs font-bold text-slate-500">
              actual listings, not stock photos
            </p>
            <ul className="mt-2.5 flex flex-wrap items-center gap-2">
              {receipts.map((o, i) => {
                const Icon = CATEGORY_META[o.category].icon;
                return (
                  <li key={o.id} className="max-w-full">
                    <Link
                      href={`/opportunities/${o.id}`}
                      style={{ "--tilt": `${RECEIPT_TILTS[i % RECEIPT_TILTS.length]}deg` } as CSSProperties}
                      className="ease-pop inline-flex max-w-full rotate-[var(--tilt)] items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:rotate-0 hover:border-emerald-600 hover:text-emerald-800"
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0 text-emerald-700" />
                      {o.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/opportunities"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  + {opportunities.length - receipts.length} more
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Picked for you: matches from the causes they chose ────────── */}
      <ForYouSection opportunities={opportunities} />

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
                Servd points you at good places that match{" "}
                <strong className="relative inline-block whitespace-nowrap">
                  your causes
                  <SquiggleUnderline className="absolute -bottom-1 left-0 h-2 w-full text-amber-400" />
                </strong>{" "}
                — matched on your device, never on a server. You take it from there.
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
                  Servd is a plain directory of organizations&apos; public contact
                  info. There&apos;s nothing to sign up for, nothing to install, and
                  nothing that follows your kid around the internet. Even the causes
                  they pick live only in the browser on their device.
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold text-emerald-50 sm:grid-cols-3">
                  {[
                    "No accounts, ever",
                    "Location & causes stay on the device",
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
