'use client';

import React, { useState } from 'react';
import DynamicMap from '@/components/shared/DynamicMap';
import { Filter } from 'lucide-react';
import { getMarkerColor } from '@/lib/utils';
import StatusChip from '@/components/shared/StatusChip';
import Link from 'next/link';

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false);

  // Mock markers
  const markers = [
    {
      id: 'CL-001',
      lat: 19.076,
      lng: 72.8777,
      color: '#eab308', // pending
      popup: (
        <div className="p-1 min-w-[150px]">
          <h4 className="font-bold text-sm mb-1">Large Pothole</h4>
          <StatusChip status="pending" size="sm" />
          <Link href="/incident/CL-001" className="block mt-2 text-xs text-blue-600 hover:underline">View Details</Link>
        </div>
      )
    },
    {
      id: 'CL-002',
      lat: 19.080,
      lng: 72.880,
      color: '#3b82f6', // in_progress
      popup: (
        <div className="p-1 min-w-[150px]">
          <h4 className="font-bold text-sm mb-1">Water Leak</h4>
          <StatusChip status="in_progress" size="sm" />
          <Link href="/incident/CL-002" className="block mt-2 text-xs text-blue-600 hover:underline">View Details</Link>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] relative">
      <div className="absolute top-4 right-4 z-10">
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

      <div className="flex-1 bg-gray-100">
        <DynamicMap center={[19.076, 72.8777]} zoom={13} markers={markers} />
      </div>
    </div>
  );
}
