import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Users, Shield } from 'lucide-react';

const ROLE_LABELS = {
  intake_admin: 'Intake Admin',
  program_director: 'Program Director',
  exec_director: 'Exec. Director',
  caseworker: 'Caseworker',
  viewer: 'Viewer',
  participant: 'Participant',
};

const ROLE_COLORS = {
  intake_admin: 'bg-purple-100 text-purple-700',
  program_director: 'bg-blue-100 text-blue-700',
  exec_director: 'bg-indigo-100 text-indigo-700',
  caseworker: 'bg-teal-100 text-teal-700',
  viewer: 'bg-slate-100 text-slate-600',
  participant: 'bg-green-100 text-green-700',
};

export default function UserLogs() {
  const { user } = useOutletContext();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list('-created_date', 200),
  });

  const adminRoles = ['intake_admin', 'program_director', 'exec_director'];
  if (!adminRoles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">All registered users and their roles</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{users.length} users</span>
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">User</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3">Joined</div>
            </div>
            {users.length === 0 ? (
              <div className="px-6 py-12 text-center text-muted-foreground text-sm">No users found.</div>
            ) : (
              users.map(u => (
                <div key={u.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {(u.full_name || u.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium truncate">{u.full_name || '—'}</span>
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground truncate">{u.email}</div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'}`}>
                      <Shield className="w-3 h-3" />
                      {ROLE_LABELS[u.role] || u.role || 'Unknown'}
                    </span>
                  </div>
                  <div className="col-span-3 text-sm text-muted-foreground">
                    {u.created_date ? format(new Date(u.created_date), 'MMM d, yyyy') : '—'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}