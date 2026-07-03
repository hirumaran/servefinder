import type { SVGProps } from "react";

/**
 * Servd's hand-inked icon set.
 *
 * Every icon is drawn by hand on a 32×32 grid to feel like felt-tip doodles
 * in the margin of a notebook — nothing here comes from a stock icon pack.
 * The shared DNA that keeps the set coherent:
 *   - stroke 2.2, round caps/joins, fill none (small solid dots use <circle>)
 *   - no perfectly straight lines or perfect circles: every segment is a
 *     gently wobbled bézier, loops don't quite close, corners overshoot
 *   - one drawing = one idea plus at most one small accent (steam, dashes,
 *     a dot) — never a badge, never a container
 * Icons default to 24px and are sized by className (`size-5` etc.) like any
 * inline SVG; they're decorative by default (aria-hidden) — pass
 * aria-hidden={undefined} plus a label if one ever conveys meaning alone.
 */
export type IconProps = SVGProps<SVGSVGElement>;

function Doodle(props: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    />
  );
}

/* ── UI icons ──────────────────────────────────────────────────────── */

export function IconSearch(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M13.4 6.2 C 9.4 6.6 6.4 9.8 6.5 13.8 C 6.6 17.9 9.9 21 13.9 20.9 C 17.9 20.8 20.9 17.6 20.8 13.6 C 20.7 9.7 17.5 6.4 13.9 6.3" />
      <path d="M20.9 21.2 C 22.6 22.7 24.2 24.4 25.8 26.2" />
      <path d="M13.6 10.9 C 13.7 12.6 13.7 14.4 13.6 16.1 M11 13.5 C 12.7 13.6 14.5 13.6 16.2 13.5" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M15.8 27.2 C 11.6 22 7.6 17.7 7.4 13.2 C 7.2 8.4 11 4.6 15.9 4.5 C 20.8 4.4 24.8 8.3 24.6 13.1 C 24.4 17.6 20.4 22 16.3 27.1" />
      <path d="M15.9 10.7 C 14.5 10.8 13.5 11.9 13.6 13.2 C 13.7 14.5 14.8 15.5 16.1 15.4 C 17.4 15.3 18.4 14.2 18.3 12.9 C 18.2 11.7 17.2 10.7 16 10.7" />
    </Doodle>
  );
}

export function IconSprout(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M15.9 27.4 C 15.6 23.2 15.7 19 16.1 14.7" />
      <path d="M15.8 16.6 C 11.3 17 7.7 14.6 6.7 10 C 11.4 9.3 15.2 11.9 16 16.2" />
      <path d="M16.1 14.4 C 16.7 9.6 20.4 6.4 25.4 6.1 C 25 11 21.3 14.1 16.5 14.6" />
      <path d="M8.5 28.2 C 9.6 28 10.7 27.9 11.8 28 M20.2 28 C 21.3 27.9 22.4 28 23.5 28.2" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.3 16.4 C 11.9 15.7 18.5 15.8 25.1 16.1" />
      <path d="M19.4 9.9 C 21.6 12.3 23.8 14.4 26.4 16.1 C 23.6 17.7 21.2 19.9 19.2 22.4" />
    </Doodle>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Doodle {...props}>
      <g transform="scale(-1,1) translate(-32,0)">
        <path d="M5.3 16.4 C 11.9 15.7 18.5 15.8 25.1 16.1" />
        <path d="M19.4 9.9 C 21.6 12.3 23.8 14.4 26.4 16.1 C 23.6 17.7 21.2 19.9 19.2 22.4" />
      </g>
    </Doodle>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 4.8 C 16.9 10.6 20.9 14.6 26.6 15.5 C 20.9 16.4 16.9 20.4 16 26.2 C 15.1 20.4 11.1 16.4 5.4 15.5 C 11.1 14.6 15.1 10.6 16 4.8" />
      <circle cx="25.4" cy="25.3" r="1.4" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function IconShieldHeart(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 4.6 C 12.8 6.3 9.5 7.3 6.1 7.7 C 5.8 15.4 8.6 22.6 15.9 27.3 C 23.3 22.7 26.2 15.5 25.9 7.8 C 22.5 7.4 19.2 6.4 16.1 4.7" />
      <path d="M16 19.8 C 13.4 17.7 11.9 16 12 14.3 C 12.1 12.9 13.1 12 14.3 12.1 C 15.1 12.2 15.7 12.7 16 13.4 C 16.3 12.7 17 12.2 17.8 12.1 C 19 12 20 13 20 14.4 C 20 16 18.5 17.8 16.1 19.8" strokeWidth={2} />
    </Doodle>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 27 C 8.8 21.3 5.1 16.6 5.3 12 C 5.5 8.4 8 6 11.1 6.2 C 13.3 6.3 15.1 7.6 16 9.6 C 16.9 7.6 18.8 6.3 21 6.2 C 24.1 6.1 26.6 8.6 26.7 12.2 C 26.8 16.7 23.1 21.4 16.1 27" />
    </Doodle>
  );
}

