'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import StatusChip from '@/components/shared/StatusChip';
import SeverityChip from '@/components/shared/SeverityChip';

export default function MyReportsPage() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Active', 'Resolved'];
  
  const reports = [
    { id: 'CL-001', title: 'Large Pothole on Main St', address: '123 Main St, Mumbai', severity: 'high', status: 'pending', date: '2023-10-24' },
    { id: 'CL-005', title: 'Streetlight Not Working', address: '4th Cross Rd, Mumbai', severity: 'low', status: 'resolved', date: '2023-10-10' },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Reports</h1>
      
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-blue-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reports.map(report => (
          <Link key={report.id} href={`/incident/${report.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1 pr-2">{report.title}</h3>
              <StatusChip status={report.status} size="sm" />
            </div>
            <div className="text-xs text-gray-500 mb-3 space-y-1">
              <div className="flex items-center gap-1"><MapPin size={12} /> <span className="truncate">{report.address}</span></div>
              <div className="flex items-center gap-1"><Clock size={12} /> {report.date}</div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <SeverityChip severity={report.severity} size="sm" />
              <span className="text-xs font-mono text-gray-400">{report.id}</span>
            </div>
          </Link>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reports yet. Report your first civic issue!
          </div>
        )}
      </div>
    </div>
  );
}
