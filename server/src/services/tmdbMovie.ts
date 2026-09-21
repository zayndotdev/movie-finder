import { UnifiedMediaItem, UnifiedMediaDetail } from '../types/api';
import { fetchTMDB, hasTMDBKey, normalizeRawItem, normalizeRawDetail } from './tmdbShared';
import { MOCK_MEDIA_ITEMS } from './mockData';

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB(`/trending/movie/${timeWindow}`, { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((m: any) => normalizeRawItem(m, 'movie'));
      return {
        items,
        totalPages: res.total_pages || 1,
        totalResults: res.total_results || items.length
      };
    } catch (err) {
      console.warn('TMDB trending movies failed, using mock data', err);
    }
  }

  const movies = MOCK_MEDIA_ITEMS.filter(m => m.mediaType === 'movie' && (adult ? m.adult : !m.adult));
  return {
    items: movies,
    totalPages: 1,
    totalResults: movies.length
  };
}

export async function getPopularMovies(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/movie/popular', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((m: any) => normalizeRawItem(m, 'movie'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB popular movies failed, using mock data', err);
    }
  }

  const movies = MOCK_MEDIA_ITEMS.filter(m => m.mediaType === 'movie' && (adult ? m.adult : !m.adult))
    .sort((a, b) => b.popularity - a.popularity);
  return { items: movies, totalPages: 1, totalResults: movies.length };
}

export async function getTopRatedMovies(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/movie/top_rated', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((m: any) => normalizeRawItem(m, 'movie'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB top rated movies failed, using mock data', err);
    }
  }

  const movies = MOCK_MEDIA_ITEMS.filter(m => m.mediaType === 'movie' && (adult ? m.adult : !m.adult))
    .sort((a, b) => b.voteAverage - a.voteAverage);
  return { items: movies, totalPages: 1, totalResults: movies.length };
}

export async function getNowPlayingMovies(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/movie/now_playing', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((m: any) => normalizeRawItem(m, 'movie'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB now playing movies failed, using mock data', err);
    }
  }

  const movies = MOCK_MEDIA_ITEMS.filter(m => m.mediaType === 'movie' && m.releaseYear && m.releaseYear >= 2019 && (adult ? m.adult : !m.adult));
  return { items: movies, totalPages: 1, totalResults: movies.length };
}

export async function getUpcomingMovies(page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalPages: number; totalResults: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/movie/upcoming', { page, include_adult: adult }, 3600);
      const items = (res.results || []).map((m: any) => normalizeRawItem(m, 'movie'));
      return { items, totalPages: res.total_pages || 1, totalResults: res.total_results || items.length };
    } catch (err) {
      console.warn('TMDB upcoming movies failed, using mock data', err);
    }
  }

  const movies = MOCK_MEDIA_ITEMS.filter(m => m.mediaType === 'movie' && (adult ? m.adult : !m.adult));
  return { items: movies, totalPages: 1, totalResults: movies.length };
}

export async function getMovieDetail(id: number): Promise<UnifiedMediaDetail | null> {
  if (hasTMDBKey()) {
    try {
      const raw: any = await fetchTMDB(
        `/movie/${id}`,
        { append_to_response: 'credits,videos,watch/providers,similar,release_dates' },
        21600
      );

      // Extract certification if available
      let cert: string | undefined;
      const releaseDates = raw.release_dates?.results || [];
      const usRelease = releaseDates.find((r: any) => r.iso_3166_1 === 'US') || releaseDates[0];
      if (usRelease?.release_dates?.length > 0) {
        cert = usRelease.release_dates[0].certification || undefined;
      }
      raw.certification = cert;

      return normalizeRawDetail(raw, 'movie');
    } catch (err) {
      console.warn(`TMDB movie detail failed for id ${id}, checking mock data`, err);
    }
  }

  const item = MOCK_MEDIA_ITEMS.find(m => m.id === id && m.mediaType === 'movie');
  return item || null;
}
