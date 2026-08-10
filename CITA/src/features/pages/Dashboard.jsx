'use client';

import React from 'react';
import { cita } from '@/api/citaClient';
import { useQuery } from '@tanstack/react-query';
import StatsGrid from '@/components/dashboard/StatsGrid';
import PipelineBoard from '@/components/dashboard/PipelineBoard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StageChart from '@/components/dashboard/StageChart';
import EnrollmentByProgram from '@/components/dashboard/EnrollmentByProgram';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/AuthContext';
import { canViewDashboard } from '@/lib/roles';

export default function Dashboard() {
  const { user } = useAuth();
  const canAccessDashboard = canViewDashboard(user?.role);

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: () => cita.participants.list('-created_date', 200),
    enabled: canAccessDashboard,
  });

  if (!canAccessDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view this dashboard.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of intake pipeline and program activity
        </p>
      </div>

      <StatsGrid participants={participants} />

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Intake Pipeline
        </h2>
        <PipelineBoard participants={participants} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity participants={participants} />
        <StageChart participants={participants} />
      </div>

      <EnrollmentByProgram participants={participants} />
    </div>
  );
}
