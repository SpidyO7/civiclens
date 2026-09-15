'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Filter, X } from 'lucide-react';
import type { Incident } from '@/types';

// Dynamically import the map component with ssr: false
const DynamicMap = dynamic(() => import('@/components/shared/DynamicMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-civic-100 flex items-center justify-center text-civic-500 animate-pulse">Loading map...</div>
});

export default function LiveMapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [incidents] = useState<Incident[]>([]);

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
                  {['Reported', 'Pending', 'In Progress', 'Resolved', 'Overdue'].map(status => (
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
          <DynamicMap 
            incidents={incidents} 
            center={[28.6139, 77.2090]} // Default to a central location (e.g. New Delhi)
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
