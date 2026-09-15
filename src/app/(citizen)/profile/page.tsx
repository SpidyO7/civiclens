'use client';

import React from 'react';
import { User, Settings, LogOut, FileText, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Demo Citizen</h1>
          <p className="text-sm text-gray-500">citizen@civiclens.app</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <FileText className="text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-gray-900">12</span>
          <span className="text-xs text-gray-500">Total Reports</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="text-green-500 mb-2" />
          <span className="text-2xl font-bold text-gray-900">8</span>
          <span className="text-xs text-gray-500">Verified Fixed</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3"><Settings size={20} className="text-gray-500"/> <span className="font-medium text-gray-700">Settings</span></div>
        </button>
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-red-600">
          <div className="flex items-center gap-3"><LogOut size={20} /> <span className="font-medium">Sign Out</span></div>
        </button>
      </div>
    </div>
  );
}
