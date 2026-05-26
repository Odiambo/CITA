import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import StatsGrid from '../components/dashboard/StatsGrid';
import PipelineBoard from '../components/dashboard/PipelineBoard';
import RecentActivity from '../components/dashboard/RecentActivity';
import StageChart from '../components/dashboard/StageChart';
import EnrollmentByProgram from '../components/dashboard/EnrollmentByProgram';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useOutletContext();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: () => base44.entities.Participant.list('-created_date', 200),
  });

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
          Overview of intake pipeline and participant activity
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