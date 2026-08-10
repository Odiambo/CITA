'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { cita } from '@/api/citaClient';

export default function NewIntake() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    zip: '',
    education: '',
    referral_source: '',
    program_interest: '',
    notes: '',
    stage: 'initial_inquiry',
    status: 'active',
    decision: 'pending',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const mutation = useMutation({
    mutationFn: (data) => cita.participants.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success(`${form.first_name} ${form.last_name} has been added.`);
      // Send welcome email to participant
      if (form.email) {
        cita.integrations.Core.SendEmail({
          to: form.email,
          subject: 'Your application has been received',
          body: `Dear ${form.first_name},\n\nThank you for submitting your intake application. We have received your information and your application is now in the Initial Inquiry stage.\n\n${form.program_interest ? `Program of Interest: ${form.program_interest}\n\n` : ''}Our team will review your application and reach out to you soon with next steps.\n\nIf you have any questions, please don't hesitate to contact us.\n\nThank you,\nIntake Team`,
        });
      }
      router.push(`/participants/${result.id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Intake</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Start a new participant intake process</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={form.first_name} onChange={e => set('first_name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input value={form.last_name} onChange={e => set('last_name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Referral Source</Label>
              <Select value={form.referral_source} onValueChange={v => set('referral_source', v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="e.g. 90210" />
            </div>
            <div className="space-y-2">
              <Label>Education</Label>
              <Select value={form.education} onValueChange={v => set('education', v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Trades/Licensed">Trades / Licensed</SelectItem>
                  <SelectItem value="Associates">Associates</SelectItem>
                  <SelectItem value="Undergrad">Undergrad</SelectItem>
                  <SelectItem value="Graduate+">Graduate +</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Intake Details</h2>
          <div className="space-y-2">
            <Label>Program of Interest</Label>
            <Select value={form.program_interest} onValueChange={v => set('program_interest', v)}>
              <SelectTrigger><SelectValue placeholder="Select a program..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Strong Start">Strong Start</SelectItem>
                <SelectItem value="Community Shower">Community Shower</SelectItem>
                <SelectItem value="Hygiene Program">Hygiene Program</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Initial Notes</Label>
            <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} placeholder="Any relevant initial notes about this participant..." />
          </div>
        </Card>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="gap-2" disabled={mutation.isPending}>
            <Save className="w-4 h-4" />
            {mutation.isPending ? 'Creating...' : 'Create Participant'}
          </Button>
        </div>
      </form>
    </div>
  );
}
