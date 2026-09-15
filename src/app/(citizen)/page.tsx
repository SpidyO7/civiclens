'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, Clock, ThumbsUp } from 'lucide-react';
import StatusChip from '@/components/shared/StatusChip';
import SeverityChip from '@/components/shared/SeverityChip';

export default function CitizenHomePage() {
  // Mock data for UI presentation
  const recentIncidents = [
    { id: 'CL-001', category: 'road', title: 'Large Pothole on Main St', address: '123 Main St, Mumbai', severity: 'high', status: 'pending', timeAgo: '2h ago', supportCount: 12 },
    { id: 'CL-002', category: 'waste', title: 'Garbage Dump Overflow', address: '45 MG Road, Mumbai', severity: 'medium', status: 'in_progress', timeAgo: '5h ago', supportCount: 5 },
  ];

  const resolvedIncidents = [
    { id: 'CL-003', category: 'water', title: 'Pipe Leakage Fixed', address: 'Linking Road, Mumbai', severity: 'medium', status: 'resolved', timeAgo: '1d ago', supportCount: 22 },
  ];

  return (
    <div className="flex flex-col space-y-6 p-4 max-w-lg mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-6 text-white shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-2">See a problem? Report it.</h1>
        <p className="text-blue-100 text-sm mb-6">
          CivicLens turns real-world civic problems into verified, trackable incidents.
        </p>
        <Link 
          href="/report" 
          className="bg-white text-blue-900 font-bold py-3 px-6 rounded-full inline-flex items-center gap-2 shadow-md hover:bg-blue-50 transition-colors"
        >
          <Camera size={20} />
          REPORT ISSUE
        </Link>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { label: 'Active Issues', value: '142' },
          { label: 'Resolved Today', value: '28' },
          { label: 'Avg Response', value: '4.2h' },
          { label: 'Your Reports', value: '3' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <span className="text-gray-500 text-xs">{stat.label}</span>
            <span className="text-lg font-bold text-gray-900">{stat.value}</span>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center justify-between">
          <span>Nearby Issues</span>
          <Link href="/map" className="text-sm font-normal text-blue-600">View Map</Link>
        </h2>
        <div className="space-y-3">
          {recentIncidents.map(incident => (
            <Link key={incident.id} href={`/incident/${incident.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{incident.title}</h3>
                <StatusChip status={incident.status} size="sm" />
              </div>
              <div className="flex items-center text-xs text-gray-500 mb-3 gap-1">
                <MapPin size={12} />
                <span className="truncate">{incident.address}</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <SeverityChip severity={incident.severity} size="sm" />
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12}/>{incident.timeAgo}</span>
                  <span className="flex items-center gap-1"><ThumbsUp size={12}/>{incident.supportCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Resolved */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Recently Resolved</h2>
        <div className="space-y-3">
          {resolvedIncidents.map(incident => (
             <Link key={incident.id} href={`/incident/${incident.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors opacity-90">
             <div className="flex justify-between items-start mb-2">
               <h3 className="font-semibold text-gray-900 line-clamp-1">{incident.title}</h3>
               <StatusChip status={incident.status} size="sm" />
             </div>
             <div className="flex items-center text-xs text-gray-500 gap-1">
               <MapPin size={12} />
               <span className="truncate">{incident.address}</span>
             </div>
           </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
