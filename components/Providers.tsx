"use client";

import { ExperiencesProvider } from "@/lib/experiences-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { LocationProvider } from "@/lib/location-context";

/** Client-side state shared across pages: location, saved listings, journal. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <FavoritesProvider>
        <ExperiencesProvider>{children}</ExperiencesProvider>
      </FavoritesProvider>
    </LocationProvider>
  );
}
