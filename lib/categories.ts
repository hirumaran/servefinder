/**
 * Display metadata for each opportunity category: human label, icon, badge
 * styling, and map-pin color.
 *
 * Badge classes are written out in full (not composed at runtime) so the
 * Tailwind compiler can see them. All pairs were chosen for ≥4.5:1 contrast.
 */

import type { ComponentType } from "react";

import {
  IconBookOpen,
  IconBowl,
  IconCandle,
  IconHealthCross,
  IconHouseHeart,
  IconKite,
  IconLeaf,
  IconPaintbrush,
  IconPaw,
  IconPencil,
  IconPeople,
  IconPineTree,
  IconStar,
  IconTeacup,
  IconWheelchair,
  type IconProps,
} from "@/components/icons";

import type { Category } from "./types";

export interface CategoryMeta {
  /** Human-readable label ("FoodAndHunger" → "Food & Hunger"). */
  label: string;
  icon: ComponentType<IconProps>;
  /** Full Tailwind classes for the category badge chip. */
  badgeClass: string;
  /** Hex color used for this category's map pin. */
  pinColor: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Animals: {
    label: "Animals",
    icon: IconPaw,
    badgeClass: "bg-amber-100 text-amber-900",
    pinColor: "#b45309",
  },
  Environment: {
    label: "Environment",
    icon: IconLeaf,
    badgeClass: "bg-green-100 text-green-900",
    pinColor: "#15803d",
  },
  FoodAndHunger: {
    label: "Food & Hunger",
    icon: IconBowl,
    badgeClass: "bg-orange-100 text-orange-900",
    pinColor: "#c2410c",
  },
  Seniors: {
    label: "Seniors",
    icon: IconTeacup,
    badgeClass: "bg-purple-100 text-purple-900",
    pinColor: "#7e22ce",
  },
  HealthAndHospitals: {
    label: "Health & Hospitals",
    icon: IconHealthCross,
    badgeClass: "bg-red-100 text-red-900",
    pinColor: "#b91c1c",
  },
  EducationAndTutoring: {
    label: "Education & Tutoring",
    icon: IconPencil,
    badgeClass: "bg-blue-100 text-blue-900",
    pinColor: "#1d4ed8",
  },
  Community: {
    label: "Community",
    icon: IconPeople,
    badgeClass: "bg-teal-100 text-teal-900",
    pinColor: "#0f766e",
  },
  FaithBased: {
    label: "Faith-based",
    icon: IconCandle,
    badgeClass: "bg-violet-100 text-violet-900",
    pinColor: "#6d28d9",
  },
  ArtsAndMuseums: {
    label: "Arts & Museums",
    icon: IconPaintbrush,
    badgeClass: "bg-pink-100 text-pink-900",
    pinColor: "#be185d",
  },
  Library: {
    label: "Library",
    icon: IconBookOpen,
    badgeClass: "bg-indigo-100 text-indigo-900",
    pinColor: "#4338ca",
  },
  ParksAndOutdoors: {
    label: "Parks & Outdoors",
    icon: IconPineTree,
    badgeClass: "bg-emerald-100 text-emerald-900",
    pinColor: "#047857",
  },
  DisabilityServices: {
    label: "Disability Services",
    icon: IconWheelchair,
    badgeClass: "bg-cyan-100 text-cyan-950",
    pinColor: "#0e7490",
  },
  Homelessness: {
    label: "Homelessness",
    icon: IconHouseHeart,
    badgeClass: "bg-rose-100 text-rose-900",
    pinColor: "#be123c",
  },
  Youth: {
    label: "Youth",
    icon: IconKite,
    badgeClass: "bg-fuchsia-100 text-fuchsia-900",
    pinColor: "#a21caf",
  },
  Other: {
    label: "Other",
    icon: IconStar,
    badgeClass: "bg-slate-200 text-slate-900",
    pinColor: "#475569",
  },
};
