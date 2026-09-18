'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DynamicMap from '@/components/shared/DynamicMap';
import { Crosshair, Filter, Loader2 } from 'lucide-react';
import { getCategoryLabel, getMarkerColor } from '@/lib/utils';
import StatusChip from '@/components/shared/StatusChip';
import Link from 'next/link';
import type { Incident } from '@/types';

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/incidents')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load civic issues');
        return response.json() as Promise<Incident[]>;
      })
      .then(setIncidents)
      .catch(error => setError(error instanceof Error ? error.message : 'Unable to load civic issues'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      position => setUserLocation([position.coords.latitude, position.coords.longitude]),
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (userLocation) return userLocation;
    if (incidents.length > 0) {
      const totals = incidents.reduce(
        (acc, incident) => ({ lat: acc.lat + incident.latitude, lng: acc.lng + incident.longitude }),
        { lat: 0, lng: 0 }
      );
      return [totals.lat / incidents.length, totals.lng / incidents.length];
    }
    return [19.076, 72.8777];
  }, [incidents, userLocation]);

  const markers = [
    ...incidents.map(incident => ({
      id: incident.id,
      lat: incident.latitude,
      lng: incident.longitude,
      color: getMarkerColor(incident.status),
      popup: (
        <div className="p-1 min-w-[150px]">
          <h4 className="font-bold text-sm mb-1">{incident.description}</h4>
          <p className="text-xs text-gray-500 mb-1">{getCategoryLabel(incident.category)}</p>
          <StatusChip status={incident.status} size="sm" />
          <Link href={`/incident/${incident.incidentId}`} className="block mt-2 text-xs text-blue-600 hover:underline">View Details</Link>
        </div>
      ),
    })),
    ...(userLocation
      ? [{
          id: 'current-location',
          lat: userLocation[0],
          lng: userLocation[1],
          color: '#2563eb',
          popup: <div className="text-sm font-medium">Your current location</div>,
        }]
      : []),
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => userLocation && setUserLocation([...userLocation])}
          disabled={!userLocation}
          className="bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          title={userLocation ? 'Center on current location' : 'Current location unavailable'}
        >
          <Crosshair size={20} />
        </button>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <Filter size={20} />
        </button>
      </div>
      
      {showFilters && (
        <div className="absolute top-16 right-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-48">
          <h3 className="font-semibold text-sm mb-2">Filter Issues</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Active</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Resolved</label>
            <hr />
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Roads</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Water</label>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 border border-gray-200 rounded-lg px-3 py-2 shadow-sm text-sm text-gray-600 flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading issues
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 shadow-sm text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 bg-gray-100">
        <DynamicMap center={center} zoom={13} markers={markers} />
      </div>
    </div>
  );
}
