"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconSprout } from "@/components/icons";

const NAV_LINKS = [
  { href: "/opportunities", label: "Find opportunities" },
  { href: "/journal", label: "My journal" },
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
          className="group flex items-center gap-2 rounded-lg"
          aria-label="Pitch In home"
        >
          {/* The sprout gives a happy little wiggle when you hover the logo. */}
          <IconSprout className="size-8 text-emerald-700 transition-transform duration-300 ease-pop group-hover:-rotate-6 group-hover:scale-110" />
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
            Pitch&nbsp;<span className="text-emerald-700">In</span>
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
                  className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-all duration-150 active:scale-95 sm:px-4 ${
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
