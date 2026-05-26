import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import StageBadge from '../components/shared/StageBadge';
import StatusBadge from '../components/shared/StatusBadge';
import { Search, UserPlus, ArrowUpDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Participants() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_date');
  const [sortDir, setSortDir] = useState(-1);
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkCaseworker, setBulkCaseworker] = useState('');

  const queryClient = useQueryClient();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ['participants'],
    queryFn: () => base44.entities.Participant.list('-created_date', 500),
  });

  const filtered = useMemo(() => {
    let result = [...participants];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q)
      );
    }
    if (stageFilter !== 'all') result = result.filter(p => p.stage === stageFilter);
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    result.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      return sortDir * (aVal > bVal ? 1 : aVal < bVal ? -1 : 0);
    });
    return result;
  }, [participants, search, stageFilter, statusFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d * -1);
    else { setSortField(field); setSortDir(-1); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setBulkStatus('');
    setBulkCaseworker('');
  };

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, data }) => {
      await Promise.all(ids.map(id => base44.entities.Participant.update(id, data)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success(`Updated ${selected.size} participants.`);
      clearSelection();
    },
  });

  const applyBulkUpdate = () => {
    const data = {};
    if (bulkStatus) data.status = bulkStatus;
    if (bulkCaseworker.trim()) data.assigned_caseworker = bulkCaseworker.trim();
    if (!Object.keys(data).length) return;
    bulkUpdateMutation.mutate({ ids: [...selected], data });
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Participants</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} participants found</p>
        </div>
        <Link to="/intake/new" className="shrink-0">
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Intake</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm p-4">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="initial_inquiry">Initial Inquiry</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="full_application">Full Application</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="approval_denial">Approval / Denial</SelectItem>
                <SelectItem value="enrollment">Enrolled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <Card className="border-0 shadow-sm p-4 bg-primary/5 border-l-4 border-primary">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-sm font-medium text-primary shrink-0">{selected.size} selected</span>
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Set status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Reassign caseworker (email)..."
                value={bulkCaseworker}
                onChange={e => setBulkCaseworker(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={applyBulkUpdate}
                disabled={bulkUpdateMutation.isPending || (!bulkStatus && !bulkCaseworker.trim())}
              >
                {bulkUpdateMutation.isPending ? 'Updating...' : 'Apply'}
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Table — hidden on mobile, shown on md+ */}
      <Card className="border-0 shadow-sm overflow-hidden hidden md:block">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 rounded" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead onClick={() => toggleSort('last_name')} className="cursor-pointer">
                    <span className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></span>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead onClick={() => toggleSort('created_date')} className="cursor-pointer hidden lg:table-cell">
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow
                    key={p.id}
                    className={`hover:bg-muted/30 cursor-pointer ${selected.has(p.id) ? 'bg-primary/5' : ''}`}
                  >
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                        aria-label={`Select ${p.first_name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium" onClick={() => window.location.href = `/participants/${p.id}`}>{p.first_name} {p.last_name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm" onClick={() => window.location.href = `/participants/${p.id}`}>{p.email}</TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden lg:table-cell" onClick={() => window.location.href = `/participants/${p.id}`}>{p.phone || '—'}</TableCell>
                    <TableCell onClick={() => window.location.href = `/participants/${p.id}`}><StageBadge stage={p.stage} /></TableCell>
                    <TableCell onClick={() => window.location.href = `/participants/${p.id}`}><StatusBadge status={p.status} /></TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden lg:table-cell" onClick={() => window.location.href = `/participants/${p.id}`}>
                      {p.created_date ? format(new Date(p.created_date), 'MMM d, yyyy') : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No participants found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Card list — shown on mobile only */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-sm p-8 text-center text-muted-foreground">
            No participants found
          </Card>
        ) : (
          filtered.map(p => (
            <Card
              key={p.id}
              className={`border-0 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${selected.has(p.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selected.has(p.id)}
                  onCheckedChange={() => toggleSelect(p.id)}
                  onClick={e => e.stopPropagation()}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0" onClick={() => window.location.href = `/participants/${p.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.first_name} {p.last_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{p.email}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <StageBadge stage={p.stage} />
                    {p.created_date && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(p.created_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}