export function IconClipboardCheck(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M11.2 6.4 C 9.7 6.5 8.4 6.5 7.3 6.7 C 7 13.5 7 20.3 7.3 27 C 13.1 27.3 18.9 27.3 24.7 27 C 25 20.3 25 13.5 24.7 6.7 C 23.5 6.5 22.2 6.5 20.8 6.4" />
      <path d="M12.4 4.6 C 14.8 4.4 17.2 4.4 19.6 4.6 C 19.8 5.8 19.8 7 19.6 8.2 C 17.2 8.4 14.8 8.4 12.4 8.2 C 12.2 7 12.2 5.8 12.4 4.6" />
      <path d="M11.5 17.3 C 12.8 18.5 13.9 19.9 14.8 21.4 C 16.4 17.9 18.5 14.9 21.2 12.4" />
    </Doodle>
  );
}

export function IconSpeech(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M9.3 5.6 C 13.8 5.2 18.3 5.2 22.8 5.6 C 25 5.8 26.5 7.3 26.6 9.5 C 26.7 11.9 26.7 14.3 26.6 16.7 C 26.5 18.9 25 20.3 22.8 20.4 C 20 20.5 17.3 20.5 14.5 20.5 C 12.6 22.7 10.4 24.4 7.7 25.6 C 8.5 23.9 8.9 22.2 8.9 20.3 C 7 19.9 5.6 18.5 5.5 16.5 C 5.4 14.2 5.4 11.9 5.5 9.6 C 5.6 7.4 7.1 5.8 9.3 5.6" />
      <circle cx="11.8" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.1" cy="13" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="20.4" cy="13" r="1.4" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function IconLaptop(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M7.6 7.2 C 13.2 6.9 18.8 6.9 24.4 7.2 C 24.7 11.1 24.7 15 24.4 18.9 C 18.8 19.2 13.2 19.2 7.6 18.9 C 7.3 15 7.3 11.1 7.7 7.3" />
      <path d="M4.3 23.6 C 12.1 22.9 19.9 22.9 27.7 23.5" />
    </Doodle>
  );
}

