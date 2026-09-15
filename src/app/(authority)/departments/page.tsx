import React from 'react';
import { Building2, Mail, Users, AlertTriangle } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = [
    {
      id: 'DEPT-001',
      name: 'Public Works & Roads',
      head: 'Sarah Jenkins',
      email: 'roads@civiclens.gov',
      categories: ['Roads', 'Bridges', 'Sidewalks'],
      activeIncidents: 145,
      overdueIncidents: 12
    },
    {
      id: 'DEPT-002',
      name: 'Water & Sanitation',
      head: 'Michael Chen',
      email: 'water@civiclens.gov',
      categories: ['Water Supply', 'Sewage', 'Drainage'],
      activeIncidents: 89,
      overdueIncidents: 4
    },
    {
      id: 'DEPT-003',
      name: 'Electricity Board',
      head: 'David Miller',
      email: 'power@civiclens.gov',
      categories: ['Power Outage', 'Streetlights'],
      activeIncidents: 234,
      overdueIncidents: 28
    },
    {
      id: 'DEPT-004',
      name: 'Waste Management',
      head: 'Elena Rodriguez',
      email: 'waste@civiclens.gov',
      categories: ['Garbage Collection', 'Public Bins'],
      activeIncidents: 56,
      overdueIncidents: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-civic-900">Departments</h1>
          <p className="text-civic-500">Manage internal departments and track their performance</p>
        </div>
        <button className="bg-civic-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-civic-800 transition-colors">
          Add Department
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-civic-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-civic-50 text-civic-500 text-xs uppercase border-b border-civic-200">
              <tr>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Categories Handled</th>
                <th className="px-4 py-3 text-center">Active Load</th>
                <th className="px-4 py-3 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-civic-100">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-civic-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-civic-100 rounded-lg text-civic-600">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-civic-900">{dept.name}</div>
                        <div className="text-xs text-civic-500">{dept.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1 text-sm text-civic-700">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-civic-400" />
                        {dept.head}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Mail size={14} className="text-civic-400" />
                        {dept.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {dept.categories.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-civic-100 text-civic-700 text-xs rounded-full">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-civic-900">{dept.activeIncidents}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center gap-1 font-semibold ${
                      dept.overdueIncidents > 10 ? 'text-red-600 bg-red-50 px-2 py-1 rounded-lg' :
                      dept.overdueIncidents > 0 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {dept.overdueIncidents > 0 && <AlertTriangle size={14} />}
                      {dept.overdueIncidents}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
