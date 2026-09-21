import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export function RatingBadge({
  rating,
  className,
  showStar = true
}: {
  rating: number;
  className?: string;
  showStar?: boolean;
}) {
  const getRatingColor = (score: number) => {
    if (score >= 8.0) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    if (score >= 7.0) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (score >= 6.0) return 'text-blue-400 bg-blue-500/15 border-blue-500/30';
    return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border backdrop-blur-md',
        getRatingColor(rating),
        className
      )}
    >
      {showStar && <Star className="h-3 w-3 fill-current" />}
      <span>{rating ? rating.toFixed(1) : 'NR'}</span>
    </div>
  );
}
