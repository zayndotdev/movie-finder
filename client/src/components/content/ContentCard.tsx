import * as React from 'react';
import { Heart, Play } from 'lucide-react';
import { UnifiedMediaItem } from '../../types';
import { buildImageUrl, cn, formatYear } from '../../lib/utils';
import { RatingBadge } from './RatingBadge';
import { ContentBadge } from './ContentBadge';
import { useWatchlistStore } from '../../stores/useWatchlistStore';
import { useToast } from '../ui/Toast';

export interface ContentCardProps {
  item: UnifiedMediaItem;
  onSelect?: (item: UnifiedMediaItem) => void;
  className?: string;
  showAiReason?: boolean;
}

export function ContentCard({
  item,
  onSelect,
  className,
  showAiReason = true
}: ContentCardProps) {
  const { isInWatchlist, addItem, removeItem } = useWatchlistStore();
  const { addToast } = useToast();
  const isSaved = isInWatchlist(item.id, item.mediaType);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeItem(item.id, item.mediaType);
      addToast({
        title: 'Removed from Watchlist',
        description: `${item.title} has been removed.`,
        type: 'info'
      });
    } else {
      addItem(item, 'want_to_watch');
      addToast({
        title: 'Added to Watchlist',
        description: `${item.title} saved to your watchlist.`,
        type: 'success'
      });
    }
  };

  return (
    <div
      onClick={() => onSelect?.(item)}
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-[#111828] border border-[#1E2A42] hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5',
        item.adult && 'hover:border-red-500/50 hover:shadow-red-500/10',
        className
      )}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0C1220]">
        <img
          src={buildImageUrl(item.posterPath, 'w500', 'poster')}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111828] via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <RatingBadge rating={item.voteAverage} />
        </div>

        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <ContentBadge type={item.mediaType} adult={item.adult} />
          
          {/* Quick Watchlist Heart Button */}
          <button
            type="button"
            onClick={handleWatchlistClick}
            aria-label={isSaved ? 'Remove from watchlist' : 'Add to watchlist'}
            className={cn(
              'p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer',
              isSaved
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-black/50 text-[#94A3B8] border-white/10 hover:text-rose-400 hover:scale-110'
            )}
          >
            <Heart className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </button>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="h-3.5 w-3.5 fill-current" />
            Explore
          </div>
        </div>
      </div>

      {/* Media Metadata */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-amber-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <span className="text-xs text-[#64748B] shrink-0 font-medium">
            {formatYear(item.releaseDate)}
          </span>
        </div>

        {/* Genres */}
        <p className="text-xs text-[#94A3B8] line-clamp-1 mb-2">
          {item.genreNames.slice(0, 3).join(' • ') || 'General'}
        </p>

        {/* AI Reason pill if present */}
        {showAiReason && item.aiReason && (
          <div className="mt-auto pt-2 border-t border-[#1E2A42]/60">
            <p className="text-[11px] text-amber-300/90 italic line-clamp-2 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
              ✨ {item.aiReason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
