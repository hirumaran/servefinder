import Link from "next/link";

import { SquiggleDivider } from "@/components/doodles";
import { IconShieldHeart, IconSprout } from "@/components/icons";
import { ReplayIntroLink } from "@/components/onboarding/ReplayIntroLink";

/** Site-wide footer with the safety/accuracy disclaimers required everywhere. */
export function Footer() {
  return (
    <footer className="print-hide border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-2">
            <p className="flex items-center gap-1.5 font-display text-lg font-extrabold text-slate-900">
              <IconSprout aria-hidden="true" className="size-5 text-emerald-700" />
              Serv<span className="text-emerald-700">d</span>
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              A free directory that helps high school students find volunteer
              opportunities and earn their 40 required service hours. We help you{" "}
              <strong>find</strong> places — you contact them yourself, and the
              causes you pick stay right here on your device.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="font-medium text-slate-600 hover:text-emerald-800">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className="font-medium text-slate-600 hover:text-emerald-800"
                >
                  Find opportunities
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium text-slate-600 hover:text-emerald-800">
                  How it works &amp; safety
                </Link>
              </li>
              <li>
                <ReplayIntroLink />
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-stone-100 p-4 text-sm text-slate-600">
          <IconShieldHeart aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-700" />
          <p>
            Details can change. Always confirm hours, age rules, and whether the
            organization signs service-hour forms <em>before</em> you show up — and
            loop in a parent or guardian when you reach out. This site never asks for
            an account and never stores your location; the causes you pick live in
            your browser, not on our servers.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <SquiggleDivider className="h-2 w-14 text-emerald-300" />
          <p>Made for students who&apos;d rather be out helping.</p>
        </div>
      </div>
    </footer>
  );
}
