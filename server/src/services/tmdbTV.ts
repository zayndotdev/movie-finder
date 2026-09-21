import { UnifiedMediaItem, UnifiedMediaDetail, TVSeasonDetail } from '../types/api';
import { fetchTMDB, hasTMDBKey, normalizeRawItem, normalizeRawDetail } from './tmdbShared';
import { MOCK_MEDIA_ITEMS, MOCK_SEASON_EPISODES } from './mockData';

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'day', page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB(`/trending/tv/${timeWindow}`, { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((t: any) => normalizeRawItem(t, 'tv'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB trending TV failed, using mock data', err);
    }
  }

  const tv = MOCK_MEDIA_ITEMS.filter(t => t.mediaType === 'tv' && (adult ? t.adult : !t.adult));
  return { items: tv, totalPages: 1, totalResults: tv.length };
}

export async function getPopularTV(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/tv/popular', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((t: any) => normalizeRawItem(t, 'tv'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB popular TV failed, using mock data', err);
    }
  }

  const tv = MOCK_MEDIA_ITEMS.filter(t => t.mediaType === 'tv' && (adult ? t.adult : !t.adult))
    .sort((a, b) => b.popularity - a.popularity);
  return { items: tv, totalPages: 1, totalResults: tv.length };
}

export async function getTopRatedTV(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/tv/top_rated', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((t: any) => normalizeRawItem(t, 'tv'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB top rated TV failed, using mock data', err);
    }
  }

  const tv = MOCK_MEDIA_ITEMS.filter(t => t.mediaType === 'tv' && (adult ? t.adult : !t.adult))
    .sort((a, b) => b.voteAverage - a.voteAverage);
  return { items: tv, totalPages: 1, totalResults: tv.length };
}

export async function getAiringTodayTV(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/tv/airing_today', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((t: any) => normalizeRawItem(t, 'tv'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB airing today TV failed, using mock data', err);
    }
  }

  const tv = MOCK_MEDIA_ITEMS.filter(t => t.mediaType === 'tv' && t.status === 'Returning Series' && (adult ? t.adult : !t.adult));
  return { items: tv, totalPages: 1, totalResults: tv.length };
}

export async function getTVDetail(id: number): Promise<UnifiedMediaDetail | null> {
  if (hasTMDBKey()) {
    try {
      const raw: any = await fetchTMDB(
        `/tv/${id}`,
        { append_to_response: 'credits,videos,watch/providers,similar,content_ratings' },
        21600
      );

      // Extract TV rating certification
      let cert: string | undefined;
      const ratings = raw.content_ratings?.results || [];
      const usRating = ratings.find((r: any) => r.iso_3166_1 === 'US') || ratings[0];
      if (usRating) {
        cert = usRating.rating;
      }
      raw.certification = cert;

      return normalizeRawDetail(raw, 'tv');
    } catch (err) {
      console.warn(`TMDB TV detail failed for id ${id}, checking mock data`, err);
    }
  }

  const item = MOCK_MEDIA_ITEMS.find(t => t.id === id && t.mediaType === 'tv');
  return item || null;
}

export async function getTVSeasonDetail(tvId: number, seasonNumber: number): Promise<TVSeasonDetail | null> {
  if (hasTMDBKey()) {
    try {
      const raw: any = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`, {}, 21600);
      return {
        id: raw.id,
        seasonNumber: raw.season_number,
        name: raw.name || `Season ${seasonNumber}`,
        overview: raw.overview || 'No season overview available.',
        posterPath: raw.poster_path || null,
        airDate: raw.air_date || null,
        episodes: (raw.episodes || []).map((ep: any) => ({
          id: ep.id,
          episodeNumber: ep.episode_number,
          name: ep.name || `Episode ${ep.episode_number}`,
          overview: ep.overview || 'No episode overview available.',
          stillPath: ep.still_path || null,
          airDate: ep.air_date || null,
          voteAverage: ep.vote_average ? Math.round(ep.vote_average * 10) / 10 : 0,
          voteCount: ep.vote_count || 0,
          runtime: ep.runtime || null
        }))
      };
    } catch (err) {
      console.warn(`TMDB TV Season detail failed for ${tvId} S${seasonNumber}, checking mock data`, err);
    }
  }

  const key = `${tvId}-${seasonNumber}`;
  if (MOCK_SEASON_EPISODES[key]) {
    return MOCK_SEASON_EPISODES[key];
  }

  // Generate sensible episodes list if not in mock dict
  const show = MOCK_MEDIA_ITEMS.find(t => t.id === tvId && t.mediaType === 'tv');
  if (show) {
    const s = show.seasons?.find(sn => sn.seasonNumber === seasonNumber);
    const count = s?.episodeCount || 8;
    return {
      id: tvId * 100 + seasonNumber,
      seasonNumber,
      name: s?.name || `Season ${seasonNumber}`,
      overview: s?.overview || `Complete season ${seasonNumber} episode guide for ${show.title}.`,
      posterPath: s?.posterPath || show.posterPath,
      airDate: s?.airDate || show.releaseDate,
      episodes: Array.from({ length: count }).map((_, idx) => ({
        id: tvId * 1000 + seasonNumber * 100 + (idx + 1),
        episodeNumber: idx + 1,
        name: `Episode ${idx + 1}: ${idx === 0 ? 'Premiere' : idx === count - 1 ? 'Season Finale' : 'Chapter ' + (idx + 1)}`,
        overview: `Intense developments unfold as the core story reaches new heights in episode ${idx + 1}.`,
        stillPath: show.backdropPath,
        airDate: show.releaseDate,
        voteAverage: show.voteAverage,
        voteCount: Math.round(show.voteCount / count),
        runtime: show.runtime || 50
      }))
    };
  }

  return null;
}
