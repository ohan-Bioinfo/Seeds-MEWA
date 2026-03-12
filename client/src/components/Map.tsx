/// <reference types="@types/leaflet" />

import { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  children?: ReactNode;
}

export function MapView({
  className,
  initialCenter = [23.8859, 45.0792],
  initialZoom = 6,
  children,
}: MapViewProps) {
  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      className={cn("w-full h-[500px]", className)}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
}
