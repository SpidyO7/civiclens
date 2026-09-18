import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { getStatusLabel } from '@/lib/utils';

interface TimelineEntry {
  status: string;
  timestamp: string;
  note?: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
  currentStatus: string;
}

export default function Timeline({ entries, currentStatus }: TimelineProps) {
  const flow = ['reported', 'location_verified', 'classified', 'authority_notified', 'acknowledged', 'inspection', 'in_progress', 'repair_completed', 'awaiting_verification', 'verified_resolved'];
  
  return (
    <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 my-6">
      {flow.map((step, idx) => {
        const entry = entries.find(e => e.status === step);
        const isCurrent = step === currentStatus;
        const isCompleted = entries.some(e => e.status === step) && !isCurrent;
        
        return (
          <div key={step} className="relative pl-6">
            <span className="absolute -left-[11px] top-0 bg-white">
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 bg-white" />
              ) : isCurrent ? (
                <Circle className="w-5 h-5 text-blue-500 fill-blue-50 bg-white" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 bg-white" />
              )}
            </span>
            <div className="flex flex-col">
              <span className={`font-medium ${isCurrent ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                {getStatusLabel(step)}
              </span>
              {entry && (
                <span className="text-xs text-gray-500 mt-0.5">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              )}
              {entry?.note && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                  {entry.note}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
