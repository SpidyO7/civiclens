import React from 'react';
import { cn, getStatusColor, getStatusLabel } from '@/lib/utils';

interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusChip({ status, size = 'md' }: StatusChipProps) {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === 'sm' ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
        colorClass
      )}
    >
      {label}
    </span>
  );
}
