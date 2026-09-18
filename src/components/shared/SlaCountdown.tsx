'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SlaCountdownProps {
  deadline?: string;
  breached: boolean;
}

export default function SlaCountdown({ deadline, breached }: SlaCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  
  useEffect(() => {
    const updateTime = () => {
      if (!deadline) {
        setTimeLeft('No SLA assigned');
        return;
      }

      if (breached) {
        setTimeLeft('SLA BREACHED');
        return;
      }
      
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft('SLA BREACHED');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m remaining`);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [deadline, breached]);

  return (
    <div className={cn(
      "text-xs font-semibold px-2 py-1 rounded",
      timeLeft === 'SLA BREACHED' || breached 
        ? "bg-red-100 text-red-700" 
        : "bg-blue-100 text-blue-700"
    )}>
      {timeLeft}
    </div>
  );
}
