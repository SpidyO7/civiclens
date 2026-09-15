import React from 'react';
import { cn, getSeverityColor } from '@/lib/utils';

interface SeverityChipProps {
  severity: string;
  size?: 'sm' | 'md';
}

export default function SeverityChip({ severity, size = 'md' }: SeverityChipProps) {
  const colorClass = getSeverityColor(severity);

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full capitalize",
        size === 'sm' ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        colorClass
      )}
    >
      {severity}
    </span>
  );
}
