import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

const LABELS = {
  referral_source: { self: 'Self', agency: 'Agency', community: 'Community', healthcare: 'Healthcare', legal: 'Legal', other: 'Other' },
  income_level: { below_poverty: 'Below Poverty', low_income: 'Low Income', moderate_income: 'Moderate', above_moderate: 'Above Moderate' },
  employment_status: { employed: 'Employed', unemployed: 'Unemployed', part_time: 'Part Time', self_employed: 'Self Employed', retired: 'Retired', disabled: 'Disabled' },
  priority_level: { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' },
  decision: { pending: 'Pending', approved: 'Approved', denied: 'Denied' },
};

export default function ParticipantInfo({ participant }) {
  const p = participant;

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Date of Birth" value={p.date_of_birth ? format(new Date(p.date_of_birth), 'MMM d, yyyy') : null} />
          <InfoRow label="Referral Source" value={LABELS.referral_source[p.referral_source]} />
          <InfoRow label="Program Interest" value={p.program_interest} />
          <InfoRow label="Zip Code" value={p.zip} />
          <InfoRow label="Created" value={p.created_date ? format(new Date(p.created_date), 'MMM d, yyyy') : null} />
        </div>
      </Card>

      {(p.household_size || p.income_level || p.employment_status) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Application Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Household Size" value={p.household_size} />
            <InfoRow label="Income Level" value={LABELS.income_level[p.income_level]} />
            <InfoRow label="Employment" value={LABELS.employment_status[p.employment_status]} />
          </div>
        </Card>
      )}

      {(p.assessment_score || p.priority_level || p.assessment_notes) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assessment</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Score" value={p.assessment_score} />
            <InfoRow label="Priority" value={LABELS.priority_level[p.priority_level]} />
          </div>
          {p.assessment_notes && <InfoRow label="Notes" value={p.assessment_notes} />}
        </Card>
      )}

      {(p.decision !== 'pending' || p.decision_notes) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Decision</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Decision" value={LABELS.decision[p.decision]} />
            <InfoRow label="Decision Date" value={p.decision_date ? format(new Date(p.decision_date), 'MMM d, yyyy') : null} />
          </div>
          {p.decision_notes && <InfoRow label="Notes" value={p.decision_notes} />}
        </Card>
      )}

      {(p.assigned_caseworker || p.enrollment_date) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Enrollment</h3>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Caseworker" value={p.assigned_caseworker} />
            <InfoRow label="Enrollment Date" value={p.enrollment_date ? format(new Date(p.enrollment_date), 'MMM d, yyyy') : null} />
          </div>
        </Card>
      )}

      {(p.screening_notes || p.notes) && (
        <Card className="border-0 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notes</h3>
          {p.screening_notes && <InfoRow label="Screening Notes" value={p.screening_notes} />}
          {p.notes && <InfoRow label="General Notes" value={p.notes} />}
        </Card>
      )}
    </div>
  );
}