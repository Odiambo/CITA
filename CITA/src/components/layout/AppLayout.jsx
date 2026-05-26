import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { base44 } from '@/api/citaClient';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>);

}