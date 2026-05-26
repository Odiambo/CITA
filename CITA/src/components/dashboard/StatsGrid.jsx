import React from 'react';
import { Card } from '@/components/ui/card';

const TotalIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="40" height="40" rx="12" fill="url(#g1)" />
    <circle cx="15" cy="16" r="4" fill="white" fillOpacity="0.9" />
    <circle cx="25" cy="16" r="4" fill="white" fillOpacity="0.6" />
    <path d="M7 28c0-4 3.6-6 8-6s8 2 8 6" stroke="white" strokeWidth="2" strokeLinecap="round" fillOpacity="0.9" />
    <path d="M25 22c2.8.3 6 1.8 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
  </svg>
);

const ActiveIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="40" height="40" rx="12" fill="url(#g2)" />
    <circle cx="20" cy="20" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
    <path d="M20 13v7l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

const ApprovedIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="40" height="40" rx="12" fill="url(#g3)" />
    <circle cx="20" cy="18" r="5" fill="white" fillOpacity="0.9" />
    <path d="M11 30c0-5 4-8 9-8s9 3 9 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 18l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="g3" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981" />
        <stop offset="1" stopColor="#34d399" />
      </linearGradient>
    </defs>
  </svg>
);

const EnrollmentIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect width="40" height="40" rx="12" fill="url(#g4)" />
    <polyline points="10,28 18,18 24,23 32,12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="27,12 32,12 32,17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="g4" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
);

export default function StatsGrid({ participants }) {
  const stats = [
    {
      label: 'Total Participants',
      value: participants.length,
      icon: <TotalIcon />,
    },
    {
      label: 'Active Cases',
      value: participants.filter(p => p.status === 'active').length,
      icon: <ActiveIcon />,
    },
    {
      label: 'Approved',
      value: participants.filter(p => p.decision === 'approved').length,
      icon: <ApprovedIcon />,
    },
    {
      label: 'Enrolled',
      value: participants.filter(p => p.stage === 'enrollment').length,
      icon: <EnrollmentIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(stat => (
        <Card key={stat.label} className="p-5 border-0 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold mt-1.5">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        </Card>
      ))}
    </div>
  );
}