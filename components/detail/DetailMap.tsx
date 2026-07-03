"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { CATEGORY_META } from "@/lib/categories";
import type { Opportunity } from "@/lib/types";

import "leaflet/dist/leaflet.css";

/** Single-pin map for the detail page. Loaded client-side via next/dynamic. */
export function DetailMap({ opportunity }: { opportunity: Opportunity }) {
  const meta = CATEGORY_META[opportunity.category];

  const icon = L.divIcon({
    className: "",
    html: `
      <svg width="34" height="48" viewBox="0 0 30 42" role="presentation" style="filter: drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))">
        <path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 27 15 27s15-15.8 15-27C30 6.7 23.3 0 15 0z" fill="${meta.pinColor}" stroke="white" stroke-width="1.5"/>
        <circle cx="15" cy="15" r="5.5" fill="white"/>
      </svg>`,
    iconSize: [34, 48],
    iconAnchor: [17, 48],
    popupAnchor: [0, -42],
  });

  return (
    <MapContainer
      center={[opportunity.lat, opportunity.lng]}
      zoom={15}
      // Scroll-wheel zoom off so the map doesn't trap page scrolling.
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* divIcon markers ignore `alt`; `title` gives an accessible name. */}
      <Marker position={[opportunity.lat, opportunity.lng]} icon={icon} title={opportunity.name}>
        <Popup>
          <span className="text-sm font-bold">{opportunity.name}</span>
          <br />
          <span className="text-xs">
            {opportunity.address.street}, {opportunity.address.city}
          </span>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
