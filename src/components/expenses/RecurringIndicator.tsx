import React from 'react';
import { RefreshCw } from 'lucide-react';

interface RecurringIndicatorProps {
  isRecurring: boolean;
  type: 'monthly' | 'one-time';
}

export function RecurringIndicator({ isRecurring, type }: RecurringIndicatorProps) {
  if (!isRecurring) return null;

  return (
    <div className="flex items-center gap-1 text-emerald-400" title={`${type} expense`}>
      <RefreshCw size={14} />
      <span className="text-xs">{type}</span>
    </div>
  );
}