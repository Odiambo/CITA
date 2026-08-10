'use client';

import React, { useState, useEffect } from 'react';
import { cita } from '@/api/citaClient';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }) {
  const { user: authUser, isLoadingAuth, authError, navigateToLogin } = useAuth();
  const [user, setUser] = useState(authUser);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      return;
    }
    cita.auth.me().then(setUser).catch(() => {});
  }, [authUser]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError?.type === 'auth_required') {
    navigateToLogin();
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setMobileOpen(false)} />

      }

      <Sidebar
        user={user}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)} />
      

      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "lg:ml-64",
        collapsed && "lg:ml-[72px]"
      )}>
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 h-14 px-4 border-b border-border bg-card sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu">
            
            <div className="w-5 h-0.5 bg-foreground mb-1 rounded" />
            <div className="w-5 h-0.5 bg-foreground mb-1 rounded" />
            <div className="w-5 h-0.5 bg-foreground rounded" />
          </button>
          <span className="font-semibold text-sm tracking-tight">SRD IX</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1440px]">
          {children}
        </div>
      </main>
    </div>);

}
