import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { STAGE_CONFIG } from '../shared/StageBadge';

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#10b981'];
const STAGES = ['initial_inquiry', 'screening', 'full_application', 'assessment', 'approval_denial', 'enrollment'];

export default function StageChart({ participants }) {
  const data = STAGES.map((stage, i) => ({
    name: STAGE_CONFIG[stage]?.label?.split(' ')[0] || stage,
    count: participants.filter(p => p.stage === stage).length,
    color: COLORS[i],
  }));

  return (
    <Card className="border-0 shadow-sm p-5">
      <h3 className="text-sm font-semibold mb-4">Pipeline Distribution</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
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
