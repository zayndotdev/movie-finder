import * as React from 'react';
import { Flame, Film, Tv, Calendar, Star, Sparkles } from 'lucide-react';
import {
  fetchTrendingMovies,
  fetchTrendingTV,
  fetchNowPlayingMovies,
  fetchAiringTodayTV,
  fetchTopRatedMovies,
  fetchTopRatedTV
} from '../services/api';
import { UnifiedMediaItem } from '../types';
import { ContentGrid } from '../components/content/ContentGrid';
import { useAdultStore } from '../stores/useAdultStore';

export interface TrendingPageProps {
  onSelectMedia: (item: UnifiedMediaItem) => void;
}

type TabType = 'trending_today' | 'trending_week' | 'in_theaters' | 'airing_today' | 'top_rated';

export function TrendingPage({ onSelectMedia }: TrendingPageProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('trending_today');
  const [mediaType, setMediaType] = React.useState<'all' | 'movie' | 'tv'>('all');
  const [items, setItems] = React.useState<UnifiedMediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const adultMode = useAdultStore((s) => s.adultMode);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        let results: UnifiedMediaItem[] = [];

        if (activeTab === 'trending_today') {
          const [m, t] = await Promise.all([
            fetchTrendingMovies('day', 1, adultMode),
            fetchTrendingTV('day', 1, adultMode)
          ]);
          results = [...(m.data || []), ...(t.data || [])];
        } else if (activeTab === 'trending_week') {
          const [m, t] = await Promise.all([
            fetchTrendingMovies('week', 1, adultMode),
            fetchTrendingTV('week', 1, adultMode)
          ]);
          results = [...(m.data || []), ...(t.data || [])];
        } else if (activeTab === 'in_theaters') {
          const m = await fetchNowPlayingMovies(1, adultMode);
          results = m.data || [];
        } else if (activeTab === 'airing_today') {
          const t = await fetchAiringTodayTV(1, adultMode);
          results = t.data || [];
        } else if (activeTab === 'top_rated') {
          const [m, t] = await Promise.all([
            fetchTopRatedMovies(1, adultMode),
            fetchTopRatedTV(1, adultMode)
          ]);
          results = [...(m.data || []), ...(t.data || [])].sort((a, b) => b.voteAverage - a.voteAverage);
        }

        if (isMounted) {
          if (mediaType !== 'all') {
            results = results.filter((i) => i.mediaType === mediaType);
          }
          setItems(results);
        }
      } catch (err) {
        console.error('Trending load error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, mediaType, adultMode]);

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'trending_today', label: 'Trending Today', icon: Flame },
    { id: 'trending_week', label: 'This Week', icon: Sparkles },
    { id: 'in_theaters', label: 'In Theaters', icon: Film },
    { id: 'airing_today', label: 'Airing Today (TV)', icon: Calendar },
    { id: 'top_rated', label: 'Top Rated All Time', icon: Star }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Title */}
      <div className="mb-6 pb-6 border-b border-[#1E2A42]">
        <h1 className="text-3xl font-black text-[#F8FAFC] flex items-center gap-3">
          <Flame className="h-8 w-8 text-amber-500 fill-amber-500/20" />
          Trending & Popular
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Real-time global cinema and television charts
        </p>
      </div>

      {/* Tabs & Type Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#111828] rounded-2xl border border-[#1E2A42]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected ? 'bg-amber-500 text-slate-950 shadow-sm font-bold' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Type Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#111828] rounded-xl border border-[#1E2A42]">
          <button
            onClick={() => setMediaType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mediaType === 'all' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMediaType('movie')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mediaType === 'movie' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Film className="h-3 w-3" />
            Movies
          </button>
          <button
            onClick={() => setMediaType('tv')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mediaType === 'tv' ? 'bg-slate-700 text-white' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Tv className="h-3 w-3" />
            TV Shows
          </button>
        </div>
      </div>

      {/* Grid */}
      <ContentGrid items={items} isLoading={loading} onSelect={onSelectMedia} />
    </div>
  );
}
