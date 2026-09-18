'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Users, Building, ShieldAlert, ThumbsUp, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import StatusChip from '@/components/shared/StatusChip';
import SeverityChip from '@/components/shared/SeverityChip';
import SlaCountdown from '@/components/shared/SlaCountdown';
import Timeline from '@/components/shared/Timeline';
import DynamicMap from '@/components/shared/DynamicMap';
import { Incident, IncidentStatus, StatusHistory, Verification } from '@/types';

interface IncidentDetail extends Incident {
  statusHistory: StatusHistory[];
  verifications: Verification[];
  department?: { name: string };
}

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [supporting, setSupporting] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetch(`/api/incidents/${params.id}`)
      .then(async response => {
        if (!response.ok) throw new Error('Incident not found');
        return response.json() as Promise<IncidentDetail>;
      })
      .then(setIncident)
      .catch(error => setError(error instanceof Error ? error.message : 'Failed to load incident'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const supportIncident = async () => {
    if (!incident || supporting) return;
    setSupporting(true);
    const response = await fetch(`/api/incidents/${incident.id}/support`, { method: 'POST' });
    if (response.ok) {
      const result = await response.json() as { supportCount: number };
      setIncident({ ...incident, supportCount: result.supportCount });
    }
    setSupporting(false);
  };

  const verifyIncident = async (verified: boolean) => {
    if (!incident || verifying) return;
    setVerifying(true);
    const response = await fetch(`/api/incidents/${incident.id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified, comment: verified ? 'Citizen confirmed the repair.' : 'Issue still exists.' }),
    });
    if (response.ok) {
      const updated = await response.json() as Incident;
      setIncident({ ...incident, ...updated, statusHistory: [...incident.statusHistory, { id: crypto.randomUUID(), incidentId: incident.id, fromStatus: incident.status, toStatus: updated.status, changedBy: 'citizen-1', note: verified ? 'Citizen confirmed the repair.' : 'Issue still exists.', createdAt: new Date().toISOString() }] });
    }
    setVerifying(false);
  };

  if (loading) return <div className="p-8 flex items-center justify-center text-gray-500"><Loader2 className="animate-spin mr-2" size={18} /> Loading incident…</div>;
  if (error || !incident) return <div className="p-8 text-center text-red-600">{error || 'Incident not found'}</div>;

  const canVerify = incident.status === 'awaiting_verification';
  const history = incident.statusHistory.map(entry => ({ status: entry.toStatus, timestamp: entry.createdAt, note: entry.note }));

  return (
    <div className="pb-24">
      {/* Photo Header */}
      <div className="w-full h-64 bg-gray-200 relative">
        {incident.imageUrl ? <Image src={incident.imageUrl} alt={incident.description} fill unoptimized className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-mono text-sm font-bold text-gray-800 shadow-sm">
          {incident.id}
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex justify-between items-start mb-3">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{incident.incidentId}</h1>
            <StatusChip status={incident.status} />
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{incident.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <SeverityChip severity={incident.severity} />
            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
              {incident.category} · {incident.subcategory.replaceAll('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-gray-400"><Calendar size={14}/> Reported</span>
              <span className="font-medium text-gray-900">{new Date(incident.createdAt).toLocaleDateString()}</span>
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
              Assigned To: {incident.department?.name || 'Responsible department'}
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
              center={[incident.latitude, incident.longitude]}
              zoom={15} 
              markers={[{ id: incident.id, lat: incident.latitude, lng: incident.longitude, color: '#ef4444' }]}
            />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="font-bold text-gray-900 mb-2">Resolution Tracking</h3>
          <Timeline entries={history} currentStatus={incident.status} />
        </div>

        {canVerify && (
          <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-1">Was this issue actually fixed?</h3>
            <p className="text-sm text-blue-700 mb-3">Your verification closes the loop for this report.</p>
            <div className="flex gap-3">
              <button onClick={() => verifyIncident(true)} disabled={verifying} className="flex-1 py-2 px-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"><CheckCircle2 size={16} /> Yes, fixed</button>
              <button onClick={() => verifyIncident(false)} disabled={verifying} className="flex-1 py-2 px-3 bg-white text-orange-700 border border-orange-200 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"><RotateCcw size={16} /> Still broken</button>
            </div>
          </div>
        )}

      </div>

      {/* Fixed Action Bar at Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3 z-30 max-w-2xl mx-auto">
        <button onClick={supportIncident} disabled={supporting} className="flex-1 py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors hover:bg-blue-100 disabled:opacity-50">
          {supporting ? <Loader2 size={18} className="animate-spin" /> : <ThumbsUp size={18} />} I&apos;ve seen this too
          </button>
      </div>
    </div>
  );
}
