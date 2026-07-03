"use client";

import { FavoritesProvider } from "@/lib/favorites-context";
import { LocationProvider } from "@/lib/location-context";

/** Client-side state shared across pages: optional location + saved listings. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </LocationProvider>
  );
}
