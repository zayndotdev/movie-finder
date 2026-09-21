import * as React from 'react';
import { ChevronDown, ChevronUp, Calendar, Clock, Star, Film, Loader2 } from 'lucide-react';
import { TVSeasonSummary, TVSeasonDetail } from '../../types';
import { fetchTVSeasonDetail } from '../../services/api';
import { buildImageUrl, cn, formatRuntime } from '../../lib/utils';

export interface SeasonAccordionProps {
  tvId: number;
  seasons: TVSeasonSummary[];
}

export function SeasonAccordion({ tvId, seasons }: SeasonAccordionProps) {
  const [expandedSeason, setExpandedSeason] = React.useState<number | null>(seasons[0]?.seasonNumber || 1);
  const [seasonDetails, setSeasonDetails] = React.useState<Record<number, TVSeasonDetail>>({});
  const [loadingSeason, setLoadingSeason] = React.useState<number | null>(null);

  const loadSeason = async (seasonNumber: number) => {
    if (seasonDetails[seasonNumber]) {
      setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber);
      return;
    }

    setLoadingSeason(seasonNumber);
    setExpandedSeason(seasonNumber);
    try {
      const res = await fetchTVSeasonDetail(tvId, seasonNumber);
      if (res.data) {
        setSeasonDetails((prev) => ({ ...prev, [seasonNumber]: res.data }));
      }
    } catch (err) {
      console.error(`Failed to load season ${seasonNumber}`, err);
    } finally {
      setLoadingSeason(null);
    }
  };

  React.useEffect(() => {
    if (seasons.length > 0 && !seasonDetails[seasons[0].seasonNumber]) {
      loadSeason(seasons[0].seasonNumber);
    }
  }, [tvId, seasons]);

  return (
    <div className="flex flex-col gap-3">
      {seasons.map((season) => {
        const isExpanded = expandedSeason === season.seasonNumber;
        const details = seasonDetails[season.seasonNumber];
        const isLoading = loadingSeason === season.seasonNumber;

        return (
          <div
            key={season.id}
            className="rounded-2xl border border-[#1E2A42] bg-[#111828] overflow-hidden transition-all duration-200"
          >
            {/* Season Header Accordion Trigger */}
            <button
              type="button"
              onClick={() => loadSeason(season.seasonNumber)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#172035]/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={buildImageUrl(season.posterPath, 'w185', 'poster')}
                  alt={season.name}
                  className="h-16 w-11 rounded-lg object-cover bg-[#0C1220] shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-base text-[#F8FAFC]">{season.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8] mt-1">
                    <span>{season.episodeCount} Episodes</span>
                    {season.airDate && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {season.airDate.slice(0, 4)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#94A3B8]">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </button>

            {/* Expandable Episode List */}
            {isExpanded && (
              <div className="p-4 sm:p-5 pt-0 border-t border-[#1E2A42]/60 divide-y divide-[#1E2A42]/40 animate-in fade-in duration-200">
                {details?.episodes && details.episodes.length > 0 ? (
                  details.episodes.map((ep) => (
                    <div key={ep.id} className="py-4 flex flex-col sm:flex-row items-start gap-4">
                      {/* Still Thumbnail */}
                      <div className="relative aspect-video w-full sm:w-48 rounded-xl overflow-hidden bg-[#0C1220] shrink-0">
                        <img
                          src={buildImageUrl(ep.stillPath, 'w342', 'backdrop')}
                          alt={ep.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white backdrop-blur-sm">
                          Ep {ep.episodeNumber}
                        </span>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h5 className="font-bold text-sm sm:text-base text-[#F8FAFC]">
                            {ep.episodeNumber}. {ep.name}
                          </h5>
                          <div className="flex items-center gap-2 text-xs">
                            {ep.runtime && (
                              <span className="flex items-center gap-1 text-[#94A3B8]">
                                <Clock className="h-3 w-3" />
                                {formatRuntime(ep.runtime)}
                              </span>
                            )}
                            {ep.voteAverage > 0 && (
                              <span className="flex items-center gap-1 font-bold text-amber-400">
                                <Star className="h-3 w-3 fill-current" />
                                {ep.voteAverage.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                          {ep.overview || 'No synopsis provided for this episode.'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-[#94A3B8]">
                    {isLoading ? 'Loading episode list...' : 'No detailed episode list available.'}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
