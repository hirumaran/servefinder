import type { LucideIcon } from "lucide-react";

interface BadgeProps {
  children: React.ReactNode;
  /** Full Tailwind classes for colors, e.g. "bg-emerald-100 text-emerald-900". */
  colorClass?: string;
  icon?: LucideIcon;
  /** Extra context for screen readers when the visible text is terse. */
  srLabel?: string;
}

/** Small rounded chip used for categories, age rules, and listing traits. */
export function Badge({
  children,
  colorClass = "bg-stone-200 text-slate-800",
  icon: Icon,
  srLabel,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${colorClass}`}
    >
      {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0" />}
      {srLabel && <span className="sr-only">{srLabel} </span>}
      {children}
    </span>
  );
}
