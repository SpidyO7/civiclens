import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  AlertTriangle,
  Map,
  AlertOctagon,
  Building2,
  BarChart3,
  Settings,
  Bell,
  Menu
} from 'lucide-react';
import RoleSwitcher from '@/components/shared/RoleSwitcher';

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-civic-50 flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-civic-950 text-white fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold">CivicLens</h1>
          <p className="text-civic-400 text-sm mt-1">Authority Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavLink href="/incidents" icon={<AlertTriangle size={20} />} label="Incidents" />
          <NavLink href="/live-map" icon={<Map size={20} />} label="Live Map" />
          <NavLink href="/escalations" icon={<AlertOctagon size={20} />} label="Escalations" />
          <NavLink href="/departments" icon={<Building2 size={20} />} label="Departments" />
          <NavLink href="/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
          <NavLink href="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        
        <div className="p-4 border-t border-civic-800">
          <RoleSwitcher />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-civic-950 text-white z-20 sticky top-0">
        <h1 className="text-xl font-bold">CivicLens</h1>
        <div className="flex items-center gap-4">
          <RoleSwitcher />
          <button className="p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-civic-200 items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-civic-900">Authority Portal</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-civic-600 hover:bg-civic-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-civic-200 flex items-center justify-center text-civic-700 font-medium">
                JD
              </div>
              <div className="text-sm">
                <p className="font-medium text-civic-900">John Doe</p>
                <p className="text-civic-500">City Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  // Normally use usePathname to determine active state, simplified for layout
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-civic-800 text-civic-100`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
