'use client';

import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Activity, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { StatusChip } from '@/components/shared/StatusChip';
import { SeverityChip } from '@/components/shared/SeverityChip';
import { SlaCountdown } from '@/components/shared/SlaCountdown';
import type { Incident } from '@/types';

export default function AuthorityDashboard() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for display purposes
  useEffect(() => {
    // In a real app, this would fetch from /api/analytics and /api/incidents
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-civic-900">Dashboard</h1>
          <p className="text-civic-500">Overview of civic issues and performance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon={<Activity />} title="Active" value="142" color="bg-blue-100 text-blue-700" />
        <KpiCard icon={<ShieldAlert />} title="Critical" value="12" color="bg-red-100 text-red-700" />
        <KpiCard icon={<Clock />} title="Overdue" value="8" color="bg-orange-100 text-orange-700" />
        <KpiCard icon={<Activity />} title="In Progress" value="45" color="bg-amber-100 text-amber-700" />
        <KpiCard icon={<CheckCircle />} title="Resolved" value="894" color="bg-green-100 text-green-700" />
        <KpiCard icon={<UserCheck />} title="Verified" value="812" color="bg-emerald-100 text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Incidents */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-civic-200 overflow-hidden">
          <div className="p-4 border-b border-civic-200 bg-civic-50/50">
            <h2 className="font-semibold text-civic-900">Urgent Incidents Queue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-civic-50 text-civic-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">ID / Issue</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SLA</th>
                  <th className="px-4 py-3">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-civic-100">
                {incidents.map((incident) => (
                  <tr 
                    key={incident.id} 
                    onClick={() => router.push(`/incident/${incident.id}`)}
                    className={`hover:bg-civic-50 cursor-pointer transition-colors ${
                      incident.status === 'overdue' ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
                    } ${incident.severity === 'critical' ? 'font-medium' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-civic-900 font-medium">{incident.id}</div>
                      <div className="text-civic-500 truncate max-w-xs">{incident.title}</div>
                    </td>
                    <td className="px-4 py-3"><SeverityChip severity={incident.severity} /></td>
                    <td className="px-4 py-3"><StatusChip status={incident.status} /></td>
                    <td className="px-4 py-3">
                      {incident.slaDeadline && <SlaCountdown deadline={incident.slaDeadline} />}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-civic-500">
                      {formatDistanceToNow(new Date(incident.createdAt))} ago
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr><td colSpan={5} className="text-center py-4 text-civic-500">Loading...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Escalations & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-civic-200 p-4">
            <h2 className="font-semibold text-civic-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              Active Escalations
            </h2>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-red-900 text-sm">INC-123{i}</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-medium">Level {i}</span>
                  </div>
                  <p className="text-sm text-red-800 mb-2 truncate">Water pipe burst on 5th Ave</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-red-600 font-medium">4hrs overdue</span>
                    <button className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <StatCard title="Avg Response Time" value="2.4 hrs" trend="-12%" trendUp={true} />
            <StatCard title="SLA Compliance" value="94.2%" trend="+1.5%" trendUp={true} />
            <StatCard title="Escalation Rate" value="3.8%" trend="+0.4%" trendUp={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-civic-200 p-4 flex flex-col items-center justify-center text-center">
      <div className={`p-2 rounded-full mb-2 ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <h3 className="text-2xl font-bold text-civic-900">{value}</h3>
      <p className="text-xs font-medium text-civic-500 uppercase tracking-wider mt-1">{title}</p>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp }: { title: string, value: string, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-civic-200 p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-civic-500">{title}</p>
        <p className="text-xl font-bold text-civic-900">{value}</p>
      </div>
      <div className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </div>
    </div>
  );
}
