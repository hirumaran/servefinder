import { IconSparkle } from "@/components/icons";
import { HOURS_GOAL } from "@/lib/experiences";

interface HoursProgressProps {
  totalHours: number;
  shiftCount: number;
  placeCount: number;
}

/** The 40-hour tally: big number, hand-friendly progress bar, quick stats. */
export function HoursProgress({ totalHours, shiftCount, placeCount }: HoursProgressProps) {
  const done = totalHours >= HOURS_GOAL;
  const percent = Math.min(100, (totalHours / HOURS_GOAL) * 100);

  return (
    <section
      aria-labelledby="progress-heading"
      className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 id="progress-heading" className="font-display text-slate-900">
          <span className="block text-sm font-bold tracking-wide text-slate-500 uppercase">
            Your hours
          </span>
          <span className="text-4xl font-extrabold text-emerald-700">{totalHours}</span>
          <span className="text-lg font-bold text-slate-400"> / {HOURS_GOAL}</span>
        </h2>
        <p className="text-sm font-semibold text-slate-600">
          {shiftCount} {shiftCount === 1 ? "shift" : "shifts"} ·{" "}
          {placeCount} {placeCount === 1 ? "place" : "places"}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={HOURS_GOAL}
        aria-valuenow={Math.min(totalHours, HOURS_GOAL)}
        aria-label={`${totalHours} of ${HOURS_GOAL} service hours logged`}
        className="relative mt-3 h-4 rounded-full bg-stone-200"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-[width] duration-700 ease-settle"
          style={{ width: `${percent}%` }}
        />
        {/* Little milestone notches at 10, 20, 30 hours. */}
        {[25, 50, 75].map((tick) => (
          <span
            key={tick}
            aria-hidden="true"
            className="absolute top-1 bottom-1 w-0.5 rounded-full bg-white/70"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
        {done ? (
          <>
            <IconSparkle aria-hidden="true" className="size-4 shrink-0 text-amber-500" />
            <strong className="text-emerald-800">Goal reached!</strong> {totalHours} hours and
            counting — your counselor is going to love this.
          </>
        ) : totalHours > 0 ? (
          <>
            {Math.round((HOURS_GOAL - totalHours) * 10) / 10} hours to go — you&apos;ve got this.
          </>
        ) : (
          <>Log your first shift and the bar starts moving.</>
        )}
      </p>
    </section>
  );
}
