'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map as MapIcon, FileText, User, Bell } from 'lucide-react';
import RoleSwitcher from '@/components/shared/RoleSwitcher';
import { cn } from '@/lib/utils';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Map', href: '/map', icon: MapIcon },
    { name: 'My Reports', href: '/my-reports', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="font-bold text-xl text-blue-900">CivicLens</div>
          <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <main>{children}</main>

      <RoleSwitcher />

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                )}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
