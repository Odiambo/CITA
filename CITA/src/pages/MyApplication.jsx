import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import StageTimeline from '../components/participant/StageTimeline';
import StageBadge from '../components/shared/StageBadge';
import StatusBadge from '../components/shared/StatusBadge';
import { ClipboardList, Info, BookOpen, BarChart2, FileEdit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const STAGE_DESCRIPTIONS = {
  initial_inquiry: 'Your inquiry has been received. Our team will begin the screening process shortly.',
  screening: 'We are reviewing your eligibility. You may be contacted for additional information.',
  full_application: 'Please complete your full application below. Ensure all required details are filled in.',
  assessment: 'Your needs are being evaluated by our assessment team.',
  approval_denial: 'Your application is under final review for approval.',
  enrollment: 'Congratulations! You have been enrolled in the program.',
};

const PROGRAM_DESCRIPTIONS = {
  'Strong Start': 'A foundational support program providing resources and skill-building for participants entering stable housing and employment.',
  'Community Shower': 'Provides safe, accessible shower facilities and hygiene resources to community members in need.',
  'Hygiene Program': 'Distributes essential hygiene kits and personal care products to individuals experiencing hardship.',
};

export default function MyApplication() {
  const { user } = useOutletContext();
  const queryClient = useQueryClient();
  const [showFullAppForm, setShowFullAppForm] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: myRecords = [], isLoading } = useQuery({
    queryKey: ['my-application', user?.email],
    queryFn: () => base44.entities.Participant.filter({ email: user?.email }),
    enabled: !!user?.email,
  });

  const application = myRecords[0];

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Participant.update(application.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-application', user?.email] });
      toast.success('Application updated successfully.');
      setShowFullAppForm(false);
    },
  });

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmitFullApp = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-sm p-12 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold">No Application Found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We don't have an application on file for your email ({user?.email}).
            Please contact an intake administrator for assistance.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Application</h1>
        <p className="text-sm text-muted-foreground mt-1">Track the status of your intake application</p>
      </div>

      {/* Stage Timeline */}
      <Card className="border-0 shadow-sm p-6">
        <StageTimeline currentStage={application.stage} />
      </Card>

      {/* Current Status */}
      <Card className="border-0 shadow-sm p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Current Stage</h3>
            <div className="flex items-center gap-2 mt-1">
              <StageBadge stage={application.stage} />
              <StatusBadge status={application.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {STAGE_DESCRIPTIONS[application.stage]}
            </p>
          </div>
        </div>
      </Card>

      {/* Program Information */}
      {application.program_interest && (
        <Card className="border-0 shadow-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Program Information</h3>
          </div>
          <p className="text-base font-semibold">{application.program_interest}</p>
          {PROGRAM_DESCRIPTIONS[application.program_interest] && (
            <p className="text-sm text-muted-foreground">{PROGRAM_DESCRIPTIONS[application.program_interest]}</p>
          )}
        </Card>
      )}

      {/* Assessment Entries (if available) */}
      {(application.assessment_score || application.priority_level || application.assessment_notes) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assessment</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {application.assessment_score && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Score</p>
                <p className="text-sm font-medium mt-0.5">{application.assessment_score}</p>
              </div>
            )}
            {application.priority_level && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Priority</p>
                <p className="text-sm font-medium mt-0.5 capitalize">{application.priority_level}</p>
              </div>
            )}
          </div>
          {application.assessment_notes && (
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Notes</p>
              <p className="text-sm mt-0.5">{application.assessment_notes}</p>
            </div>
          )}
        </Card>
      )}

      {/* Full Application Form — shown when participant is at full_application stage */}
      {application.stage === 'full_application' && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Complete Full Application</h3>
            </div>
            {!showFullAppForm && (
              <Button size="sm" onClick={() => {
                setFormData({
                  household_size: application.household_size || '',
                  income_level: application.income_level || '',
                  employment_status: application.employment_status || '',
                  address: application.address || '',
                  zip: application.zip || '',
                });
                setShowFullAppForm(true);
              }}>
                Fill Out Form
              </Button>
            )}
          </div>

          {showFullAppForm && (
            <form onSubmit={handleSubmitFullApp} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Household Size</Label>
                  <Input type="number" value={formData.household_size} onChange={e => set('household_size', Number(e.target.value))} min={1} />
                </div>
                <div className="space-y-2">
                  <Label>Income Level</Label>
                  <Select value={formData.income_level} onValueChange={v => set('income_level', v)}>
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
                  <Select value={formData.employment_status} onValueChange={v => set('employment_status', v)}>
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
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input value={formData.zip} onChange={e => set('zip', e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Submitting…' : 'Submit Application'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFullAppForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {!showFullAppForm && application.household_size && (
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Household Size</p>
                <p className="text-sm font-medium mt-0.5">{application.household_size}</p>
              </div>
              {application.income_level && (
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Income Level</p>
                  <p className="text-sm font-medium mt-0.5 capitalize">{application.income_level.replace(/_/g, ' ')}</p>
                </div>
              )}
              {application.employment_status && (
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Employment</p>
                  <p className="text-sm font-medium mt-0.5 capitalize">{application.employment_status.replace(/_/g, ' ')}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Application Summary */}
      <Card className="border-0 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Application Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Name</p>
            <p className="text-sm font-medium mt-0.5">{application.first_name} {application.last_name}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Submitted</p>
            <p className="text-sm font-medium mt-0.5">
              {application.created_date ? format(new Date(application.created_date), 'MMM d, yyyy') : '—'}
            </p>
          </div>
          {application.decision && application.decision !== 'pending' && (
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Decision</p>
              <p className="text-sm font-medium mt-0.5 capitalize">{application.decision}</p>
            </div>
          )}
          {application.assigned_caseworker && (
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Caseworker</p>
              <p className="text-sm font-medium mt-0.5">{application.assigned_caseworker}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}