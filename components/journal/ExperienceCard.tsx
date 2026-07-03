"use client";

import Link from "next/link";
import { useState } from "react";

import { IconPencil, IconTrash } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_META } from "@/lib/categories";
import type { Experience } from "@/lib/experiences";
import { formatShiftDate, hoursLabel } from "@/lib/format";

interface ExperienceCardProps {
  experience: Experience;
  /** True when the linked listing still exists, so the name can deep-link. */
  opportunityExists: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** One journal entry, with edit and a two-step (no-modal) delete. */
export function ExperienceCard({
  experience,
  opportunityExists,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const meta = CATEGORY_META[experience.category];

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base leading-snug font-bold text-slate-900">
            {opportunityExists && experience.opportunityId ? (
              <Link
                href={`/opportunities/${experience.opportunityId}`}
                className="hover:text-emerald-800"
              >
                {experience.orgName}
              </Link>
            ) : (
              experience.orgName
            )}
          </h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
            <Badge colorClass={meta.badgeClass} icon={meta.icon}>
              {meta.label}
            </Badge>
            <time dateTime={experience.date}>{formatShiftDate(experience.date)}</time>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-amber-900">
          {hoursLabel(experience.hours)}
        </span>
      </div>

      {experience.notes && (
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-slate-600">
          {experience.notes}
        </p>
      )}

      <div className="print-hide mt-3 flex items-center justify-end gap-1.5 text-xs">
        {confirmingDelete ? (
          <>
            <span className="font-semibold text-slate-700">Delete this entry?</span>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-lg bg-rose-600 px-3 font-bold text-white hover:bg-rose-700"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-stone-300 bg-white px-3 font-semibold text-slate-700 hover:border-emerald-600"
            >
              Keep it
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`Edit your ${formatShiftDate(experience.date)} entry for ${experience.orgName}`}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-lg px-2.5 font-semibold text-slate-500 hover:bg-stone-100 hover:text-emerald-800"
            >
              <IconPencil aria-hidden="true" className="size-3.5" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Delete your ${formatShiftDate(experience.date)} entry for ${experience.orgName}`}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-lg px-2.5 font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            >
              <IconTrash aria-hidden="true" className="size-3.5" />
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
