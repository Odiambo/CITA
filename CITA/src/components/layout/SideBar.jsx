import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, ClipboardList,
  LogOut, ChevronLeft, ChevronRight, Shield, X, ScrollText, FileText, Calendar
} from 'lucide-react';
import { base44 } from '@/api/citaClient';
import { cn } from '@/lib/utils';

const ADMIN_ROLES = ['intake_admin', 'program_director', 'exec_director'];

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: [...ADMIN_ROLES, 'exec_director', 'viewer'] },
  { path: '/participants', icon: Users, label: 'Participants', roles: [...ADMIN_ROLES, 'program_educator', 'viewer'] },
  { path: '/intake/new', icon: UserPlus, label: 'New Intake', roles: [...ADMIN_ROLES, 'program_educator', 'intake_admin'] },
  { path: '/user-logs', icon: ScrollText, label: 'User Logs', roles: ['exec_director'] },
  { path: '/my-application', icon: FileText, label: 'Intake Information', roles: ['participant'] },
  { path: '/my-application/full', icon: ClipboardList, label: 'Application', roles: ['participant'] },
  { path: '/my-application/calendar', icon: Calendar, label: 'Calendar', roles: ['participant'] },
];

export default function Sidebar({ user, collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();
  const userRole = user?.role || 'participant';
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const roleLabels = {
    participant: 'Participant',
    intake_admin: 'Intake Admin',
    program_coordinator: 'Program Coordinator',
    exec_director: 'Exec. Director',
    program_educator: 'Program Educator',
    viewer: 'Viewer (Read-Only)',
  };

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
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
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
              {roleLabels[userRole]}
            </p>
          </div>
        )}
        <button
          onClick={() => base44.auth.logout()}
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