'use client';

import React, { useState } from 'react';
import { AlertOctagon, Clock, ShieldAlert, ChevronRight, MessageSquare, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { StatusChip } from '@/components/shared/StatusChip';

export default function EscalationsPage() {
  const [selectedEscalation, setSelectedEscalation] = useState<any | null>(null);

  const escalations = [
    {
      id: 'INC-9012',
      title: 'Major water main burst flooded 3 streets',
      level: 3,
      overdue: '12 hours',
      originalDate: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      department: 'Water Supply',
      supportCount: 342,
      status: 'escalated'
    },
    {
      id: 'INC-8834',
      title: 'Open transformer sparking near school',
      level: 4,
      overdue: '2 hours',
      originalDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      department: 'Electricity Board',
      supportCount: 156,
      status: 'escalated'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-civic-900">Escalation Management</h1>
        <p className="text-civic-500">Track and manage SLA breaches and severe incidents</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-civic-200">
          <p className="text-sm text-civic-500">Total Escalated</p>
          <p className="text-2xl font-bold text-civic-900">24</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200">
          <p className="text-sm text-orange-700 font-medium">Level 1 (Supervisor)</p>
          <p className="text-2xl font-bold text-orange-900">12</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
          <p className="text-sm text-red-700 font-medium">Level 2 (Director)</p>
          <p className="text-2xl font-bold text-red-900">8</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow-sm border border-red-300">
          <p className="text-sm text-red-800 font-medium">Level 3 (Commissioner)</p>
          <p className="text-2xl font-bold text-red-950">3</p>
        </div>
        <div className="bg-civic-950 p-4 rounded-xl shadow-sm border border-civic-900">
          <p className="text-sm text-red-400 font-medium">Level 4 (Public Panel)</p>
          <p className="text-2xl font-bold text-white">1</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-civic-900 px-1">Active Escalations</h2>
          <div className="space-y-3">
            {escalations.map((esc) => (
              <div 
                key={esc.id}
                onClick={() => setSelectedEscalation(esc)}
                className={`bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                  selectedEscalation?.id === esc.id 
                    ? 'border-red-500 ring-2 ring-red-200' 
                    : 'border-civic-200 hover:border-red-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-civic-900">{esc.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    esc.level === 4 ? 'bg-civic-900 text-red-500' :
                    esc.level === 3 ? 'bg-red-200 text-red-800' :
                    esc.level === 2 ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    Level {esc.level}
                  </span>
                </div>
                <p className="text-sm text-civic-700 font-medium mb-3 line-clamp-2">{esc.title}</p>
                <div className="flex items-center gap-4 text-xs text-civic-500">
                  <div className="flex items-center gap-1 text-red-600 font-medium">
                    <Clock size={14} />
                    {esc.overdue} overdue
                  </div>
                  <div>
                    {esc.supportCount} supports
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Column */}
        <div className="lg:col-span-2">
          {selectedEscalation ? (
            <div className="bg-white rounded-xl shadow-sm border border-civic-200 overflow-hidden">
              <div className={`p-6 border-b ${
                selectedEscalation.level >= 3 ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-civic-900">{selectedEscalation.id}</h2>
                      <StatusChip status="escalated" />
                    </div>
                    <h3 className="text-lg font-medium text-civic-800">{selectedEscalation.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-civic-500 mb-1">Assigned To</div>
                    <div className="font-medium text-civic-900">{selectedEscalation.department}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-civic-900 mb-3 flex items-center gap-2">
                    <AlertOctagon size={18} className="text-red-500" />
                    Escalation Package
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-civic-100">
                      <span className="text-civic-500">Original Report</span>
                      <span className="font-medium">{formatDistanceToNow(new Date(selectedEscalation.originalDate))} ago</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-civic-100">
                      <span className="text-civic-500">SLA Breach</span>
                      <span className="font-medium text-red-600">{selectedEscalation.overdue} ago</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-civic-100">
                      <span className="text-civic-500">Citizen Supports</span>
                      <span className="font-medium">{selectedEscalation.supportCount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-civic-100">
                      <span className="text-civic-500">Reminders Sent</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-civic-900 text-white py-2 rounded-lg font-medium hover:bg-civic-800 transition-colors flex justify-center items-center gap-2">
                      <ShieldAlert size={18} />
                      Take Executive Action
                    </button>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 bg-white border border-civic-300 text-civic-700 py-2 rounded-lg font-medium hover:bg-civic-50 transition-colors">
                        Reassign
                      </button>
                      <button className="flex-1 bg-white border border-civic-300 text-civic-700 py-2 rounded-lg font-medium hover:bg-civic-50 transition-colors">
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-civic-900 mb-3 flex items-center gap-2">
                    <History size={18} className="text-civic-500" />
                    Timeline
                  </h4>
                  <div className="relative border-l-2 border-civic-200 ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-red-600">Escalated to Level {selectedEscalation.level}</p>
                      <p className="text-xs text-civic-500">Just now</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-orange-400 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-orange-600">SLA Breached</p>
                      <p className="text-xs text-civic-500">{selectedEscalation.overdue} ago</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-civic-900">Assigned to {selectedEscalation.department}</p>
                      <p className="text-xs text-civic-500">2 days ago</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-civic-300 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                      <p className="text-sm font-medium text-civic-900">Issue Reported</p>
                      <p className="text-xs text-civic-500">{formatDistanceToNow(new Date(selectedEscalation.originalDate))} ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-civic-200 h-full min-h-[400px] flex flex-col items-center justify-center text-civic-400">
              <AlertOctagon size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Select an escalation to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
