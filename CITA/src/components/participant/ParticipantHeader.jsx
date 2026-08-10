import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StageBadge from '../shared/StageBadge';
import StatusBadge from '../shared/StatusBadge';

export default function ParticipantHeader({ participant }) {
  const router = useRouter();
  const p = participant;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1.5 text-muted-foreground">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <span className="text-lg font-bold text-accent-foreground">
              {p.first_name?.[0]}{p.last_name?.[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{p.first_name} {p.last_name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
              {p.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{p.email}</span>}
              {p.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{p.phone}</span>}
              {p.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{p.address}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StageBadge stage={p.stage} />
          <StatusBadge status={p.status} />
        </div>
      </div>
    </div>
  );
}
