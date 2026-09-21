import * as React from 'react';
import { FilterPanel } from '../components/search/FilterPanel';
import { ContentGrid } from '../components/content/ContentGrid';
import { useFilterStore } from '../stores/useFilterStore';
import { useAdultStore } from '../stores/useAdultStore';
import { fetchDiscover } from '../services/api';
import { UnifiedMediaItem } from '../types';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GENRE_OPTIONS } from '../components/search/FilterPanel';

export interface DiscoverPageProps {
  onSelectMedia: (item: UnifiedMediaItem) => void;
}

export function DiscoverPage({ onSelectMedia }: DiscoverPageProps) {
  const {
    contentType,
    selectedGenres,
    ratingRange,
    yearRange,
    selectedLanguage,
    sortBy,
    page,
    searchQuery,
    setPage,
    toggleGenre,
    resetFilters
  } = useFilterStore();

  const adultMode = useAdultStore((s) => s.adultMode);

  const [items, setItems] = React.useState<UnifiedMediaItem[]>([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDiscoverData = async () => {
      try {
        const res = await fetchDiscover({
          type: contentType,
          genres: selectedGenres,
          minRating: ratingRange[0] > 0 ? ratingRange[0] : undefined,
          yearFrom: yearRange[0] > 1970 ? yearRange[0] : undefined,
          yearTo: yearRange[1] < 2026 ? yearRange[1] : undefined,
          language: selectedLanguage,
          sortBy,
          adult: adultMode,
          page
        });

        if (isMounted) {
          setItems(res.data || []);
          setTotalPages(res.meta?.totalPages || 1);
          setTotalResults(res.meta?.totalResults || (res.data ? res.data.length : 0));
        }
      } catch (err) {
        console.error('Discover load error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDiscoverData();
    return () => {
      isMounted = false;
    };
  }, [contentType, selectedGenres, ratingRange, yearRange, selectedLanguage, sortBy, adultMode, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1E2A42]">
        <div>
          <h1 className="text-3xl font-black text-[#F8FAFC]">
            {adultMode ? '🔞 Adult & Uncensored Discover' : 'Deep Content Discover'}
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            {totalResults > 0 ? `${totalResults} titles found matching your criteria` : 'Search across all international cinema and TV series'}
          </p>
        </div>

        {/* Mobile Filter Trigger */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111828] border border-[#1E2A42] text-[#F8FAFC] text-sm font-semibold hover:border-amber-500/40 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Options'}</span>
        </button>
      </div>

      {/* Active Filter Chips */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-[#64748B] font-semibold">Active:</span>
          {selectedGenres.map((id) => {
            const g = GENRE_OPTIONS.find((opt) => opt.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold"
              >
                {g?.name || id}
                <button
                  onClick={() => toggleGenre(id)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Main Layout: Sidebar on Desktop + Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <FilterPanel />
          </div>
        </div>

        {/* Mobile Filter Panel (Collapsible) */}
        {mobileFilterOpen && (
          <div className="lg:hidden col-span-1 mb-6">
            <FilterPanel />
          </div>
        )}

        {/* Results Column */}
        <div className="lg:col-span-3 flex flex-col">
          <ContentGrid
            items={items}
            isLoading={loading}
            onSelect={onSelectMedia}
            onEmptyAction={resetFilters}
            emptyActionLabel="Reset All Filters"
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12 pt-6 border-t border-[#1E2A42]">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111828] border border-[#1E2A42] text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <span className="text-xs font-bold text-[#F8FAFC]">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111828] border border-[#1E2A42] text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
