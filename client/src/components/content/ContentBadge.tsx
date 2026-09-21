import { Film, Tv, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ContentBadge({
  type,
  adult = false,
  className
}: {
  type: 'movie' | 'tv';
  adult?: boolean;
  className?: string;
}) {
  if (adult) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 backdrop-blur-md',
          className
        )}
      >
        <ShieldAlert className="h-3 w-3" />
        18+
      </span>
    );
  }

  if (type === 'tv') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40 backdrop-blur-md',
          className
        )}
      >
        <Tv className="h-3 w-3" />
        TV
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 backdrop-blur-md',
        className
      )}
    >
      <Film className="h-3 w-3" />
      Movie
    </span>
  );
}

export function GenreTag({
  name,
  className,
  onClick,
  active = false
}: {
  name: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium border transition-all duration-200 select-none',
        onClick ? 'cursor-pointer' : 'cursor-default',
        active
          ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold'
          : 'bg-[#172035]/70 text-[#94A3B8] border-[#1E2A42] hover:border-amber-500/40 hover:text-[#F8FAFC]',
        className
      )}
    >
      {name}
    </button>
  );
}
