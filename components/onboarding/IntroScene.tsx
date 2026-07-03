"use client";

import { ImageDithering } from "@paper-design/shaders-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { IconSprout } from "@/components/icons";

/**
 * The front door: Monet's "Water Lilies" (1906, public domain) rendered
 * through an ordered-dither shader, with the wordmark sitting in the calm
 * negative space at the center of the pond.
 *
 * The interaction: press and hold anywhere and the painting "develops" —
 * the dither grid tightens and the color count climbs until the canvas is
 * basically the real painting. Let go early and it relaxes back into dots.
 * Fully developed, it dissolves back into coarse blocks and hands off to the
 * next onboarding stage.
 *
 * Everything here maps hold-progress → two shader uniforms (`size`,
 * `colorSteps`), which @paper-design/shaders-react applies live. Reduced
 * motion (or no WebGL2) gets a static painting and a plain button.
 */

const PAINTING_SRC = "/intro/monet-water-lilies.jpg";
/** Dark pond ink — shown behind the wordmark until the canvas is ready. */
const POND_INK = "#33455f";

const HOLD_MS = 1600; // press time to fully develop the painting
const RELAX_MS = 850; // release decay back to the resting dither
const DEVELOPED_PAUSE_MS = 380; // beat of "there it is" before the dissolve
const EXIT_MS = 720; // dissolve-to-blocks handoff

/** Resting state: chunky posterized dots that still read as the painting.
    Developed: fine grid, full palette. */
const REST_SIZE = 6;
const DEVELOPED_SIZE = 1.3;
const REST_STEPS = 3;
const DEVELOPED_STEPS = 7;
const EXIT_SIZE = 20; // dissolve target

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;

type Phase = "hold" | "developed" | "exit";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const emptySubscribe = () => () => {};

