"use client";

/**
 * The user's (optional) location, held in React state only.
 *
 * Privacy is the whole point of this design: coordinates never touch a server,
 * cookie, or localStorage. A ZIP the user typed also goes into the URL (it's
 * coarse and makes results shareable), but precise browser-geolocation
 * coordinates live exclusively in this in-memory context and vanish on reload.
 */

import { createContext, useContext, useMemo, useState } from "react";

import type { LatLng } from "./distance";

export interface UserLocation {
  coords: LatLng;
  /** Where the location came from — changes the label we show. */
  source: "zip" | "geolocation";
  /** The ZIP the user typed (source === "zip" only). */
  zip?: string;
}

interface LocationContextValue {
  location: UserLocation | null;
  setLocation: (location: UserLocation | null) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const value = useMemo(() => ({ location, setLocation }), [location]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useUserLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useUserLocation must be used inside <LocationProvider>");
  return ctx;
}
