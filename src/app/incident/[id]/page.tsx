'use client';

import React from 'react';
import { MapPin, Calendar, Users, Building, ShieldAlert, ThumbsUp } from 'lucide-react';
import StatusChip from '@/components/shared/StatusChip';
import SeverityChip from '@/components/shared/SeverityChip';
import SlaCountdown from '@/components/shared/SlaCountdown';
import Timeline from '@/components/shared/Timeline';
import DynamicMap from '@/components/shared/DynamicMap';

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  // Mock data
  const incident = {
    id: params.id,
    title: 'Large Pothole on Main St',
    description: 'There is a large pothole causing major traffic slowdowns and potential damage to vehicles.',
    status: 'in_progress',
    severity: 'high',
    category: 'Roads & Infrastructure',
    address: '123 Main St, Mumbai, Maharashtra 400001',
    coordinates: { lat: 19.076, lng: 72.8777 },
    reportedAt: '2023-10-24T10:00:00Z',
    supportCount: 15,
    assignedAuthority: 'BMC Road Dept',
    slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    slaBreached: false,
    history: [
      { status: 'reported', timestamp: '2023-10-24T10:00:00Z' },
      { status: 'pending', timestamp: '2023-10-24T10:30:00Z', note: 'Assigned to K/West Ward team' },
      { status: 'in_progress', timestamp: '2023-10-25T08:00:00Z', note: 'Team dispatched to site' }
    ]
  };

  return (
    <div className="pb-24">
      {/* Photo Header */}
      <div className="w-full h-64 bg-gray-200 relative">
        <img src="/api/placeholder/800/400" alt="Incident" className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-mono text-sm font-bold text-gray-800 shadow-sm">
          {incident.id}
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{incident.title}</h1>
            <StatusChip status={incident.status} />
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{incident.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <SeverityChip severity={incident.severity} />
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
              {incident.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-gray-400"><Calendar size={14}/> Reported</span>
              <span className="font-medium text-gray-900">{new Date(incident.reportedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-gray-400"><Users size={14}/> Supported By</span>
              <span className="font-medium text-gray-900">{incident.supportCount} citizens</span>
            </div>
          </div>
        </div>

        {/* SLA & Assignment Card */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
              <Building size={16} className="text-blue-500" />
              Assigned To: {incident.assignedAuthority}
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldAlert size={16} /> SLA Status
            </div>
            <SlaCountdown deadline={incident.slaDeadline} breached={incident.slaBreached} />
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-blue-500" /> Location
          </h3>
          <p className="text-sm text-gray-600 mb-3">{incident.address}</p>
          <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
            <DynamicMap 
              center={[incident.coordinates.lat, incident.coordinates.lng]} 
              zoom={15} 
              markers={[{ id: incident.id, lat: incident.coordinates.lat, lng: incident.coordinates.lng, color: '#ef4444' }]} 
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="font-bold text-gray-900 mb-2">Resolution Tracking</h3>
          <Timeline entries={incident.history} currentStatus={incident.status} />
        </div>

      </div>

      {/* Fixed Action Bar at Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3 z-30 max-w-2xl mx-auto">
        <button className="flex-1 py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors hover:bg-blue-100">
          <ThumbsUp size={18} /> I've seen this too
        </button>
      </div>
    </div>
  );
}
