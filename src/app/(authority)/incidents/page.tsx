'use client';

import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Search, 
  MoreVertical,
  CheckCircle,
  MessageSquare,
  UserPlus,
  Camera,
  AlertTriangle,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatusChip } from '@/components/shared/StatusChip';
import { SeverityChip } from '@/components/shared/SeverityChip';
import { SlaCountdown } from '@/components/shared/SlaCountdown';
import type { Incident } from '@/types';

export default function IncidentsQueuePage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    // Mock data
    setIncidents([
      {
        id: 'INC-1234',
        title: 'Massive pothole on Main St',
        description: 'Large pothole causing traffic issues',
        category: 'road',
        location: { lat: 0, lng: 0, address: '123 Main St' },
        severity: 'high',
        status: 'overdue',
        userId: 'user1',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        supportCount: 45,
        slaDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'INC-1235',
        title: 'Power outage in Sector 4',
        description: 'No electricity since morning',
        category: 'electricity',
        location: { lat: 0, lng: 0, address: 'Sector 4, Park Ave' },
        severity: 'critical',
        status: 'reported',
        userId: 'user2',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        supportCount: 120,
        slaDeadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString()
      }
    ] as any);
  }, []);

  const openActionPanel = (incident: Incident, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIncident(incident);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-civic-900">Incident Queue</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-civic-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, title, location..." 
              className="pl-9 pr-4 py-2 border border-civic-200 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-civic-500"
            />
          </div>
          <select className="border border-civic-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-civic-500">
            <option>All Categories</option>
            <option>Road</option>
            <option>Water</option>
          </select>
          <select className="border border-civic-200 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-civic-500">
            <option>All Statuses</option>
            <option>Reported</option>
            <option>Overdue</option>
          </select>
          <button className="flex items-center gap-2 border border-civic-200 bg-white px-3 py-2 rounded-lg text-sm hover:bg-civic-50 transition-colors">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-civic-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-civic-50 text-civic-500 text-xs uppercase border-b border-civic-200">
              <tr>
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SLA</th>
                <th className="px-4 py-3">Supports</th>
                <th className="px-4 py-3">Reported</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-civic-100">
              {incidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className={`hover:bg-civic-50 transition-colors ${
                    incident.status === 'overdue' ? 'border-l-4 border-l-red-500 bg-red-50/20' : ''
                  } ${incident.severity === 'critical' ? 'font-medium' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="text-civic-900 font-medium">{incident.id}</div>
                    <div className="text-civic-500 truncate max-w-[200px]">{incident.title}</div>
                  </td>
                  <td className="px-4 py-3 truncate max-w-[150px]">{incident.location.address}</td>
                  <td className="px-4 py-3"><SeverityChip severity={incident.severity} /></td>
                  <td className="px-4 py-3"><StatusChip status={incident.status} /></td>
                  <td className="px-4 py-3">
                    {incident.slaDeadline && <SlaCountdown deadline={incident.slaDeadline} />}
                  </td>
                  <td className="px-4 py-3 text-center">{incident.supportCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-civic-500">
                    {formatDistanceToNow(new Date(incident.createdAt))} ago
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick={(e) => openActionPanel(incident, e)}
                      className="text-civic-600 hover:text-civic-900 bg-civic-100 hover:bg-civic-200 px-3 py-1 rounded transition-colors text-xs font-medium"
                    >
                      Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-civic-200 flex justify-between items-center text-sm text-civic-500">
          <span>Showing 1 to 10 of 45 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-civic-200 rounded hover:bg-civic-50">Prev</button>
            <button className="px-3 py-1 border border-civic-200 rounded hover:bg-civic-50">Next</button>
          </div>
        </div>
      </div>

      {/* Action Panel Modal */}
      {isPanelOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-civic-200 bg-civic-50">
              <h3 className="font-bold text-civic-900">Manage {selectedIncident.id}</h3>
              <button onClick={() => setIsPanelOpen(false)} className="text-civic-500 hover:text-civic-900">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                  <CheckCircle size={20} />
                  <span className="text-sm font-medium">Acknowledge</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-3 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors">
                  <UserPlus size={20} />
                  <span className="text-sm font-medium">Assign</span>
                </button>
              </div>

              {/* Status Update Form */}
              <div className="space-y-3 p-4 border border-civic-200 rounded-lg">
                <h4 className="font-semibold text-civic-900 flex items-center gap-2">
                  <MessageSquare size={16} /> Update Status
                </h4>
                
                <div>
                  <label className="block text-xs text-civic-500 mb-1">New Status</label>
                  <select className="w-full border border-civic-300 rounded p-2 text-sm">
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-civic-500 mb-1">Public Note</label>
                  <textarea 
                    className="w-full border border-civic-300 rounded p-2 text-sm"
                    rows={3}
                    placeholder="Provide an update to citizens..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 text-sm text-civic-600 bg-civic-100 px-3 py-1.5 rounded hover:bg-civic-200 border border-civic-300">
                    <Camera size={16} /> Add Photo
                  </button>
                </div>

                <button className="w-full bg-civic-900 text-white py-2 rounded font-medium hover:bg-civic-800 transition-colors">
                  Save Update
                </button>
              </div>

              {/* Escalate */}
              <button className="w-full flex justify-center items-center gap-2 text-red-600 bg-red-50 py-2 border border-red-200 rounded hover:bg-red-100 transition-colors font-medium">
                <AlertTriangle size={16} /> Escalate Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
