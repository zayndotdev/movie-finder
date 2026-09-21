import * as React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { MoodChips, MoodChipItem } from '../components/search/MoodChips';
import { ContentCarousel } from '../components/content/ContentCarousel';
import { UnifiedMediaItem } from '../types';
import { fetchTrendingMovies, fetchTrendingTV, fetchDiscover } from '../services/api';
import { useAdultStore } from '../stores/useAdultStore';
import { useAIChatStore } from '../stores/useAIChatStore';
import { buildImageUrl } from '../lib/utils';

export interface HomePageProps {
  onSelectMedia: (item: UnifiedMediaItem) => void;
  onNavigate: (tab: string) => void;
}

export function HomePage({ onSelectMedia, onNavigate }: HomePageProps) {
  const adultMode = useAdultStore((s) => s.adultMode);
  const sendMessage = useAIChatStore((s) => s.sendMessage);
  const openChat = useAIChatStore((s) => s.openChat);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [trendingMovies, setTrendingMovies] = React.useState<UnifiedMediaItem[]>([]);
  const [trendingTV, setTrendingTV] = React.useState<UnifiedMediaItem[]>([]);
  const [bollywoodSpotlight, setBollywoodSpotlight] = React.useState<UnifiedMediaItem[]>([]);
  const [koreanSpotlight, setKoreanSpotlight] = React.useState<UnifiedMediaItem[]>([]);
  const [adultSpotlight, setAdultSpotlight] = React.useState<UnifiedMediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadHomeData = async () => {
      try {
        const [moviesRes, tvRes, bollywoodRes, koreanRes] = await Promise.all([
          fetchTrendingMovies('day', 1, adultMode),
          fetchTrendingTV('day', 1, adultMode),
          fetchDiscover({ language: 'hi', adult: adultMode, page: 1 }),
          fetchDiscover({ language: 'ko', adult: adultMode, page: 1 })
        ]);

        if (isMounted) {
          setTrendingMovies(moviesRes.data || []);
          setTrendingTV(tvRes.data || []);
          setBollywoodSpotlight(bollywoodRes.data || []);
          setKoreanSpotlight(koreanRes.data || []);

          if (adultMode) {
            const adultRes = await fetchDiscover({ adult: true, page: 1 });
            setAdultSpotlight(adultRes.data || []);
          }
        }
      } catch (err) {
        console.error('Home data load error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, [adultMode]);

  const handleSearchSubmit = (query: string) => {
    sendMessage(query);
    openChat();
  };

  const handleMoodSelect = (mood: MoodChipItem) => {
    sendMessage(mood.prompt);
    openChat();
  };

  const handleSurpriseMe = () => {
    const all = [...trendingMovies, ...trendingTV];
    if (all.length > 0) {
      const randomItem = all[Math.floor(Math.random() * all.length)];
      onSelectMedia(randomItem);
    }
  };

  const heroItem = trendingMovies[0] || trendingTV[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-12 pb-20 px-4 sm:px-6">
        {/* Hero Background Backdrop with Blur and Gradient */}
        {heroItem && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <img
              src={buildImageUrl(heroItem.backdropPath, 'w1280', 'backdrop')}
              alt=""
              className="h-full w-full object-cover opacity-20 filter blur-xl scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#06080F]/70 via-[#06080F]/95 to-[#06080F]" />
          </div>
        )}

        <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-6">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Content Discovery Agent</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F8FAFC] leading-tight mb-4">
            Find What You Feel Like Watching.
          </h1>

          <p className="text-sm sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mb-8 leading-relaxed">
            Tell our AI your mood, vibe, or criteria. Unearth movies, complete TV shows, Bollywood hits, anime, and uncensored international cinema in seconds.
          </p>

          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            onSurpriseMe={handleSurpriseMe}
            className="mb-8"
          />

          {/* Mood Chips */}
          <div className="w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-3">
              Or pick a mood vibe:
            </span>
            <MoodChips onSelectMood={handleMoodSelect} />
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 pb-16 space-y-4">
        {/* 18+ Section (Visible only when 18+ mode is ON) */}
        {adultMode && (
          <ContentCarousel
            title="🔞 Exclusive 18+ Uncensored Cinema"
            subtitle="French erotic dramas, Japanese R18+ releases, and uncut adult cinema"
            items={adultSpotlight.length > 0 ? adultSpotlight : trendingMovies.filter((m) => m.adult)}
            isLoading={loading}
            onSelect={onSelectMedia}
            actionText="View All 18+"
            onActionClick={() => onNavigate('discover')}
          />
        )}

        {/* Trending Movies */}
        <ContentCarousel
          title="🔥 Trending Movies Today"
          subtitle="Top releases capturing attention worldwide"
          items={trendingMovies}
          isLoading={loading}
          onSelect={onSelectMedia}
          actionText="Explore More"
          onActionClick={() => onNavigate('trending')}
        />

        {/* Trending TV Shows */}
        <ContentCarousel
          title="📺 Binge-Worthy TV Series"
          subtitle="Complete seasons, acclaimed episodes, and returning favorites"
          items={trendingTV}
          isLoading={loading}
          onSelect={onSelectMedia}
          actionText="View TV Shows"
          onActionClick={() => onNavigate('trending')}
        />

        {/* Bollywood & Indian Cinema Spotlight */}
        {bollywoodSpotlight.length > 0 && (
          <ContentCarousel
            title="🪕 Bollywood & Indian Cinema Spotlight"
            subtitle="Blockbusters, heartwarming dramas, and high-energy epics"
            items={bollywoodSpotlight}
            isLoading={loading}
            onSelect={onSelectMedia}
            actionText="Browse Indian Cinema"
            onActionClick={() => onNavigate('discover')}
          />
        )}

        {/* Korean Cinema & K-Drama Spotlight */}
        {koreanSpotlight.length > 0 && (
          <ContentCarousel
            title="🇰🇷 Korean Cinema & K-Dramas"
            subtitle="Gripping psychological thrillers and emotional storytelling"
            items={koreanSpotlight}
            isLoading={loading}
            onSelect={onSelectMedia}
            actionText="Browse K-Content"
            onActionClick={() => onNavigate('discover')}
          />
        )}

        {/* Bottom Discover CTA Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#111828] via-[#172035] to-[#111828] border border-[#1E2A42] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-[#F8FAFC] mb-1">
              Looking for something ultra-specific?
            </h3>
            <p className="text-sm text-[#94A3B8]">
              Combine genres, year ranges, rating filters, and languages in the Discover studio.
            </p>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Compass className="h-4 w-4" />
            Open Deep Discover
          </button>
        </div>
      </div>
    </div>
  );
}
