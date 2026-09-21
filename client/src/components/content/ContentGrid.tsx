import { UnifiedMediaItem } from '../../types';
import { ContentCard } from './ContentCard';
import { Skeleton } from '../ui/Skeleton';
import { Film } from 'lucide-react';

export interface ContentGridProps {
  items: UnifiedMediaItem[];
  isLoading?: boolean;
  onSelect?: (item: UnifiedMediaItem) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export function ContentGrid({
  items,
  isLoading = false,
  onSelect,
  emptyTitle = 'No titles found',
  emptyDescription = 'Try adjusting your filters, mood keywords, or check back later.',
  onEmptyAction,
  emptyActionLabel = 'Reset Filters'
}: ContentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-[#1E2A42] rounded-3xl bg-[#0C1220]/50 my-8">
        <div className="p-4 rounded-full bg-[#172035] border border-[#1E2A42] text-amber-400 mb-4">
          <Film className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{emptyTitle}</h3>
        <p className="text-sm text-[#94A3B8] max-w-md mb-6">{emptyDescription}</p>
        {onEmptyAction && (
          <button
            onClick={onEmptyAction}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {items.map((item) => (
        <ContentCard key={`${item.mediaType}-${item.id}`} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
