"use client";

import { FavoritesProvider } from "@/lib/favorites-context";
import { InterestsProvider } from "@/lib/interests-context";
import { LocationProvider } from "@/lib/location-context";

/** Client-side state shared across pages: location, saved listings, picked causes. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <FavoritesProvider>
        <InterestsProvider>{children}</InterestsProvider>
      </FavoritesProvider>
    </LocationProvider>
  );
}
