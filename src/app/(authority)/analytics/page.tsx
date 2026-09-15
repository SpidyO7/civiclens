'use client';

import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

export default function AnalyticsPage() {
  const categoryData = [
    { name: 'Roads', value: 400 },
    { name: 'Water', value: 300 },
    { name: 'Electricity', value: 300 },
    { name: 'Waste', value: 200 },
    { name: 'Safety', value: 100 },
  ];
  
  const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

  const timelineData = [
    { date: 'Mon', reported: 40, resolved: 24 },
    { date: 'Tue', reported: 30, resolved: 13 },
    { date: 'Wed', reported: 20, resolved: 48 },
    { date: 'Thu', reported: 27, resolved: 39 },
    { date: 'Fri', reported: 18, resolved: 48 },
    { date: 'Sat', reported: 23, resolved: 38 },
    { date: 'Sun', reported: 34, resolved: 43 },
  ];

  const wardData = [
    { id: 1, name: 'Downtown', incidents: 156, resolved: 140, overdue: 2, score: 92 },
    { id: 2, name: 'North Hills', incidents: 89, resolved: 60, overdue: 15, score: 65 },
    { id: 3, name: 'Westside', incidents: 210, resolved: 195, overdue: 4, score: 88 },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-civic-900">Analytics & Reports</h1>
          <p className="text-civic-500">System-wide performance and issue analysis</p>
        </div>
        <select className="border border-civic-200 rounded-lg px-4 py-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-civic-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KpiCard title="Total Reports" value="1,245" trend="+12%" />
        <KpiCard title="Avg Response" value="1.8h" trend="-15%" good />
        <KpiCard title="Avg Resolution" value="3.2d" trend="-8%" good />
        <KpiCard title="SLA Compliance" value="94%" trend="+2%" good />
        <KpiCard title="Escalation Rate" value="4.2%" trend="+0.5%" />
        <KpiCard title="Verification Success" value="88%" trend="+5%" good />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-civic-200 shadow-sm">
          <h3 className="font-semibold text-civic-900 mb-6">Reports by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-civic-200 shadow-sm">
          <h3 className="font-semibold text-civic-900 mb-6">Resolution Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reported" stroke="#94a3b8" strokeWidth={2} dot={false} name="New Reports" />
                <Line type="monotone" dataKey="resolved" stroke="#0f172a" strokeWidth={3} dot={false} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-civic-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-civic-100">
            <h3 className="font-semibold text-civic-900">Ward Performance</h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-civic-50 text-civic-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Ward Name</th>
                <th className="px-6 py-3 text-center">Total Issues</th>
                <th className="px-6 py-3 text-center">Resolved</th>
                <th className="px-6 py-3 text-center">Overdue</th>
                <th className="px-6 py-3 text-center">Health Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-civic-100">
              {wardData.map((ward) => (
                <tr key={ward.id}>
                  <td className="px-6 py-4 font-medium text-civic-900">{ward.name}</td>
                  <td className="px-6 py-4 text-center">{ward.incidents}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">{ward.resolved}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-medium">{ward.overdue}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      ward.score >= 90 ? 'bg-green-100 text-green-700' :
                      ward.score >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {ward.score}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-xl border border-civic-200 shadow-sm">
          <h3 className="font-semibold text-civic-900 mb-4">AI Insights: Recurring Problems</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-1">Water Logging in North Hills</p>
              <p className="text-xs text-red-600">Detected 15 identical reports in the last 48 hours. Strongly suggests a structural drainage issue rather than random blockage.</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-sm font-medium text-amber-800 mb-1">Streetlight failures on Main St</p>
              <p className="text-xs text-amber-600">High failure rate (30%) within 1 week of repair. Recommend checking main power line stability.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, good }: { title: string, value: string, trend: string, good?: boolean }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-civic-200 shadow-sm text-center">
      <p className="text-xs font-medium text-civic-500 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-civic-900 mb-1">{value}</p>
      <span className={`text-xs font-semibold ${
        good ? 'text-green-600' : 'text-civic-500'
      }`}>{trend}</span>
    </div>
  );
}