export function IconSignCheck(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M7.5 15.8 C 9.5 17.7 11.2 19.9 12.6 22.3 C 15.5 16.9 19.5 12.3 24.6 8.7" />
      <path d="M8.5 26.8 C 13.6 25.8 18.8 25.9 23.8 26.4" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M8.5 12.3 C 11 14.9 13.5 17.4 16.1 19.8 C 18.6 17.3 21 14.8 23.4 12.2" />
    </Doodle>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.4 C 10.2 5.5 5.7 10.1 5.8 15.9 C 5.9 21.7 10.5 26.3 16.2 26.2 C 21.9 26.1 26.4 21.5 26.3 15.8 C 26.2 10.1 21.6 5.5 16.3 5.4" />
      <path d="M16 9.8 C 16 12 16 14.1 16.1 16.2 C 17.6 17.4 19.1 18.5 20.6 19.5" />
    </Doodle>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M12 6.6 C 16.4 6.3 20.8 6.3 25.2 6.6 C 25.6 6.6 25.9 6.9 25.9 7.3 C 26.2 11.9 26.2 16.4 25.9 21" />
      <path d="M6.6 10.9 C 11 10.6 15.4 10.6 19.8 10.9 C 20.1 15.9 20.1 20.9 19.8 25.9 C 15.4 26.2 11 26.2 6.6 25.9 C 6.3 20.9 6.3 15.9 6.6 10.9" />
    </Doodle>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M7.4 6.2 C 9.1 5.4 10.5 5.9 11.4 7.5 C 12.1 8.6 12.7 9.8 13.2 11 C 13.8 12.5 13.3 13.8 12 14.7 C 13.5 17.9 15.8 20.2 19 21.6 C 19.9 20.3 21.2 19.8 22.7 20.4 C 23.9 20.9 25.1 21.4 26.2 22.1 C 27.7 23 28.2 24.5 27.3 26 C 26.3 27.8 24.7 28.4 22.7 27.9 C 14.3 25.8 7.7 19.2 5.6 10.8 C 5.1 8.8 5.7 7.2 7.4 6.2" />
    </Doodle>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.6 8.9 C 12.5 8.5 19.5 8.5 26.4 8.9 C 26.7 13.6 26.7 18.4 26.4 23.1 C 19.5 23.5 12.5 23.5 5.6 23.1 C 5.3 18.4 5.3 13.6 5.6 8.9" />
      <path d="M6.2 9.6 C 9.3 12.6 12.5 15.3 16 15.9 C 19.5 15.3 22.7 12.7 25.8 9.7" />
    </Doodle>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.4 C 10.2 5.5 5.7 10.1 5.8 15.9 C 5.9 21.7 10.5 26.3 16.2 26.2 C 21.9 26.1 26.4 21.5 26.3 15.8 C 26.2 10.1 21.6 5.5 16.3 5.4" />
      <path d="M15.9 5.6 C 12.2 8.8 12.1 22.9 16.1 26.1 C 20 22.8 20.1 8.9 16.2 5.6" />
      <path d="M6.2 15.6 C 12.7 16.3 19.4 16.3 25.9 15.7" />
    </Doodle>
  );
}

export function IconCompass(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.4 C 10.2 5.5 5.7 10.1 5.8 15.9 C 5.9 21.7 10.5 26.3 16.2 26.2 C 21.9 26.1 26.4 21.5 26.3 15.8 C 26.2 10.1 21.6 5.5 16.3 5.4" />
      <path d="M20.9 11.2 C 19.6 14 18.3 16.7 16.9 19.3 C 15 20.2 13.1 21 11.2 21.7 C 12.4 18.9 13.7 16.2 15.1 13.6 C 17 12.7 19 11.9 20.9 11.2" />
    </Doodle>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M6.5 16.8 C 8.9 18.8 11 21.1 12.8 23.7 C 16.2 17.5 20.5 12.1 26 7.6" />
    </Doodle>
  );
}

export function IconX(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M8.2 8.6 C 13.4 13.6 18.5 18.8 23.5 24.1" />
      <path d="M23.8 8.3 C 18.6 13.3 13.5 18.5 8.5 23.8" />
    </Doodle>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.4 6.9 C 12.5 6.5 19.5 6.5 26.6 6.9 C 24.4 10.3 21.1 14.5 18.8 17.8 C 19.2 20.9 19.2 23.9 18.9 26.9 C 17 26.3 15.2 25.4 13.4 24.4 C 13 22.3 13 20.1 13.3 18 C 10.4 14.5 7.8 10.8 5.6 7.2" />
    </Doodle>
  );
}

