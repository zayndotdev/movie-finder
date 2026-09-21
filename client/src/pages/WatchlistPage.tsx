import * as React from 'react';
import { Heart, CheckCircle2, Bookmark, Trash2, Film, Tv } from 'lucide-react';
import { useWatchlistStore, WatchlistStatus } from '../stores/useWatchlistStore';
import { ContentCard } from '../components/content/ContentCard';
import { UnifiedMediaItem } from '../types';

export interface WatchlistPageProps {
  onSelectMedia: (item: UnifiedMediaItem) => void;
  onNavigate: (tab: string) => void;
}

export function WatchlistPage({ onSelectMedia, onNavigate }: WatchlistPageProps) {
  const { items, clearWatchlist } = useWatchlistStore();
  const [activeTab, setActiveTab] = React.useState<WatchlistStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'movie' | 'tv'>('all');

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;
    const matchesType = typeFilter === 'all' || item.mediaType === typeFilter;
    return matchesTab && matchesType;
  });

  const wantCount = items.filter((i) => i.status === 'want_to_watch').length;
  const watchedCount = items.filter((i) => i.status === 'watched').length;
  const favCount = items.filter((i) => i.status === 'favorite').length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1E2A42]">
        <div>
          <h1 className="text-3xl font-black text-[#F8FAFC]">My Watchlist</h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Keep track of titles you want to experience, have watched, or love
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                clearWatchlist();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Controls Bar: Category Tabs + Type Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#111828] rounded-2xl border border-[#1E2A42]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('want_to_watch')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'want_to_watch' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Want to Watch ({wantCount})
          </button>
          <button
            onClick={() => setActiveTab('watched')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'watched' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Watched ({watchedCount})
          </button>
          <button
            onClick={() => setActiveTab('favorite')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'favorite' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            Favorites ({favCount})
          </button>
        </div>

        {/* Content Type Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#111828] rounded-xl border border-[#1E2A42] self-start sm:self-auto">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'all' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('movie')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'movie' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Film className="h-3 w-3" />
            Movies
          </button>
          <button
            onClick={() => setTypeFilter('tv')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              typeFilter === 'tv' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Tv className="h-3 w-3" />
            TV Shows
          </button>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const mediaItem: UnifiedMediaItem = {
              id: item.id,
              mediaType: item.mediaType,
              title: item.title,
              originalTitle: item.title,
              overview: '',
              posterPath: item.posterPath,
              backdropPath: null,
              releaseDate: item.releaseYear ? `${item.releaseYear}-01-01` : null,
              releaseYear: item.releaseYear,
              voteAverage: item.voteAverage,
              voteCount: 0,
              genreIds: [],
              genreNames: item.genres,
              originalLanguage: 'en',
              popularity: 0,
              adult: false
            };

            return (
              <ContentCard
                key={`${item.mediaType}-${item.id}`}
                item={mediaItem}
                onSelect={onSelectMedia}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-[#1E2A42] rounded-3xl bg-[#0C1220]/40 my-8">
          <div className="p-4 rounded-full bg-[#172035] text-rose-400 mb-4 border border-[#1E2A42]">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Your watchlist is waiting</h3>
          <p className="text-sm text-[#94A3B8] max-w-sm mb-6">
            Click the heart button on any movie or TV series card to save it for your next watch session.
          </p>
          <button
            onClick={() => onNavigate('discover')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Start Discovering
          </button>
        </div>
      )}
    </div>
  );
}
