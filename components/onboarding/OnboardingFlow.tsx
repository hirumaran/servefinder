"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  IconArrowRight,
  IconClipboardCheck,
  IconSearch,
  IconSignCheck,
  IconSpeech,
} from "@/components/icons";
import { IntroScene } from "@/components/onboarding/IntroScene";
import { InterestBubbles } from "@/components/onboarding/InterestBubbles";
import { useInterests } from "@/lib/interests-context";

/**
 * First-visit flow, played once over the home page: the Monet front door →
 * a "how it works" primer → the pick-your-causes bubbles → the dash.
 *
 * Visibility is a two-part trick (see the boot script in app/layout.tsx):
 * the server always renders this markup but CSS keeps it display:none unless
 * the boot script flagged a first-time visitor on <html> before first paint.
 * So new visitors see the intro from the very first frame, returning
 * visitors never flash it, and after hydration React takes over and unmounts
 * it for anyone already onboarded.
 */

const HOW_STEPS = [
  {
    icon: IconSearch,
    title: "Find your match",
    body: "Search a hand-checked directory by cause, distance, and age rules — every listing welcomes high school volunteers.",
  },
  {
    icon: IconSpeech,
    title: "Say hi (you've got this)",
    body: "Reach out with the contact info on the listing, and loop in a parent or guardian so everyone's in the know.",
  },
  {
    icon: IconSignCheck,
    title: "Show up, help out",
    body: "Confirm the details, then do the thing. Bring your school's service-hour form to every shift.",
  },
  {
    icon: IconClipboardCheck,
    title: "Get it signed",
    body: "Places marked “Verifies hours” will sign your form on the spot. Forty hours goes quick when it's stuff you like.",
  },
] as const;

type Stage = "intro" | "how" | "interests";

export function OnboardingFlow() {
  const { hydrated, onboarded, interests, completeOnboarding } = useInterests();
  const [stage, setStage] = useState<Stage>("intro");
  const [leaving, setLeaving] = useState(false);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);

  // Open until onboarded; also true during SSR/hydration, where CSS (not
  // React) decides whether the markup is actually visible.
  const open = !hydrated || !onboarded;

  // Replaying the intro from the footer re-opens the flow — start it over.
  // (Render-time state adjustment, per the "you might not need an effect"
  // guidance, so the reset lands in the same render as the reopen.)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStage("intro");
      setLeaving(false);
    }
  }

  // Move focus to each new stage's heading so keyboard/AT users follow along.
  useEffect(() => {
    if (open && stage !== "intro") stageHeadingRef.current?.focus();
  }, [open, stage]);

  const finishFlow = useCallback(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      completeOnboarding();
      return;
    }
    setLeaving(true);
    window.setTimeout(completeOnboarding, 550);
  }, [completeOnboarding]);

  // Escape always skips, no matter where focus is.
  useEffect(() => {
    if (!open || !hydrated) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") finishFlow();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hydrated, finishFlow]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Servd"
      className={`onboarding-overlay ease-settle fixed inset-0 z-[70] transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : ""
      }`}
    >
      {stage === "intro" ? (
        <IntroScene onEnter={() => setStage("how")} />
      ) : (
        <div className="h-full w-full overflow-y-auto bg-stone-50">
          <div className="mx-auto max-w-2xl px-5 py-14 sm:px-6 sm:py-16">
            {stage === "how" ? (
              <div className="animate-rise-in">
                <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">
                  Servd, in four moves
                </p>
                <h2
                  ref={stageHeadingRef}
                  tabIndex={-1}
                  className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 outline-none sm:text-4xl"
                >
                  Here&apos;s the whole game
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Most high schools ask for <strong>40 hours of community service</strong>.
                  Servd finds you places that actually want teen volunteers — free, no
                  accounts, nothing tracking you.
                </p>

                <ol className="mt-8 space-y-6">
                  {HOW_STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <li key={step.title} className="flex gap-4">
                        <span
                          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white font-display text-lg font-extrabold shadow-sm ${
                            i % 2 === 1
                              ? "rotate-2 bg-emerald-100 text-emerald-900"
                              : "-rotate-3 bg-amber-100 text-amber-900"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="flex items-center gap-2 pt-0.5 font-display text-lg font-bold text-slate-900">
                            <StepIcon aria-hidden="true" className="size-5 shrink-0 text-emerald-700" />
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <button
                  type="button"
                  onClick={() => setStage("interests")}
                  className="group mt-10 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-base font-bold text-white transition-colors hover:bg-emerald-800 sm:w-auto"
                >
                  Next — make it yours
                  <IconArrowRight
                    aria-hidden="true"
                    className="ease-pop size-5 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </div>
            ) : (
              <div className="animate-rise-in">
                <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">
                  Last thing
                </p>
                <h2
                  ref={stageHeadingRef}
                  tabIndex={-1}
                  className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 outline-none sm:text-4xl"
                >
                  What are you into?
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Pick a few causes and Servd lines up matches on your home page. Your
                  picks stay in this browser — never on a server — and you can change
                  them any time.
                </p>

                <div className="mt-8">
                  <InterestBubbles />
                </div>

                <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    disabled={interests.length === 0}
                    onClick={finishFlow}
                    className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-base font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-slate-500 sm:w-auto"
                  >
                    {interests.length === 0
                      ? "Pick at least one cause"
                      : `Show my matches (${interests.length} picked)`}
                    <IconArrowRight
                      aria-hidden="true"
                      className="ease-pop size-5 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Always an exit: skips straight to the dash, keeps any picks made. */}
      <button
        type="button"
        onClick={finishFlow}
        className={`absolute top-4 right-4 min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors ${
          stage === "intro"
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-slate-500 hover:bg-stone-200 hover:text-slate-800"
        }`}
      >
        {stage === "interests" ? "Skip for now" : "Skip intro"}
      </button>
    </div>
  );
}