export function IntroScene({ onEnter }: { onEnter: () => void }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
  // False during SSR/hydration, true right after — lets us feature-detect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const webglOk = useMemo(() => {
    if (!mounted) return true; // assume the good path until we can check
    try {
      return document.createElement("canvas").getContext("webgl2") !== null;
    } catch {
      return false;
    }
  }, [mounted]);

  // Single animated value driving both uniforms; re-rendered per frame.
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("hold");
  const [exitT, setExitT] = useState(0);

  const holdingRef = useRef(false);
  const progressRef = useRef(0);
  const phaseRef = useRef<Phase>("hold");
  const phaseAtRef = useRef(0);
  const enteredRef = useRef(false);
  const frameRef = useRef(0);

  const finish = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    onEnter();
  }, [onEnter]);

  // The develop/relax/dissolve loop. One rAF drives the whole scene.
  useEffect(() => {
    if (reducedMotion) return;
    let last = performance.now();

    function tick(now: number) {
      const dt = now - last;
      last = now;
      const phase = phaseRef.current;

      if (phase === "hold") {
        const direction = holdingRef.current ? dt / HOLD_MS : -dt / RELAX_MS;
        const next = Math.min(1, Math.max(0, progressRef.current + direction));
        if (next !== progressRef.current) {
          progressRef.current = next;
          setProgress(next);
        }
        if (next >= 1) {
          phaseRef.current = "developed";
          phaseAtRef.current = now;
          setPhase("developed");
        }
      } else if (phase === "developed") {
        if (now - phaseAtRef.current >= DEVELOPED_PAUSE_MS) {
          phaseRef.current = "exit";
          phaseAtRef.current = now;
          setPhase("exit");
        }
      } else {
        const t = Math.min(1, (now - phaseAtRef.current) / EXIT_MS);
        setExitT(t);
        if (t >= 1) {
          finish();
          return; // stop the loop; the scene is done
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [reducedMotion, finish]);

  const startHold = useCallback(() => {
    if (phaseRef.current === "hold") holdingRef.current = true;
  }, []);
  const endHold = useCallback(() => {
    holdingRef.current = false;
  }, []);

  // Map progress → uniforms. During the exit, the grid blows back up while
  // the whole scene fades — the painting dissolves into the blocks it came from.
  const developed = easeOutCubic(progress);
  const dissolve = easeInCubic(exitT);
  const exiting = phase === "exit";
  const size = exiting
    ? DEVELOPED_SIZE + (EXIT_SIZE - DEVELOPED_SIZE) * dissolve
    : REST_SIZE + (DEVELOPED_SIZE - REST_SIZE) * developed;
  const colorSteps = exiting
    ? Math.max(REST_STEPS, Math.round(DEVELOPED_STEPS - (DEVELOPED_STEPS - REST_STEPS) * dissolve))
    : Math.round(REST_STEPS + (DEVELOPED_STEPS - REST_STEPS) * developed);

  const interactive = phase === "hold" && !reducedMotion && webglOk;

  // Focus the hold region once it's live so keyboard users can hold Space
  // right away (and Escape-to-skip lands inside the dialog).
  const regionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (interactive) regionRef.current?.focus({ preventScroll: true });
  }, [interactive]);

  // The pointer/keyboard hold handlers only attach in interactive mode —
  // pointer capture on the region would otherwise eat clicks on the
  // fallback "Step in" button rendered inside it.
  const holdHandlers = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": "Press and hold to open Servd",
        "aria-describedby": "intro-hint",
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startHold();
        },
        onPointerUp: endHold,
        onPointerCancel: endHold,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            startHold();
          }
        },
        onKeyUp: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === " " || e.key === "Enter") endHold();
        },
        onBlur: endHold,
      }
    : {};

  return (
    <div
      ref={regionRef}
      {...holdHandlers}
      onContextMenu={(e) => e.preventDefault()}
      className="relative h-full w-full touch-none select-none"
      style={{ backgroundColor: POND_INK, opacity: exiting ? 1 - dissolve : 1 }}
    >
      {/* The pond. Fades in once the canvas has had a beat to boot. */}
      {webglOk ? (
        <div className="animate-rise-in absolute inset-0 [animation-delay:250ms] [animation-duration:900ms]">
          <ImageDithering
            image={PAINTING_SRC}
            type="8x8"
            originalColors
            colorBack={POND_INK}
            size={reducedMotion ? 2 : size}
            colorSteps={reducedMotion ? DEVELOPED_STEPS : colorSteps}
            fit="cover"
            speed={0}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        /* No WebGL2: the painting still makes a lovely front door. */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={PAINTING_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Wordmark, floating in the calm middle of the pond. */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-all duration-500 ease-settle ${
          exiting ? "scale-95 opacity-0" : ""
        }`}
      >
        <IconSprout
          aria-hidden="true"
          className="size-10 text-white/90 sm:size-12"
          style={{ filter: "drop-shadow(0 1px 8px rgba(15, 23, 42, 0.45))" }}
        />
        <h1
          className="mt-3 font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl"
          style={{ textShadow: "0 2px 18px rgba(15, 23, 42, 0.45)" }}
        >
          Servd
        </h1>
        <p
          className="mt-3 text-base font-semibold text-white/85 sm:text-lg"
          style={{ textShadow: "0 1px 10px rgba(15, 23, 42, 0.5)" }}
        >
          Good is out there. Go get your hands dirty.
        </p>
      </div>

      {/* The instruction + develop meter (or the reduced-motion button). */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 px-6">
        {interactive ? (
          <>
            <p
              id="intro-hint"
              className="text-sm font-semibold text-white/80"
              style={{ textShadow: "0 1px 8px rgba(15, 23, 42, 0.6)" }}
            >
              press and hold — let it develop
            </p>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Painting developed"
              className="h-1 w-32 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="h-full origin-left rounded-full bg-white"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </>
        ) : phase === "hold" ? (
          <button
            type="button"
            onClick={finish}
            className="min-h-12 rounded-xl border-2 border-white/70 bg-white/10 px-6 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            Step in
          </button>
        ) : null}
      </div>

      {/* Credit where it's due. */}
      <p className="absolute bottom-3 left-4 text-[11px] font-medium text-white/50">
        Claude Monet, <em>Water Lilies</em>, 1906
      </p>
    </div>
  );
}
