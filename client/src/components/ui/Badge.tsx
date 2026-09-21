import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'amber' | 'blue' | 'red' | 'outline' | 'surface';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#172035] text-[#94A3B8] border border-[#1E2A42]',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold',
    red: 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold tracking-wider',
    outline: 'border border-[#334155] text-[#94A3B8]',
    surface: 'bg-[#111828]/80 backdrop-blur-md text-[#F8FAFC] border border-[#1E2A42]'
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-colors focus:outline-none select-none',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
