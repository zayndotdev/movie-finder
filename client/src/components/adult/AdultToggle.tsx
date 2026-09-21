import { ShieldAlert } from 'lucide-react';
import { Switch } from '../ui/Switch';
import { useAdultStore } from '../../stores/useAdultStore';
import { cn } from '../../lib/utils';

export function AdultToggle({ className }: { className?: string }) {
  const { adultMode, toggleAdultMode } = useAdultStore();

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300',
        adultMode
          ? 'bg-red-950/40 border-red-500/50 glow-red'
          : 'bg-[#111828] border-[#1E2A42] hover:border-[#334155]',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <ShieldAlert className={cn('h-4 w-4 transition-colors', adultMode ? 'text-red-400 animate-pulse' : 'text-[#64748B]')} />
        <span className={cn('text-xs font-bold tracking-wider select-none', adultMode ? 'text-red-300' : 'text-[#94A3B8]')}>
          18+
        </span>
      </div>

      <Switch
        checked={adultMode}
        onCheckedChange={toggleAdultMode}
        accentColor="red"
        aria-label="Toggle 18+ adult content"
      />
    </div>
  );
}