export function IconMap(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.4 9.4 C 8.4 7.9 10.9 7.3 12.9 7.9 C 15 8.9 17 9.1 19.1 8.4 C 21.6 7.5 24.1 7.3 26.6 7.8 C 26.9 13 26.9 18.2 26.6 23.4 C 24.1 22.9 21.6 23.1 19.1 24 C 17 24.7 15 24.5 12.9 23.5 C 10.9 22.9 8.4 23.5 5.4 25 C 5.1 19.8 5.1 14.6 5.4 9.4" />
      <path d="M12.9 8.1 C 13 13.2 13 18.3 12.9 23.3 M19.1 8.6 C 19 13.6 19 18.6 19.1 23.8" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconPrinter(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M9.9 10.9 C 9.7 8.9 9.8 7 10.1 5.1 C 14 4.8 17.9 4.8 21.9 5.1 C 22.2 7 22.3 8.9 22.1 10.9" />
      <path d="M9.6 21.1 C 8 21.1 6.4 21 4.8 20.7 C 4.7 18.5 4.7 16.3 4.7 14.1 C 4.7 12.3 5.6 11.3 7.4 11.2 C 13.1 10.9 18.9 10.9 24.6 11.2 C 26.4 11.3 27.3 12.3 27.3 14.1 C 27.3 16.3 27.3 18.5 27.2 20.7 C 25.6 21 24 21.1 22.4 21.1" />
      <path d="M9.8 17.8 C 13.9 17.5 18.1 17.5 22.2 17.8 C 22.4 20.9 22.4 24 22.2 27.1 C 18.1 27.4 13.9 27.4 9.8 27.1 C 9.6 24 9.6 20.9 9.8 17.8" />
      <circle cx="23.7" cy="14.3" r="1.3" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function IconShare(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 4.9 C 16 10 16 15.1 16.1 20.2" />
      <path d="M11.4 9.3 C 13 7.8 14.5 6.3 16 4.7 C 17.5 6.2 19 7.7 20.5 9.2" />
      <path d="M9.9 14.6 C 8.3 14.6 6.8 14.7 5.9 14.9 C 5.6 18.9 5.6 22.9 5.9 26.9 C 12.6 27.2 19.4 27.2 26.1 26.9 C 26.4 22.9 26.4 18.9 26.1 14.9 C 25.2 14.7 23.7 14.6 22.1 14.6" />
    </Doodle>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.5 C 13.8 5.6 12.2 7.3 12.3 9.5 C 12.4 11.7 14.1 13.3 16.2 13.2 C 18.3 13.1 19.9 11.4 19.8 9.3 C 19.7 7.2 18 5.6 16.1 5.5" />
      <path d="M6.9 26.4 C 7.3 20.2 10.9 16.7 16 16.7 C 21.1 16.7 24.7 20.3 25.1 26.3" />
    </Doodle>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M13.9 7.2 C 11.6 7.2 9.4 7.3 7.2 7.5 C 6.9 13.2 6.9 18.9 7.2 24.6 C 12.9 24.9 18.6 24.9 24.3 24.6 C 24.5 22.4 24.6 20.2 24.6 17.9" />
      <path d="M18.9 5.6 C 21.4 5.4 23.9 5.4 26.4 5.6 C 26.6 8.1 26.6 10.6 26.4 13.1" />
      <path d="M26.2 5.8 C 22.9 8.9 19.7 12.1 16.6 15.4" />
    </Doodle>
  );
}

export function IconNavigation(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M26.8 5.2 C 20 8 13.4 11 6.9 14.4 C 9.8 15.7 12.8 16.6 15.9 17.1 C 16.4 20.2 17.3 23.2 18.6 26.1 C 21.7 19.3 24.5 12.3 26.8 5.2" />
    </Doodle>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.6 C 12.4 11.6 8.9 17.7 5.6 23.9 C 5.2 24.7 5.6 25.4 6.5 25.4 C 12.8 25.7 19.2 25.7 25.5 25.4 C 26.4 25.4 26.8 24.6 26.4 23.8 C 23.1 17.7 19.6 11.6 16 5.6" />
      <path d="M16 13.2 C 16 14.8 16 16.4 16.1 18" />
      <circle cx="16.1" cy="21.8" r="1.4" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function IconNotebook(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M10.3 5.7 C 15.3 5.3 20.3 5.3 24.7 5.8 C 25.2 12.6 25.1 19.4 24.8 26.2 C 19.9 26.7 15 26.7 10.5 26.3 C 10.1 19.5 10 12.6 10.3 5.7" />
      <path d="M7.1 9.6 C 8.5 9.4 9.9 9.4 11.3 9.5 M7.2 16 C 8.6 15.8 10 15.8 11.4 15.9 M7.1 22.4 C 8.5 22.2 9.9 22.3 11.3 22.4" strokeWidth={1.8} />
      <path d="M14.6 12.2 C 16.7 12 18.8 12 20.8 12.1 M14.7 16.8 C 16.4 16.6 18.2 16.6 19.9 16.7" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M8.1 9.7 C 13.3 9.2 18.7 9.2 23.9 9.6" />
      <path d="M13.5 9.4 C 13.4 7.9 14.2 6.9 15.9 6.8 C 17.6 6.7 18.5 7.6 18.5 9.2" />
      <path d="M9.9 12.4 C 10.2 17.2 10.6 21.9 11.3 26.4 C 14.5 26.9 17.7 26.9 20.8 26.5 C 21.5 21.9 21.9 17.1 22.1 12.3" />
      <path d="M14.2 15 C 14.3 17.9 14.5 20.7 14.8 23.5 M17.9 14.9 C 17.8 17.8 17.6 20.6 17.3 23.4" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconLock(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M10.9 13.7 C 10.6 10.9 10.9 8.6 12.4 7.1 C 14.4 5.1 17.7 5.2 19.6 7.2 C 21 8.7 21.3 11 21.1 13.7" />
      <path d="M8.3 14.1 C 13.4 13.8 18.6 13.8 23.7 14.1 C 24 18.2 24 22.3 23.7 26.4 C 18.6 26.7 13.4 26.7 8.3 26.4 C 8 22.3 8 18.2 8.3 14.1" />
      <circle cx="16" cy="20.2" r="1.5" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

/* ── Category icons ────────────────────────────────────────────────── */

export function IconPaw(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 15.4 C 12.5 15.5 9.9 17.7 9.7 20.8 C 9.5 23.9 12.1 26.2 16 26.3 C 19.9 26.4 22.5 24 22.3 20.9 C 22.1 17.8 19.5 15.5 16.2 15.4" />
      <path d="M8.4 8.8 C 7 9.1 6.2 10.3 6.5 11.7 C 6.8 13 8 13.8 9.3 13.5 C 10.6 13.2 11.4 12 11.1 10.7 C 10.8 9.4 9.6 8.6 8.5 8.8" />
      <path d="M15.9 6.4 C 14.5 6.7 13.7 7.9 14 9.3 C 14.3 10.6 15.5 11.4 16.8 11.1 C 18.1 10.8 18.9 9.6 18.6 8.3 C 18.3 7 17.1 6.2 16 6.4" />
      <path d="M23.5 8.8 C 22.1 9.1 21.3 10.3 21.6 11.7 C 21.9 13 23.1 13.8 24.4 13.5 C 25.7 13.2 26.5 12 26.2 10.7 C 25.9 9.4 24.7 8.6 23.6 8.8" />
    </Doodle>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M6.2 25.9 C 6.4 15.3 13.9 7.5 25.9 6.1 C 24.9 17.6 17.4 25.5 6.5 26" />
      <path d="M8.8 23.3 C 12.6 17.4 17.6 12.4 23.4 8.6" strokeWidth={1.8} />
      <path d="M13.3 17.6 C 14.8 18.2 16.4 18.4 18 18.2 M17.2 13.2 C 18.6 13.8 20.1 14 21.6 13.8" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconBowl(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.4 15.7 C 5.7 22 9.9 26.3 16 26.4 C 22.1 26.3 26.4 21.9 26.6 15.5 C 19.5 16.1 12.4 16.1 5.4 15.7" />
      <path d="M11.2 11.8 C 10.4 10.4 11.8 9.2 11 7.6 M16.1 12.2 C 15.2 10.4 16.9 9 16 6.8 M21 11.8 C 20.2 10.4 21.6 9.2 20.8 7.6" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconTeacup(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M6.8 14.2 C 7 19.5 9.9 23.2 14.9 23.3 C 19.8 23.4 22.8 19.7 23.1 14.4 C 17.7 14.9 12.2 14.8 6.8 14.2" />
      <path d="M23.1 15.4 C 25.7 15 27.3 16.3 27 18.2 C 26.7 20 24.8 21 22.7 20.6" />
      <path d="M5.8 26.7 C 12 25.9 18.2 25.9 24.4 26.5" />
      <path d="M14.7 10.6 C 14 9.1 15.2 7.9 14.5 6.3" />
    </Doodle>
  );
}

export function IconHealthCross(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M13.1 5.6 C 15 5.4 16.9 5.4 18.8 5.6 C 18.7 8 18.7 10.3 18.9 12.7 C 21.3 12.9 23.6 12.9 26 12.8 C 26.2 14.7 26.2 16.6 26 18.5 C 23.6 18.4 21.3 18.4 18.9 18.6 C 18.7 21 18.7 23.3 18.8 25.7 C 16.9 25.9 15 25.9 13.1 25.7 C 13.2 23.3 13.2 21 13 18.6 C 10.6 18.4 8.3 18.4 5.9 18.5 C 5.7 16.6 5.7 14.7 5.9 12.8 C 8.3 12.9 10.6 12.9 13 12.7 C 13.2 10.3 13.2 8 13.1 5.6" />
    </Doodle>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M6.2 25.8 C 6.6 23.9 7 22 7.7 20.3 C 12 15.8 16.4 11.4 20.9 7.1 C 22.4 5.7 24.3 5.7 25.7 7.1 C 27.1 8.5 27.1 10.4 25.7 11.8 C 21.4 16.3 17 20.7 12.5 25 C 10.5 25.5 8.4 25.7 6.2 25.8" />
      <path d="M8.1 20.9 C 9.2 22 10.3 23.1 11.4 24.2" strokeWidth={1.8} />
      <path d="M19.6 8.9 C 20.9 10.1 22.1 11.3 23.3 12.6" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconPeople(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M11.2 6.9 C 9.4 7.1 8.2 8.5 8.4 10.3 C 8.6 12.1 10 13.3 11.8 13.1 C 13.5 12.9 14.7 11.5 14.5 9.8 C 14.3 8 12.9 6.8 11.3 6.9" />
      <path d="M4.9 24.9 C 5.2 19.6 7.9 16.6 11.7 16.6 C 13.6 16.6 15.2 17.3 16.4 18.6" />
      <path d="M21.8 9.4 C 20.3 9.6 19.3 10.8 19.5 12.3 C 19.7 13.8 20.9 14.8 22.4 14.6 C 23.8 14.4 24.8 13.2 24.6 11.8 C 24.4 10.3 23.2 9.3 21.9 9.4" />
      <path d="M16.9 24.9 C 17.1 20.6 19.3 18.1 22.3 18.1 C 25.3 18.1 27.5 20.7 27.7 24.8" />
    </Doodle>
  );
}

export function IconCandle(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M11.8 15.3 C 14.5 15 17.3 15 20 15.3 C 20.3 19.2 20.3 23.1 20 27 C 17.3 27.3 14.5 27.3 11.8 27 C 11.5 23.1 11.5 19.2 11.8 15.3" />
      <path d="M16 5.3 C 14.3 7.5 13.5 9.2 13.7 10.7 C 13.9 12.2 14.9 13.1 16.1 13.1 C 17.3 13.1 18.3 12.1 18.4 10.6 C 18.5 9.1 17.7 7.4 16 5.3" />
      <path d="M9 8.9 C 9.7 9.6 10.4 10.3 11.1 11 M23 8.9 C 22.3 9.6 21.6 10.3 20.9 11" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconPaintbrush(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M24.3 4.9 C 25.6 5.5 26.6 6.5 27.2 7.8 C 24 10.7 20.8 13.6 17.7 16.6 C 16.9 15.2 15.8 14.1 14.4 13.4 C 17.6 10.4 20.9 7.5 24.3 4.9" />
      <path d="M14.4 13.4 C 12 13.8 10.5 15.2 10 17.4 C 9.6 19.5 8.6 21.1 6.5 22.3 C 9.1 23.9 11.8 24.1 14.2 22.7 C 16.2 21.5 17.4 19.4 17.7 16.6" />
      <circle cx="22.6" cy="21.2" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="25.7" cy="24.6" r="1.2" fill="currentColor" stroke="none" />
    </Doodle>
  );
}

export function IconBookOpen(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M15.8 8.7 C 12.5 6.4 9 5.6 5.3 5.9 C 5 11.9 5 17.9 5.3 23.9 C 9 23.6 12.6 24.5 15.9 26.6" />
      <path d="M16.2 8.7 C 19.5 6.4 23 5.6 26.7 5.9 C 27 11.9 27 17.9 26.7 23.9 C 23 23.6 19.4 24.5 16.1 26.6" />
      <path d="M15.9 8.9 C 16.1 14.8 15.9 20.7 16.1 26.4" strokeWidth={1.8} />
      <path d="M8.3 11.4 C 9.9 11.5 11.4 11.8 12.9 12.3" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconPineTree(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 4.6 C 13.3 8.2 10.7 11.6 8 14.9 C 9.3 14.9 10.7 14.9 12 14.8 C 9.8 17.8 7.5 20.7 5.2 23.4 C 12.4 23.8 19.6 23.8 26.8 23.4 C 24.5 20.7 22.3 17.8 20.1 14.8 C 21.4 14.9 22.8 14.9 24.1 14.9 C 21.3 11.6 18.7 8.2 16.1 4.6" />
      <path d="M14.6 23.7 C 14.7 25 14.7 26.3 14.6 27.6 M17.5 23.7 C 17.4 25 17.4 26.3 17.5 27.6" />
    </Doodle>
  );
}

export function IconWheelchair(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M14.9 4.9 C 13.6 5.1 12.8 6.1 13 7.4 C 13.2 8.7 14.2 9.5 15.5 9.3 C 16.7 9.1 17.5 8.1 17.3 6.9 C 17.1 5.6 16.1 4.8 15 4.9" />
      <path d="M14.3 11.5 C 14.5 13.6 14.6 15.7 14.6 17.8 C 16.9 17.8 19.2 17.8 21.5 17.9 C 22.7 20.1 23.9 22.3 25.2 24.4" />
      <path d="M11.9 13.9 C 8.5 15.2 6.6 18.1 7 21.5 C 7.5 25.2 10.7 27.8 14.4 27.4 C 17.3 27.1 19.5 25.1 20.2 22.3" />
    </Doodle>
  );
}

export function IconHouseHeart(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M5.3 15.8 C 8.9 12.3 12.4 8.8 16 5.4 C 19.6 8.8 23.1 12.3 26.7 15.8" />
      <path d="M7.9 14 C 8.1 18.3 8.1 22.7 7.9 27 C 13.3 27.3 18.7 27.3 24.1 27 C 23.9 22.7 23.9 18.3 24.1 14" />
      <path d="M16 22.6 C 13.9 21 12.8 19.6 12.9 18.3 C 13 17.2 13.8 16.4 14.8 16.5 C 15.3 16.5 15.8 16.9 16 17.4 C 16.2 16.9 16.7 16.5 17.2 16.5 C 18.2 16.4 19 17.3 19 18.4 C 19 19.7 18 21 16.1 22.6" strokeWidth={2} />
    </Doodle>
  );
}

export function IconKite(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 4.4 C 18.9 7.2 21.6 10.3 24 13.7 C 21.6 16.3 18.9 18.4 15.9 20 C 13 18.3 10.3 16.2 8 13.6 C 10.4 10.2 13 7.1 16 4.4" />
      <path d="M16 4.6 C 15.9 9.7 15.9 14.8 16 19.8 M8.2 13.6 C 13.4 13.8 18.6 13.8 23.8 13.7" strokeWidth={1.8} />
      <path d="M15.9 20.1 C 15 21.6 15.6 22.9 14.6 24.3 C 13.9 25.3 13.8 26.4 14.3 27.6" />
      <path d="M13 23.6 C 13.9 23.9 14.7 24.3 15.5 24.8" strokeWidth={1.8} />
    </Doodle>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Doodle {...props}>
      <path d="M16 5.5 C 17 8 17.9 10.4 18.9 12.8 C 21.4 13.1 24 13.4 26.5 13.8 C 24.6 15.7 22.7 17.4 20.7 18.3 C 21.3 21 21.8 23.7 22.4 26.5 C 20.3 25 18.2 23.4 16 21.7 C 13.8 23.4 11.7 25 9.6 26.5 C 10.2 23.7 10.7 21 11.3 18.3 C 9.3 17.4 7.4 15.7 5.5 13.8 C 8 13.4 10.5 13.1 13.1 12.8 C 14 10.4 15 8 16 5.5" />
    </Doodle>
  );
}
