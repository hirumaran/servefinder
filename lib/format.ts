/** Small display formatters shared by server and client components. */

/** Human age label: "Ages 16+" or "No age minimum". */
export function ageLabel(minAge: number | undefined): string {
  return minAge === undefined ? "No age minimum" : `Ages ${minAge}+`;
}

/** True for a well-formed absolute http(s) URL ("https://example.org/…"). */
export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Hostname of a website URL, or null if it isn't a valid http(s) URL. */
export function websiteHostname(value: string | undefined): string | null {
  if (!value || !isValidHttpUrl(value)) return null;
  return new URL(value).hostname;
}

/** "2026-06-14" → "June 14, 2026". The T00:00:00 pins it to local time. */
export function formatShiftDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "3.5 hrs" / "1 hr" chip label. */
export function hoursLabel(hours: number): string {
  return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
}
