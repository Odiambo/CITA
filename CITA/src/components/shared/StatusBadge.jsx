import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  denied: { label: 'Denied', color: 'bg-red-50 text-red-700 border-red-200' },
  withdrawn: { label: 'Withdrawn', color: 'bg-slate-50 text-slate-500 border-slate-200' },
  on_hold: { label: 'On Hold', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export default function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-muted text-muted-foreground' };
  return (
    <Badge variant="outline" className={cn("font-medium text-[11px] px-2.5 py-0.5", config.color, className)}>
      {config.label}
    </Badge>
  );
}
