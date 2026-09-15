'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/auth'; // Type only

export default function RoleSwitcher() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('citizen');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/(^| )civiclens-role=([^;]+)/);
    if (match) {
      setRole(match[2] as UserRole);
    }
  }, []);

  const switchRole = async (newRole: UserRole) => {
    // Basic fallback using fetch to a non-existent API yet, 
    // but updating cookie manually for client side
    document.cookie = `civiclens-role=${newRole}; path=/`;
    setRole(newRole);
    setIsOpen(false);
    
    // In a real app we might call:
    // await fetch('/api/auth/switch-role', { method: 'POST', body: JSON.stringify({ role: newRole }) });
    
    router.refresh();
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {(['citizen', 'authority', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={cn(
                  "block w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100",
                  role === r && "bg-blue-50 text-blue-700 font-medium"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        >
          <Settings size={16} />
          <span className="text-sm font-medium capitalize">{role}</span>
        </button>
      </div>
    </div>
  );
}

export function useCurrentRole() {
  const [role, setRole] = useState<UserRole>('citizen');
  useEffect(() => {
    const match = document.cookie.match(/(^| )civiclens-role=([^;]+)/);
    if (match) {
      setRole(match[2] as UserRole);
    }
  }, []);
  return role;
}
