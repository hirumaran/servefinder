"use client";

import { Sprout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/opportunities", label: "Find opportunities" },
  { href: "/about", label: "How it works" },
] as const;

/** Site-wide top navigation. Client component only for the active-link state. */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="print-hide sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg"
          aria-label="ServeFinder home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Sprout aria-hidden="true" className="size-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
            Serve<span className="text-emerald-700">Finder</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors sm:px-4 ${
                    active
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-600 hover:bg-stone-100 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
