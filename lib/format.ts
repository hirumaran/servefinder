/** Small display formatters shared by server and client components. */

/** Human age label: "Ages 16+" or "No age minimum". */
export function ageLabel(minAge: number | undefined): string {
  return minAge === undefined ? "No age minimum" : `Ages ${minAge}+`;
}
