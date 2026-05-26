import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowRight, Save } from 'lucide-react';
import { notifyParticipantStageChange, notifyParticipantDecision, notifyCaseworkerAssignment } from '@/lib/notifications';

const STAGES = ['initial_inquiry', 'screening', 'full_application', 'assessment', 'approval_denial', 'enrollment'];

export default function StageActions({ participant, userRole }) {
  const [updates, setUpdates] = useState({});
  const queryClient = useQueryClient();
  const p = participant;
  const currentIdx = STAGES.indexOf(p.stage);
  const canAdvance = currentIdx < STAGES.length - 1;
  const canEdit = ['intake_admin', 'program_director', 'exec_director', 'caseworker'].includes(userRole);

  const set = (field, value) => setUpdates(prev => ({ ...prev, [field]: value }));

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Participant.update(p.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant', p.id] });
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant record updated.');
      setUpdates({});
    },
  });

  const advanceStage = () => {
    const nextStage = STAGES[currentIdx + 1];
    mutation.mutate({ ...updates, stage: nextStage }, {
      onSuccess: () => {
        notifyParticipantStageChange(p, nextStage);
      },
    });
  };

  const saveUpdates = () => {
    if (Object.keys(updates).length === 0) return;
    mutation.mutate(updates, {
      onSuccess: () => {
        // Notify on decision change
        const newDecision = updates.decision;
        if (newDecision && newDecision !== 'pending' && newDecision !== p.decision) {
          notifyParticipantDecision(p, newDecision, updates.decision_notes ?? p.decision_notes);
        }
        // Notify caseworker if newly assigned
        const newCaseworker = updates.assigned_caseworker;
        if (newCaseworker && newCaseworker !== p.assigned_caseworker) {
          notifyCaseworkerAssignment(newCaseworker, { ...p, ...updates });
        }
      },
    });
  };

  if (!canEdit) return null;

  return (
    <Card className="border-0 shadow-sm p-6 space-y-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Stage Actions — {p.stage?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </h3>

      {p.stage === 'screening' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={updates.screening_eligible ?? p.screening_eligible ?? false} onCheckedChange={v => set('screening_eligible', v)} />
            <Label>Eligible</Label>
          </div>
          <div className="space-y-2">
            <Label>Screening Notes</Label>
            <Textarea value={updates.screening_notes ?? p.screening_notes ?? ''} onChange={e => set('screening_notes', e.target.value)} rows={3} />
          </div>
        </div>
      )}

      {p.stage === 'full_application' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Household Size</Label>
              <Input type="number" value={updates.household_size ?? p.household_size ?? ''} onChange={e => set('household_size', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Income Level</Label>
              <Select value={updates.income_level ?? p.income_level ?? ''} onValueChange={v => set('income_level', v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="below_poverty">Below Poverty</SelectItem>
                  <SelectItem value="low_income">Low Income</SelectItem>
                  <SelectItem value="moderate_income">Moderate Income</SelectItem>
                  <SelectItem value="above_moderate">Above Moderate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Employment Status</Label>
              <Select value={updates.employment_status ?? p.employment_status ?? ''} onValueChange={v => set('employment_status', v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {p.stage === 'assessment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assessment Score</Label>
              <Input type="number" value={updates.assessment_score ?? p.assessment_score ?? ''} onChange={e => set('assessment_score', Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select value={updates.priority_level ?? p.priority_level ?? ''} onValueChange={v => set('priority_level', v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Assessment Notes</Label>
            <Textarea value={updates.assessment_notes ?? p.assessment_notes ?? ''} onChange={e => set('assessment_notes', e.target.value)} rows={3} />
          </div>
        </div>
      )}

      {p.stage === 'approval_denial' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Decision</Label>
            <Select value={updates.decision ?? p.decision ?? 'pending'} onValueChange={v => set('decision', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Decision Notes</Label>
            <Textarea value={updates.decision_notes ?? p.decision_notes ?? ''} onChange={e => set('decision_notes', e.target.value)} rows={3} />
          </div>
        </div>
      )}

      {p.stage === 'enrollment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assigned Caseworker</Label>
              <Input value={updates.assigned_caseworker ?? p.assigned_caseworker ?? ''} onChange={e => set('assigned_caseworker', e.target.value)} placeholder="caseworker@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Enrollment Date</Label>
              <Input type="date" value={updates.enrollment_date ?? p.enrollment_date ?? ''} onChange={e => set('enrollment_date', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Status change */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={updates.status ?? p.status ?? 'active'} onValueChange={v => set('status', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>General Notes</Label>
        <Textarea value={updates.notes ?? p.notes ?? ''} onChange={e => set('notes', e.target.value)} rows={3} />
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button variant="outline" onClick={saveUpdates} disabled={mutation.isPending || Object.keys(updates).length === 0} className="gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
        {canAdvance && (
          <Button onClick={advanceStage} disabled={mutation.isPending} className="gap-2">
            Advance to Next Stage <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}