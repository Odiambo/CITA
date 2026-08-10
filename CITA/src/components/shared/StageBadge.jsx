import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STAGE_CONFIG = {
  initial_inquiry: { label: 'Initial Inquiry', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  screening: { label: 'Screening', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  full_application: { label: 'Full Application', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  assessment: { label: 'Assessment', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  approval_denial: { label: 'Approval / Denial', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  enrollment: { label: 'Enrolled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function StageBadge({ stage, className }) {
  const config = STAGE_CONFIG[stage] || { label: stage, color: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={cn("font-medium text-[11px] px-2.5 py-0.5", config.color, className)}>
      {config.label}
    </Badge>
  );
}

export { STAGE_CONFIG };