import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
  { key: 'initial_inquiry', label: 'Initial Inquiry' },
  { key: 'screening', label: 'Screening' },
  { key: 'full_application', label: 'Full Application' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'approval_denial', label: 'Approval / Denial' },
  { key: 'enrollment', label: 'Enrollment' },
];

export default function StageTimeline({ currentStage }) {
  const currentIndex = Math.max(0, STAGES.findIndex((stage) => stage.key === currentStage));

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-[680px] items-start">
        {STAGES.map((stage, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={stage.key} className="flex flex-1 items-start">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold',
                    isComplete && 'border-primary bg-primary text-primary-foreground',
                    isCurrent && 'border-primary bg-background text-primary',
                    !isComplete && !isCurrent && 'border-border bg-muted text-muted-foreground'
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'max-w-[92px] text-center text-xs font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'mt-4 h-0.5 flex-1',
                    index < currentIndex ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
