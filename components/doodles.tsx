import type { SVGProps } from "react";

/**
 * Decorative hand-drawn accents (squiggles, underlines, connectors) that give
 * pages a made-by-a-person feel. All are purely decorative: aria-hidden,
 * stretch to fit their box, and inherit color via currentColor.
 */

/** Marker underline: two overlapping passes, like a word underlined twice. */
export function SquiggleUnderline(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 140 14"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path
        d="M4 9.5 C 26 5.5 48 4.5 70 6.5 C 92 8.5 114 8 136 5"
        strokeWidth={5}
        pathLength={100}
      />
      <path
        d="M10 12 C 36 9 64 8.5 90 10 C 105 10.8 119 10.3 130 9"
        strokeWidth={3.5}
        opacity={0.55}
        pathLength={100}
      />
    </svg>
  );
}

/** Vertical wavy dashed connector for step-by-step journeys. */
export function SquiggleConnector(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 12 100"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path
        d="M6 2 C 2.5 14 9.5 22 6 34 C 2.5 46 9.5 54 6 66 C 2.5 78 9.5 86 6 98"
        strokeWidth={2.4}
        strokeDasharray="0.5 7"
        pathLength={100}
      />
    </svg>
  );
}

/** Short horizontal squiggle, e.g. a divider or a casual em-dash stand-in. */
export function SquiggleDivider(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 80 10"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      aria-hidden
      {...props}
    >
      <path d="M3 6.5 C 10 3 17 3 24 6 C 31 9 38 9 45 6 C 52 3 59 3 66 6 C 71 8 74.5 8 77 6.5" strokeWidth={2.6} />
    </svg>
  );
}
