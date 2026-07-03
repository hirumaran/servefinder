"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { CATEGORY_META } from "@/lib/categories";
import { formatMiles, type LatLng } from "@/lib/distance";
import type { ScoredOpportunity } from "@/lib/filters";

import "leaflet/dist/leaflet.css";

/**
 * Map view of the current results, on free OpenStreetMap tiles (no API key).
 * This module is only ever loaded client-side via next/dynamic — Leaflet
 * touches `window` at import time.
 */

/** Colored SVG teardrop pin, sized up slightly when selected. */
function pinIcon(color: string, selected: boolean): L.DivIcon {
  const w = selected ? 38 : 30;
  const h = selected ? 53 : 42;
  return L.divIcon({
    className: "", // no default leaflet styles
    html: `
      <svg width="${w}" height="${h}" viewBox="0 0 30 42" role="presentation" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
        <circle cx="15" cy="15" r="5.5" fill="white"/>
      </svg>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 6],
  });
}

/** Small pulsing dot marking the user's own (optional) location. */
const userDotIcon = L.divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 2px rgb(37 99 235 / 0.4)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/** Re-fits the viewport whenever the visible result set changes. */
function FitToResults({ points }: { points: LatLng[] }) {
  const map = useMap();
  // A stable string key avoids refitting on unrelated re-renders.
  const key = points.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join("|");

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key encodes points
  }, [key, map]);

  return null;
}

interface ResultsMapProps {
  results: ScoredOpportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: LatLng | null;
  /** Where to look when there are no results/location yet (dataset center). */
  fallbackCenter: LatLng;
}

export function ResultsMap({
  results,
  selectedId,
  onSelect,
  userLocation,
  fallbackCenter,
}: ResultsMapProps) {
  const fitPoints: LatLng[] = [
    ...results.map(({ opportunity }) => ({ lat: opportunity.lat, lng: opportunity.lng })),
    ...(userLocation ? [userLocation] : []),
  ];

  return (
    <MapContainer
      center={[fallbackCenter.lat, fallbackCenter.lng]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToResults points={fitPoints} />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userDotIcon}
          alt="Your location"
          keyboard={false}
        >
          <Popup>Your location</Popup>
        </Marker>
      )}

      {results.map(({ opportunity: o, distanceMi }) => {
        const meta = CATEGORY_META[o.category];
        return (
          <Marker
            key={o.id}
            position={[o.lat, o.lng]}
            icon={pinIcon(meta.pinColor, selectedId === o.id)}
            alt={o.name}
            eventHandlers={{ click: () => onSelect(o.id) }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-display text-sm leading-snug font-bold text-slate-900">{o.name}</p>
                <p className="text-xs text-slate-600">
                  {meta.label}
                  {distanceMi !== null && ` · ${formatMiles(distanceMi)} away`}
                </p>
                <Link
                  href={`/opportunities/${o.id}`}
                  className="text-xs font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
