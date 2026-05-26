import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import ParticipantHeader from '../components/participant/ParticipantHeader';
import StageTimeline from '../components/participant/StageTimeline';
import StageActions from '../components/participant/StageActions';
import ParticipantInfo from '../components/participant/ParticipantInfo';

export default function ParticipantDetail() {
  const { user } = useOutletContext();
  const urlParams = new URLSearchParams(window.location.search);
  const id = window.location.pathname.split('/').pop();

  const { data: participant, isLoading } = useQuery({
    queryKey: ['participant', id],
    queryFn: () => base44.entities.Participant.filter({ id }),
    select: (data) => data?.[0],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <Card className="border-0 shadow-sm p-12 text-center">
        <p className="text-muted-foreground">Participant not found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ParticipantHeader participant={participant} />
      
      <Card className="border-0 shadow-sm p-6">
        <StageTimeline currentStage={participant.stage} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StageActions participant={participant} userRole={user?.role} />
        <ParticipantInfo participant={participant} />
      </div>
    </div>
  );
}