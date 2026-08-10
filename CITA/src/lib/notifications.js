import { cita } from '@/api/citaClient';

const STAGE_LABELS = {
  initial_inquiry: 'Initial Inquiry',
  screening: 'Screening',
  full_application: 'Full Application',
  assessment: 'Assessment',
  approval_denial: 'Approval / Denial',
  enrollment: 'Enrollment',
};

export async function notifyParticipantStageChange(participant, newStage) {
  if (!participant.email) return;
  const stageName = STAGE_LABELS[newStage] || newStage;
  await cita.integrations.Core.SendEmail({
    to: participant.email,
    subject: `Your application has moved to: ${stageName}`,
    body: `Dear ${participant.first_name},\n\nWe wanted to let you know that your application has been updated.\n\nCurrent Stage: ${stageName}\n\nOur team will be in touch with any next steps. If you have questions, please contact us.\n\nThank you,\nIntake Team`,
  });
}

export async function notifyParticipantDecision(participant, decision, decisionNotes) {
  if (!participant.email) return;
  const isApproved = decision === 'approved';
  const subject = isApproved
    ? 'Congratulations! Your application has been approved'
    : 'Update on your application status';
  const body = isApproved
    ? `Dear ${participant.first_name},\n\nWe are pleased to inform you that your application has been APPROVED.\n\n${decisionNotes ? `Notes: ${decisionNotes}\n\n` : ''}Our team will contact you shortly with enrollment details.\n\nThank you,\nIntake Team`
    : `Dear ${participant.first_name},\n\nThank you for your application. After careful review, we are unable to approve your application at this time.\n\n${decisionNotes ? `Notes: ${decisionNotes}\n\n` : ''}If you believe this decision is in error or your circumstances have changed, please contact us.\n\nThank you,\nIntake Team`;

  await cita.integrations.Core.SendEmail({
    to: participant.email,
    subject,
    body,
  });
}

export async function notifyCaseworkerAssignment(caseworkerEmail, participant) {
  if (!caseworkerEmail) return;
  await cita.integrations.Core.SendEmail({
    to: caseworkerEmail,
    subject: `New participant assigned to you: ${participant.first_name} ${participant.last_name}`,
    body: `Hello,\n\nA new participant has been assigned to your caseload.\n\nParticipant: ${participant.first_name} ${participant.last_name}\nEmail: ${participant.email}\nPhone: ${participant.phone || 'N/A'}\nProgram of Interest: ${participant.program_interest || 'N/A'}\nPriority: ${participant.priority_level || 'N/A'}\n\nPlease log in to the system to review their full profile and begin enrollment.\n\nThank you,\nIntake System`,
  });
}