'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function ParticipantCalendar() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground mt-1">Your upcoming appointments and important dates</p>
      </div>

      <Card className="border-0 shadow-sm p-12 text-center">
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold">No Appointments Scheduled</h2>
        <p className="text-sm text-muted-foreground mt-2">
          When appointments are scheduled, they will appear here.
          Please contact your caseworker for scheduling assistance.
        </p>
      </Card>
    </div>
  );
}
