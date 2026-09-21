import axios from 'axios';
import {
  ApiResponse,
  UnifiedMediaItem,
  UnifiedMediaDetail,
  TVSeasonDetail,
  PersonDetail,
  AIChatResponseData
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Movies
export async function fetchTrendingMovies(timeWindow: 'day' | 'week' = 'day', page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/movies/trending', {
    params: { timeWindow, page, adult }
  });
  return res.data;
}

export async function fetchPopularMovies(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/movies/popular', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchTopRatedMovies(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/movies/top-rated', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchNowPlayingMovies(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/movies/now-playing', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchUpcomingMovies(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/movies/upcoming', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchMovieDetail(id: number): Promise<ApiResponse<UnifiedMediaDetail>> {
  const res = await api.get<ApiResponse<UnifiedMediaDetail>>(`/movies/${id}`);
  return res.data;
}

// TV Shows
export async function fetchTrendingTV(timeWindow: 'day' | 'week' = 'day', page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/tv/trending', {
    params: { timeWindow, page, adult }
  });
  return res.data;
}

export async function fetchPopularTV(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/tv/popular', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchTopRatedTV(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/tv/top-rated', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchAiringTodayTV(page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/tv/airing-today', {
    params: { page, adult }
  });
  return res.data;
}

export async function fetchTVDetail(id: number): Promise<ApiResponse<UnifiedMediaDetail>> {
  const res = await api.get<ApiResponse<UnifiedMediaDetail>>(`/tv/${id}`);
  return res.data;
}

export async function fetchTVSeasonDetail(tvId: number, seasonNumber: number): Promise<ApiResponse<TVSeasonDetail>> {
  const res = await api.get<ApiResponse<TVSeasonDetail>>(`/tv/${tvId}/season/${seasonNumber}`);
  return res.data;
}

// Unified Discover
export interface DiscoverParams {
  type?: 'movie' | 'tv' | 'all';
  genres?: number[];
  minRating?: number;
  maxRating?: number;
  yearFrom?: number;
  yearTo?: number;
  language?: string;
  sortBy?: string;
  withCast?: string;
  adult?: boolean;
  page?: number;
}

export async function fetchDiscover(params: DiscoverParams): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const query: Record<string, any> = {
    type: params.type || 'all',
    page: params.page || 1,
    adult: Boolean(params.adult),
    sortBy: params.sortBy || 'popularity.desc'
  };

  if (params.genres && params.genres.length > 0) {
    query.genres = params.genres.join(',');
  }
  if (params.minRating !== undefined) query.minRating = params.minRating;
  if (params.maxRating !== undefined) query.maxRating = params.maxRating;
  if (params.yearFrom !== undefined) query.yearFrom = params.yearFrom;
  if (params.yearTo !== undefined) query.yearTo = params.yearTo;
  if (params.language && params.language !== 'all') query.language = params.language;
  if (params.withCast) query.withCast = params.withCast;

  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/discover', { params: query });
  return res.data;
}

// Multi-Search
export async function searchMulti(query: string, page: number = 1, adult: boolean = false): Promise<ApiResponse<UnifiedMediaItem[]>> {
  const res = await api.get<ApiResponse<UnifiedMediaItem[]>>('/search/multi', {
    params: { query, page, adult }
  });
  return res.data;
}

// Person
export async function fetchPersonDetail(id: number): Promise<ApiResponse<PersonDetail>> {
  const res = await api.get<ApiResponse<PersonDetail>>(`/person/${id}`);
  return res.data;
}

// AI Chat
export async function sendAIChatMessage(
  query: string,
  adultMode: boolean,
  history?: { sender: string; text: string }[]
): Promise<ApiResponse<AIChatResponseData>> {
  const res = await api.post<ApiResponse<AIChatResponseData>>('/ai/chat', {
    query,
    adultMode,
    history
  });
  return res.data;
}


// Genres Metadata
export async function fetchGenres(): Promise<ApiResponse<{ id: number; name: string }[]>> {
  const res = await api.get<ApiResponse<{ id: number; name: string }[]>>('/genres');
  return res.data;
}
