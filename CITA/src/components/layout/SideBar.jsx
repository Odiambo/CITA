'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, UserPlus, ClipboardList,
  LogOut, ChevronLeft, ChevronRight, Shield, X, ScrollText, FileText, Calendar
} from 'lucide-react';
import { cita } from '@/api/citaClient';
import { cn } from '@/lib/utils';
import { ROLE_GROUPS, ROLE_LABELS, ROLES } from '@/lib/roles';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ROLE_GROUPS.dashboardViewers },
  {
    path: '/participants',
    icon: Users,
    label: 'Participants',
    roles: [...ROLE_GROUPS.operationalEditors, ROLES.EXEC_DIRECTOR, ROLES.DATA_OFFICER, ROLES.VIEWER],
  },
  { path: '/intake/new', icon: UserPlus, label: 'New Intake', roles: ROLE_GROUPS.operationalEditors },
  { path: '/user-logs', icon: ScrollText, label: 'User Logs', roles: [ROLES.EXEC_DIRECTOR, ROLES.ADMIN] },
  { path: '/my-application', icon: FileText, label: 'Intake Information', roles: [ROLES.PARTICIPANT] },
  { path: '/my-application/full', icon: ClipboardList, label: 'Application', roles: [ROLES.PARTICIPANT] },
  { path: '/my-application/calendar', icon: Calendar, label: 'Calendar', roles: [ROLES.PARTICIPANT] },
];

export default function Sidebar({ user, collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const userRole = user?.role || 'participant';
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-all duration-300",
      // Desktop: always visible, collapsible
      "hidden lg:flex",
      collapsed ? "lg:w-[72px]" : "lg:w-64",
      // Mobile: overlay drawer
      "max-lg:flex max-lg:w-72",
      mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {(!collapsed || mobileOpen) && (
            <span className="font-semibold text-sm tracking-tight truncate">IntakeTracker</span>
          )}
        </div>
        {/* Close button on mobile */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1 rounded text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = pathname === item.path ||
            (item.path !== '/' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {(!collapsed || mobileOpen) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Toggle */}
      <div className="border-t border-sidebar-border p-3 space-y-2 shrink-0">
        {(!collapsed || mobileOpen) && (
          <div className="px-3 py-2">
            <p className="text-xs font-medium truncate">{user?.full_name || user?.email}</p>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider mt-0.5">
              {ROLE_LABELS[userRole] || userRole}
            </p>
          </div>
        )}
        <button
          onClick={() => cita.auth.logout()}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-all"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {(!collapsed || mobileOpen) && <span>Sign Out</span>}
        </button>
        {/* Desktop collapse toggle only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-lg text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
