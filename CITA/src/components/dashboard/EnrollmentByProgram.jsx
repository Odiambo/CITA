import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4'];

export default function EnrollmentByProgram({ participants }) {
  // Get unique programs
  const programs = [...new Set(participants.map(p => p.program_interest).filter(Boolean))];

  if (programs.length === 0) {
    return (
      <Card className="border-0 shadow-sm p-5">
        <h3 className="text-sm font-semibold mb-4">Enrollment Rate by Program</h3>
        <p className="text-sm text-muted-foreground text-center py-8">No program data available.</p>
      </Card>
    );
  }

  const data = programs.map((program, i) => {
    const programParticipants = participants.filter(p => p.program_interest === program);
    const enrolled = programParticipants.filter(p => p.stage === 'enrollment').length;
    const rate = programParticipants.length > 0
      ? Math.round((enrolled / programParticipants.length) * 100)
      : 0;
    return {
      name: program,
      total: programParticipants.length,
      enrolled,
      rate,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <Card className="border-0 shadow-sm p-5">
      <h3 className="text-sm font-semibold mb-1">Participants by Program</h3>
      <p className="text-xs text-muted-foreground mb-4">Total number of participants per program</p>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              formatter={(value) => [value, 'Participants']}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}