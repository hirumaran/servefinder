"use client";

import { Navigation } from "lucide-react";

import { formatMiles, haversineMiles } from "@/lib/distance";
import { useUserLocation } from "@/lib/location-context";
import type { Opportunity } from "@/lib/types";

/** "About 2.3 mi from your location" — rendered only when a location is set. */
export function DistanceNote({ opportunity }: { opportunity: Opportunity }) {
  const { location } = useUserLocation();
  if (!location) return null;

  const miles = haversineMiles(location.coords, {
    lat: opportunity.lat,
    lng: opportunity.lng,
  });

  return (
    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
      <Navigation aria-hidden="true" className="size-3.5" />
      about {formatMiles(miles)} from{" "}
      {location.source === "zip" ? `ZIP ${location.zip}` : "your location"}
    </span>
  );
}
