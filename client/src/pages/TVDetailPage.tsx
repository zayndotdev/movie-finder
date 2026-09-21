import * as React from 'react';
import { ArrowLeft, Play, Heart, Star, Calendar, Globe, Tv, Layers, Loader2 } from 'lucide-react';
import { UnifiedMediaDetail, UnifiedMediaItem } from '../types';
import { fetchTVDetail } from '../services/api';
import { buildImageUrl, formatYear } from '../lib/utils';
import { RatingBadge } from '../components/content/RatingBadge';
import { ContentBadge } from '../components/content/ContentBadge';
import { CastList } from '../components/detail/CastList';
import { WatchProvidersList } from '../components/detail/WatchProvidersList';
import { TrailerModal } from '../components/detail/TrailerModal';
import { SeasonAccordion } from '../components/tv/SeasonAccordion';
import { ContentCarousel } from '../components/content/ContentCarousel';
import { useWatchlistStore } from '../stores/useWatchlistStore';
import { useToast } from '../components/ui/Toast';

export interface TVDetailPageProps {
  tvId: number;
  onBack: () => void;
  onSelectMedia: (item: UnifiedMediaItem) => void;
  onSelectActor?: (actorId: number) => void;
}

export function TVDetailPage({
  tvId,
  onBack,
  onSelectMedia,
  onSelectActor
}: TVDetailPageProps) {
  const [show, setShow] = React.useState<UnifiedMediaDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [trailerOpen, setTrailerOpen] = React.useState(false);

  const { isInWatchlist, addItem, removeItem } = useWatchlistStore();
  const { addToast } = useToast();

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDetail = async () => {
      try {
        const res = await fetchTVDetail(tvId);
        if (isMounted && res.data) {
          setShow(res.data);
        }
      } catch (err) {
        console.error('Failed to load TV show detail', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [tvId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-[#94A3B8]">Loading television series...</span>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="mx-auto max-w-lg py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Series Not Found</h2>
        <p className="text-sm text-[#94A3B8] mb-6">We could not load the details for this television show.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isSaved = isInWatchlist(show.id, 'tv');
  const primaryTrailer = show.trailers?.[0]?.key || null;

  const handleWatchlistToggle = () => {
    if (isSaved) {
      removeItem(show.id, 'tv');
      addToast({ title: 'Removed from Watchlist', description: `${show.title} removed.`, type: 'info' });
    } else {
      addItem(show, 'want_to_watch');
      addToast({ title: 'Added to Watchlist', description: `${show.title} saved to your list.`, type: 'success' });
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero Backdrop */}
      <div className="relative h-[450px] sm:h-[550px] w-full overflow-hidden">
        <img
          src={buildImageUrl(show.backdropPath, 'original', 'backdrop')}
          alt={show.title}
          className="h-full w-full object-cover object-top filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/60 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-4 sm:left-8 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 hover:border-amber-500/40 transition-all text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Info Container */}
      <div className="relative -mt-48 sm:-mt-64 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster */}
          <div className="w-48 sm:w-72 shrink-0 mx-auto md:mx-0 rounded-3xl overflow-hidden border-2 border-[#1E2A42] bg-[#111828] shadow-2xl">
            <img
              src={buildImageUrl(show.posterPath, 'w500', 'poster')}
              alt={show.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <ContentBadge type="tv" adult={show.adult} />
              <RatingBadge rating={show.voteAverage} />
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#172035] border border-[#1E2A42] text-amber-400">
                {show.status}
              </span>
              {show.certification && (
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#172035] border border-[#1E2A42] text-[#94A3B8]">
                  {show.certification}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F8FAFC] mb-2">
              {show.title}
            </h1>
            {show.tagline && (
              <p className="text-base sm:text-lg text-amber-400 font-medium italic mb-4">
                "{show.tagline}"
              </p>
            )}

            {/* TV Specific Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#94A3B8] mb-6 pb-6 border-b border-[#1E2A42]/60">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Layers className="h-4 w-4 text-amber-400" />
                {show.numberOfSeasons || (show.seasons ? show.seasons.length : 1)} Seasons
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Tv className="h-4 w-4 text-amber-400" />
                {show.numberOfEpisodes || 'Multi-Episode'} Episodes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-400" />
                {formatYear(show.releaseDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 uppercase font-semibold">
                <Globe className="h-4 w-4 text-amber-400" />
                {show.originalLanguage}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genreNames.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-xl bg-[#172035] border border-[#1E2A42] text-xs font-semibold text-[#F8FAFC]"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {primaryTrailer && (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch Trailer
                </button>
              )}

              <button
                type="button"
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-[#111828] text-[#F8FAFC] border-[#1E2A42] hover:border-amber-500/40 hover:bg-[#172035]'
                }`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current text-rose-400' : ''}`} />
                <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Series Overview</h3>
              <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                {show.overview}
              </p>
            </div>

            {/* Watch Providers */}
            <WatchProvidersList providers={show.watchProviders} />
          </div>
        </div>

        {/* Season & Episode Breakdown */}
        {show.seasons && show.seasons.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#F8FAFC]">Seasons & Episodes</h3>
              <span className="text-xs text-[#94A3B8]">Select a season to view episodes</span>
            </div>
            <SeasonAccordion tvId={show.id} seasons={show.seasons} />
          </div>
        )}

        {/* Cast List */}
        <div className="mt-12">
          <CastList cast={show.credits?.cast || []} onSelectActor={onSelectActor} />
        </div>

        {/* Similar TV Shows */}
        {show.similar && show.similar.length > 0 && (
          <div className="mt-8">
            <ContentCarousel
              title="More Shows Like This"
              subtitle={`If you loved ${show.title}, try these series`}
              items={show.similar}
              onSelect={onSelectMedia}
            />
          </div>
        )}
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={show.title}
        trailerKey={primaryTrailer}
      />
    </div>
  );
}
