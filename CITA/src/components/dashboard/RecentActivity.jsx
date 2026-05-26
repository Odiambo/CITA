import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import StageBadge from '../shared/StageBadge';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export default function RecentActivity({ participants }) {
  const recent = [...participants]
    .sort((a, b) => new Date(b.updated_date || b.created_date) - new Date(a.updated_date || a.created_date))
    .slice(0, 8);

  return (
    <Card className="border-0 shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {recent.map(p => (
          <Link
            key={p.id}
            to={`/participants/${p.id}`}
            className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-accent-foreground">
                  {p.first_name?.[0]}{p.last_name?.[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.first_name} {p.last_name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {format(new Date(p.updated_date || p.created_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StageBadge stage={p.stage} />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
        {recent.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">No participants yet</div>
        )}
      </div>
    </Card>
  );
}