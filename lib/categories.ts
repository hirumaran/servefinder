/**
 * Display metadata for each opportunity category: human label, icon, badge
 * styling, and map-pin color.
 *
 * Badge classes are written out in full (not composed at runtime) so the
 * Tailwind compiler can see them. All pairs were chosen for ≥4.5:1 contrast.
 */

import {
  Accessibility,
  BookOpen,
  Church,
  GraduationCap,
  HeartHandshake,
  Home,
  Leaf,
  Palette,
  PawPrint,
  Sparkles,
  Stethoscope,
  Tag,
  TreePine,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import type { Category } from "./types";

export interface CategoryMeta {
  /** Human-readable label ("FoodAndHunger" → "Food & Hunger"). */
  label: string;
  icon: LucideIcon;
  /** Full Tailwind classes for the category badge chip. */
  badgeClass: string;
  /** Hex color used for this category's map pin. */
  pinColor: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Animals: {
    label: "Animals",
    icon: PawPrint,
    badgeClass: "bg-amber-100 text-amber-900",
    pinColor: "#b45309",
  },
  Environment: {
    label: "Environment",
    icon: Leaf,
    badgeClass: "bg-green-100 text-green-900",
    pinColor: "#15803d",
  },
  FoodAndHunger: {
    label: "Food & Hunger",
    icon: UtensilsCrossed,
    badgeClass: "bg-orange-100 text-orange-900",
    pinColor: "#c2410c",
  },
  Seniors: {
    label: "Seniors",
    icon: HeartHandshake,
    badgeClass: "bg-purple-100 text-purple-900",
    pinColor: "#7e22ce",
  },
  HealthAndHospitals: {
    label: "Health & Hospitals",
    icon: Stethoscope,
    badgeClass: "bg-red-100 text-red-900",
    pinColor: "#b91c1c",
  },
  EducationAndTutoring: {
    label: "Education & Tutoring",
    icon: GraduationCap,
    badgeClass: "bg-blue-100 text-blue-900",
    pinColor: "#1d4ed8",
  },
  Community: {
    label: "Community",
    icon: Users,
    badgeClass: "bg-teal-100 text-teal-900",
    pinColor: "#0f766e",
  },
  FaithBased: {
    label: "Faith-based",
    icon: Church,
    badgeClass: "bg-violet-100 text-violet-900",
    pinColor: "#6d28d9",
  },
  ArtsAndMuseums: {
    label: "Arts & Museums",
    icon: Palette,
    badgeClass: "bg-pink-100 text-pink-900",
    pinColor: "#be185d",
  },
  Library: {
    label: "Library",
    icon: BookOpen,
    badgeClass: "bg-indigo-100 text-indigo-900",
    pinColor: "#4338ca",
  },
  ParksAndOutdoors: {
    label: "Parks & Outdoors",
    icon: TreePine,
    badgeClass: "bg-emerald-100 text-emerald-900",
    pinColor: "#047857",
  },
  DisabilityServices: {
    label: "Disability Services",
    icon: Accessibility,
    badgeClass: "bg-cyan-100 text-cyan-950",
    pinColor: "#0e7490",
  },
  Homelessness: {
    label: "Homelessness",
    icon: Home,
    badgeClass: "bg-rose-100 text-rose-900",
    pinColor: "#be123c",
  },
  Youth: {
    label: "Youth",
    icon: Sparkles,
    badgeClass: "bg-fuchsia-100 text-fuchsia-900",
    pinColor: "#a21caf",
  },
  Other: {
    label: "Other",
    icon: Tag,
    badgeClass: "bg-slate-200 text-slate-900",
    pinColor: "#475569",
  },
};
