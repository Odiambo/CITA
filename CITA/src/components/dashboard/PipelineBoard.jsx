import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { STAGE_CONFIG } from '../shared/StageBadge';
import StatusBadge from '../shared/StatusBadge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STAGES = ['initial_inquiry', 'screening', 'full_application', 'assessment', 'approval_denial', 'enrollment'];

const STAGE_COLORS = {
  initial_inquiry: 'bg-blue-500',
  screening: 'bg-amber-500',
  full_application: 'bg-purple-500',
  assessment: 'bg-cyan-500',
  approval_denial: 'bg-orange-500',
  enrollment: 'bg-emerald-500',
};

export default function PipelineBoard({ participants }) {
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = participants.filter(p => p.stage === stage);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {STAGES.map(stage => (
        <div key={stage} className="space-y-2.5">
          <div className="flex items-center gap-2 px-1">
            <div className={cn("w-2 h-2 rounded-full", STAGE_COLORS[stage])} />
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {STAGE_CONFIG[stage]?.label}
            </h3>
            <span className="ml-auto text-[11px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {grouped[stage].length}
            </span>
          </div>
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {grouped[stage].map(p => (
              <Link key={p.id} to={`/participants/${p.id}`}>
                <Card className="p-3 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {p.first_name} {p.last_name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">{p.email}</p>
                  <div className="flex items-center justify-between mt-2">
                    <StatusBadge status={p.status} />
                    {p.created_date && (
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(p.created_date), 'MMM d')}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
            {grouped[stage].length === 0 && (
              <div className="text-center py-6 text-[11px] text-muted-foreground/50">
                No participants
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}