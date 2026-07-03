"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/lib/favorites-context";

interface FavoriteButtonProps {
  opportunityId: string;
  opportunityName: string;
}

/**
 * Heart toggle that saves a listing for the current visit only (in-memory —
 * nothing is stored, in keeping with the no-data-about-students rule).
 */
export function FavoriteButton({ opportunityId, opportunityName }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(opportunityId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${opportunityName} from saved (saved for this visit only)`
          : `Save ${opportunityName} for this visit`
      }
      title={active ? "Remove from saved" : "Save for this visit"}
      onClick={() => toggleFavorite(opportunityId)}
      className={`inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-stone-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-500"
      }`}
    >
      <Heart aria-hidden="true" className="size-5" fill={active ? "currentColor" : "none"} />
    </button>
  );
}
