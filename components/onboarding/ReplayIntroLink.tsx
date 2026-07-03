"use client";

import { usePathname, useRouter } from "next/navigation";

import { useInterests } from "@/lib/interests-context";

/**
 * Footer easter-egg: watch the Monet front door again. The flow only lives
 * on the home page, so replaying from anywhere else navigates home first.
 */
export function ReplayIntroLink() {
  const { resetOnboarding } = useInterests();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        resetOnboarding();
        if (pathname !== "/") router.push("/");
        else window.scrollTo({ top: 0 });
      }}
      className="font-medium text-slate-600 hover:text-emerald-800"
    >
      Replay the intro
    </button>
  );
}
