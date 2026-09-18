'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Crosshair, Filter, Loader2, X } from 'lucide-react';
import type { Incident } from '@/types';
import { getCategoryLabel, getMarkerColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';

// Dynamically import the map component with ssr: false
const DynamicMap = dynamic(() => import('@/components/shared/DynamicMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-civic-100 flex items-center justify-center text-civic-500 animate-pulse">Loading map...</div>
});

export default function LiveMapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/incidents')
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load incidents');
        return response.json() as Promise<Incident[]>;
      })
      .then(setIncidents)
      .catch(error => setError(error instanceof Error ? error.message : 'Unable to load incidents'))
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
        <div className="p-1 min-w-[170px]">
          <h4 className="font-bold text-sm mb-1">{incident.description}</h4>
          <p className="text-xs text-civic-500 mb-1">{getCategoryLabel(incident.category)}</p>
          <p className="text-xs text-civic-600">{getStatusLabel(incident.status)}</p>
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
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-civic-900">Live Map</h1>
          <p className="text-civic-500 text-sm">Geospatial view of all active incidents</p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white border border-civic-200 px-4 py-2 rounded-lg shadow-sm hover:bg-civic-50"
        >
          <Filter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex-1 relative rounded-xl overflow-hidden border border-civic-200 shadow-sm flex">
        {/* Filters Panel */}
        {showFilters && (
          <div className="w-72 bg-white border-r border-civic-200 p-4 overflow-y-auto flex-shrink-0 z-10 absolute sm:relative h-full shadow-lg sm:shadow-none">
            <div className="flex justify-between items-center mb-4 sm:hidden">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-civic-700 mb-1">Status</label>
                <div className="space-y-2">
                  {['Reported', 'Authority Notified', 'In Progress', 'Awaiting Verification', 'Verified Resolved'].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-civic-300" defaultChecked />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-civic-700 mb-1">Severity</label>
                <div className="space-y-2">
                  {['Low', 'Medium', 'High', 'Critical'].map(sev => (
                    <label key={sev} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-civic-300" defaultChecked />
                      {sev}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-civic-700 mb-1">Category</label>
                <select className="w-full border border-civic-300 rounded p-2 text-sm">
                  <option>All Categories</option>
                  <option>Road</option>
                  <option>Water</option>
                  <option>Waste</option>
                </select>
              </div>

              <div className="pt-4 border-t border-civic-200 flex gap-2">
                <button className="flex-1 bg-civic-900 text-white py-2 rounded-lg text-sm font-medium">Apply</button>
                <button className="flex-1 bg-civic-100 text-civic-700 py-2 rounded-lg text-sm font-medium">Reset</button>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 h-full relative z-0">
          {loading && (
            <div className="absolute inset-x-4 top-4 z-[401] bg-white/95 border border-civic-200 rounded-lg px-3 py-2 shadow-sm text-sm text-civic-600 flex items-center gap-2 w-fit">
              <Loader2 size={16} className="animate-spin" /> Loading live incidents
            </div>
          )}
          {error && (
            <div className="absolute inset-x-4 top-4 z-[401] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 shadow-sm text-sm w-fit">
              {error}
            </div>
          )}
          <button
            onClick={() => userLocation && setUserLocation([...userLocation])}
            disabled={!userLocation}
            className="absolute top-4 right-4 z-[401] bg-white border border-civic-200 p-2 rounded-lg shadow-sm text-civic-700 hover:bg-civic-50 disabled:opacity-50"
            title={userLocation ? 'Center on current location' : 'Current location unavailable'}
          >
            <Crosshair size={18} />
          </button>
          <DynamicMap 
            markers={markers}
            center={center}
            zoom={12}
            className="w-full h-full"
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border border-civic-200 z-[400]">
            <h4 className="text-xs font-semibold text-civic-900 mb-2 uppercase tracking-wider">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Critical/Overdue
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div> Pending
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div> In Progress
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Resolved
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
