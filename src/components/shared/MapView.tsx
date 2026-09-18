'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet with Next.js
const iconRetinaUrl = '/leaflet/marker-icon-2x.png';
const iconUrl = '/leaflet/marker-icon.png';
const shadowUrl = '/leaflet/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color: string;
  popup?: React.ReactNode;
}

interface MapViewProps {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  className?: string;
  onClick?: (e: L.LeafletMouseEvent) => void;
}

function MapEvents({ onClick }: { onClick?: (e: L.LeafletMouseEvent) => void }) {
  const map = useMap();
  useEffect(() => {
    if (onClick) {
      map.on('click', onClick);
      return () => {
        map.off('click', onClick);
      };
    }
  }, [map, onClick]);
  return null;
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
    map.invalidateSize();
  }, [center, map, zoom]);

  return null;
}

export default function MapView({ center, zoom, markers = [], className, onClick }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("w-full h-full relative z-0", className)}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} zoom={zoom} />
        <MapEvents onClick={onClick} />
        
        {markers.map((marker) => {
          const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${marker.color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          return (
            <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={customIcon}>
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
