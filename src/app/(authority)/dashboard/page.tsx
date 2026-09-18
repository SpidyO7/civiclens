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
import StatusChip from '@/components/shared/StatusChip';
import SeverityChip from '@/components/shared/SeverityChip';
import SlaCountdown from '@/components/shared/SlaCountdown';
import type { Incident } from '@/types';
import type { DashboardStats } from '@/types';

export default function AuthorityDashboard() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/incidents?limit=10').then(response => response.json()),
      fetch('/api/analytics').then(response => response.json()),
    ]).then(([incidentData, analyticsData]) => {
      setIncidents(Array.isArray(incidentData) ? incidentData : []);
      setStats(analyticsData.stats || null);
    }).finally(() => setLoading(false));
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
        <KpiCard icon={<Activity />} title="Active" value={String(stats?.activeIncidents ?? 0)} color="bg-blue-100 text-blue-700" />
        <KpiCard icon={<ShieldAlert />} title="Critical" value={String(stats?.criticalIncidents ?? 0)} color="bg-red-100 text-red-700" />
        <KpiCard icon={<Clock />} title="Overdue" value={String(stats?.overdueIncidents ?? 0)} color="bg-orange-100 text-orange-700" />
        <KpiCard icon={<Activity />} title="In Progress" value={String(stats?.inProgressIncidents ?? 0)} color="bg-amber-100 text-amber-700" />
        <KpiCard icon={<CheckCircle />} title="Resolved" value={String(stats?.resolvedIncidents ?? 0)} color="bg-green-100 text-green-700" />
        <KpiCard icon={<UserCheck />} title="Verified" value={String(stats?.citizenVerified ?? 0)} color="bg-emerald-100 text-emerald-700" />
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
                      incident.slaBreached ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
                    } ${incident.severity === 'critical' ? 'font-medium' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="text-civic-900 font-medium">{incident.incidentId}</div>
                      <div className="text-civic-500 truncate max-w-xs">{incident.description}</div>
                    </td>
                    <td className="px-4 py-3"><SeverityChip severity={incident.severity} /></td>
                    <td className="px-4 py-3"><StatusChip status={incident.status} /></td>
                    <td className="px-4 py-3">
                      {incident.slaDeadline && <SlaCountdown deadline={incident.slaDeadline} breached={incident.slaBreached} />}
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
