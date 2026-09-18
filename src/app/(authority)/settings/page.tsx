'use client';

import React, { useState } from 'react';
import { Save, AlertTriangle, Database, Power } from 'lucide-react';

export default function SettingsPage() {
  const [seedMessage, setSeedMessage] = useState('');

  const seedDemoData = async () => {
    const response = await fetch('/api/seed', { method: 'POST' });
    setSeedMessage(response.ok ? 'Demo data seeded.' : 'Demo data could not be seeded.');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-civic-900">System Settings</h1>
        <p className="text-civic-500">Configure SLA rules and escalation hierarchies</p>
      </div>

      <div className="bg-white rounded-xl border border-civic-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-civic-200">
          <h2 className="text-lg font-semibold text-civic-900">SLA Configuration</h2>
          <p className="text-sm text-civic-500">Set maximum resolution times before escalation</p>
        </div>
        <div className="p-6">
          <table className="w-full text-sm text-left">
            <thead className="text-civic-500 text-xs uppercase mb-2">
              <tr>
                <th className="pb-3">Severity Level</th>
                <th className="pb-3">Resolution Target</th>
                <th className="pb-3">Escalation Trigger</th>
              </tr>
            </thead>
            <tbody className="space-y-4">
              <tr>
                <td className="py-3 font-medium text-red-600">Critical</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={24} className="w-16 border rounded p-1 text-center" /> hours
                  </div>
                </td>
                <td className="py-3">After target missed</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-orange-500">High</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={72} className="w-16 border rounded p-1 text-center" /> hours
                  </div>
                </td>
                <td className="py-3">After target missed</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-yellow-600">Medium</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={7} className="w-16 border rounded p-1 text-center" /> days
                  </div>
                </td>
                <td className="py-3">After target missed</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-blue-600">Low</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={14} className="w-16 border rounded p-1 text-center" /> days
                  </div>
                </td>
                <td className="py-3">Never</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-civic-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-civic-800">
              <Save size={16} /> Save SLA Rules
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-civic-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-civic-200">
          <h2 className="text-lg font-semibold text-civic-900">Escalation Hierarchy</h2>
          <p className="text-sm text-civic-500">Configure who gets notified at each escalation level</p>
        </div>
        <div className="p-6 space-y-4">
          {[
            { level: 1, role: 'Department Supervisor', time: 'Immediately on SLA breach' },
            { level: 2, role: 'Department Director', time: '24 hours after breach' },
            { level: 3, role: 'City Commissioner', time: '72 hours after breach' },
            { level: 4, role: 'Public Accountability Panel', time: '7 days after breach' },
          ].map((tier) => (
            <div key={tier.level} className="flex items-center justify-between p-4 border border-civic-100 bg-civic-50 rounded-lg">
              <div>
                <span className="font-bold text-civic-900 mr-2">Level {tier.level}:</span>
                <span className="font-medium text-civic-700">{tier.role}</span>
              </div>
              <span className="text-sm text-civic-500">{tier.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-200 flex items-center gap-2 text-red-800">
          <AlertTriangle size={20} />
          <h2 className="text-lg font-semibold">Demo Controls & Developer Tools</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={seedDemoData} className="flex flex-col items-center justify-center p-4 bg-white border border-red-200 rounded-lg hover:bg-red-50 text-red-700 font-medium transition-colors">
            <Database size={24} className="mb-2" />
            Seed Demo Data
            <span className="text-xs font-normal text-red-500 mt-1">Loads deterministic demo incidents</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-4 bg-white border border-red-200 rounded-lg hover:bg-red-50 text-red-700 font-medium transition-colors">
            <Power size={24} className="mb-2" />
            Simulate SLA Breach
            <span className="text-xs font-normal text-red-500 mt-1">Fast-forwards time</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 bg-red-600 border border-red-700 rounded-lg hover:bg-red-700 text-white font-medium transition-colors">
            <AlertTriangle size={24} className="mb-2" />
            Reset Database
            <span className="text-xs font-normal text-red-200 mt-1">Wipes all data</span>
          </button>
        </div>
        {seedMessage && <p className="px-6 pb-6 text-sm text-red-700">{seedMessage}</p>}
      </div>
    </div>
  );
}
