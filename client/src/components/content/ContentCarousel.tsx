import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedMediaItem } from '../../types';
import { ContentCard } from './ContentCard';
import { Skeleton } from '../ui/Skeleton';

export interface ContentCarouselProps {
  title: string;
  subtitle?: string;
  items: UnifiedMediaItem[];
  isLoading?: boolean;
  onSelect?: (item: UnifiedMediaItem) => void;
  actionText?: string;
  onActionClick?: () => void;
}

export function ContentCarousel({
  title,
  subtitle,
  items,
  isLoading = false,
  onSelect,
  actionText,
  onActionClick
}: ContentCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 relative group/section">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#F8FAFC]">
            {title}
          </h2>
          {subtitle && <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {actionText && onActionClick && (
            <button
              onClick={onActionClick}
              className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors mr-2 cursor-pointer"
            >
              {actionText} →
            </button>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-xl bg-[#111828] border border-[#1E2A42] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-amber-500/40 transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-xl bg-[#111828] border border-[#1E2A42] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-amber-500/40 transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 px-1 scroll-smooth"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-[170px] sm:min-w-[210px] shrink-0">
              <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
            </div>
          ))
        ) : (
          items.map((item) => (
            <div key={`${item.mediaType}-${item.id}`} className="min-w-[170px] sm:min-w-[210px] shrink-0">
              <ContentCard item={item} onSelect={onSelect} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
