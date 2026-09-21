import axios from 'axios';
import dotenv from 'dotenv';
import { TMDBMovieRaw, TMDBTVRaw, TMDBPersonRaw, TMDBCombinedCreditsRaw } from '../types/tmdb';
import { UnifiedMediaItem, UnifiedMediaDetail, PersonDetail, CastMember, CrewMember, WatchProvider } from '../types/api';
import { GENRE_MAP } from '../utils/moodMapper';
import { serverCache } from '../utils/cache';
import { tmdbRateLimiter } from '../utils/rateLimiter';
import { MOCK_MEDIA_ITEMS, MOCK_PERSONS } from './mockData';

import path from 'path';

dotenv.config();

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export function getTMDBKey(): string {
  dotenv.config();
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  return (process.env.TMDB_API_KEY || '').trim();
}

export function hasTMDBKey(): boolean {
  return getTMDBKey().length > 5;
}

export function normalizeRawItem(item: any, forceType?: 'movie' | 'tv'): UnifiedMediaItem {
  const isTV = forceType === 'tv' || item.media_type === 'tv' || Boolean(item.first_air_date && !item.release_date);
  const mediaType: 'movie' | 'tv' = isTV ? 'tv' : 'movie';
  const title = isTV ? (item.name || item.original_name || 'Untitled Show') : (item.title || item.original_title || 'Untitled Movie');
  const originalTitle = isTV ? (item.original_name || item.name || '') : (item.original_title || item.title || '');
  const releaseDate = isTV ? (item.first_air_date || null) : (item.release_date || null);
  const releaseYear = releaseDate ? parseInt(releaseDate.slice(0, 4), 10) : null;

  const rawGenreIds: number[] = item.genre_ids || (item.genres ? item.genres.map((g: any) => g.id) : []);
  const genreNames = rawGenreIds.map((id: number) => GENRE_MAP[id] || 'General').filter(Boolean);

  return {
    id: item.id,
    mediaType,
    title,
    originalTitle,
    overview: item.overview || 'No overview available.',
    posterPath: item.poster_path || null,
    backdropPath: item.backdrop_path || null,
    releaseDate,
    releaseYear: isNaN(releaseYear as number) ? null : releaseYear,
    voteAverage: typeof item.vote_average === 'number' ? Math.round(item.vote_average * 10) / 10 : 0,
    voteCount: item.vote_count || 0,
    genreIds: rawGenreIds,
    genreNames,
    originalLanguage: item.original_language || 'en',
    popularity: item.popularity || 0,
    adult: Boolean(item.adult)
  };
}

export function normalizeRawDetail(raw: any, type: 'movie' | 'tv'): UnifiedMediaDetail {
  const base = normalizeRawItem(raw, type);

  // Parse credits
  const cast: CastMember[] = (raw.credits?.cast || []).slice(0, 15).map((c: any, index: number) => ({
    id: c.id,
    name: c.name,
    character: c.character || 'Self',
    profilePath: c.profile_path || null,
    order: c.order !== undefined ? c.order : index
  }));

  const crew: CrewMember[] = (raw.credits?.crew || []).slice(0, 20).map((cr: any) => ({
    id: cr.id,
    name: cr.name,
    job: cr.job || 'Crew',
    department: cr.department || 'Production',
    profilePath: cr.profile_path || null
  }));

  const directors = crew.filter(c => c.job === 'Director' || c.job === 'Creator' || c.job === 'Executive Producer');

  // Parse videos / trailers
  const trailers = (raw.videos?.results || [])
    .filter((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
    .map((v: any) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      type: v.type
    }));

  // Parse watch providers (US default, fallback to first available country)
  const providersObj = raw['watch/providers']?.results || {};
  const countryProviders = providersObj.US || providersObj.IN || providersObj.GB || Object.values(providersObj)[0] || {};

  const watchProviders = {
    country: providersObj.US ? 'US' : Object.keys(providersObj)[0] || 'Global',
    flatrate: ((countryProviders as any)?.flatrate || []).map((p: any) => ({
      providerId: p.provider_id,
      providerName: p.provider_name,
      logoPath: p.logo_path
    })),
    rent: ((countryProviders as any)?.rent || []).map((p: any) => ({
      providerId: p.provider_id,
      providerName: p.provider_name,
      logoPath: p.logo_path
    })),
    buy: ((countryProviders as any)?.buy || []).map((p: any) => ({
      providerId: p.provider_id,
      providerName: p.provider_name,
      logoPath: p.logo_path
    }))
  };

  // Parse similar titles
  const similar: UnifiedMediaItem[] = (raw.similar?.results || []).slice(0, 10).map((item: any) => normalizeRawItem(item, type));

  // TV-specific fields
  const numberOfSeasons = type === 'tv' ? raw.number_of_seasons : undefined;
  const numberOfEpisodes = type === 'tv' ? raw.number_of_episodes : undefined;
  const seasons = type === 'tv' && raw.seasons
    ? raw.seasons.map((s: any) => ({
        id: s.id,
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        airDate: s.air_date || null,
        posterPath: s.poster_path || null,
        overview: s.overview || ''
      }))
    : undefined;

  return {
    ...base,
    tagline: raw.tagline || null,
    status: raw.status || 'Released',
    runtime: type === 'movie' ? (raw.runtime || null) : (raw.episode_run_time?.[0] || null),
    budget: raw.budget,
    revenue: raw.revenue,
    numberOfSeasons,
    numberOfEpisodes,
    seasons,
    credits: {
      cast,
      crew,
      directors
    },
    trailers,
    watchProviders,
    similar,
    certification: raw.certification
  };
}

export async function fetchTMDB<T>(endpoint: string, params: Record<string, any> = {}, ttlSeconds: number = 3600): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: getTMDBKey(),
    ...params
  }).toString();

  const fullUrl = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
  const cacheKey = `tmdb:${fullUrl}`;

  const cached = serverCache.get<T>(cacheKey);
  if (cached) return cached;

  const data = await tmdbRateLimiter.schedule(async () => {
    const res = await axios.get<T>(fullUrl, { timeout: 10000 });
    return res.data;
  });

  serverCache.set(cacheKey, data, ttlSeconds);
  return data;
}

export async function multiSearch(query: string, page: number = 1, adult: boolean = false): Promise<{ items: UnifiedMediaItem[]; totalResults: number; totalPages: number }> {
  if (hasTMDBKey()) {
    try {
      const res: any = await fetchTMDB('/search/multi', {
        query,
        page,
        include_adult: adult
      }, 900);

      const items = (res.results || [])
        .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
        .map((item: any) => normalizeRawItem(item));

      return {
        items,
        totalResults: res.total_results || items.length,
        totalPages: res.total_pages || 1
      };
    } catch (err) {
      console.warn('TMDB Multi Search error, falling back to mock dataset', err);
    }
  }

  // Fallback to in-memory mock search
  const q = query.toLowerCase();
  let results = MOCK_MEDIA_ITEMS.filter(item => {
    const matchesTitle = item.title.toLowerCase().includes(q) || item.originalTitle.toLowerCase().includes(q);
    const matchesOverview = item.overview.toLowerCase().includes(q);
    const matchesCast = item.credits?.cast.some(c => c.name.toLowerCase().includes(q));
    const matchesDirector = item.credits?.directors.some(d => d.name.toLowerCase().includes(q));
    return matchesTitle || matchesOverview || matchesCast || matchesDirector;
  });

  if (!adult) {
    results = results.filter(i => !i.adult);
  } else {
    results = results.filter(i => i.adult);
  }

  return {
    items: results,
    totalResults: results.length,
    totalPages: 1
  };
}

export async function getPersonDetail(id: number): Promise<PersonDetail | null> {
  if (hasTMDBKey()) {
    try {
      const [personRaw, creditsRaw] = await Promise.all([
        fetchTMDB<TMDBPersonRaw>(`/person/${id}`, {}, 86400),
        fetchTMDB<TMDBCombinedCreditsRaw>(`/person/${id}/combined_credits`, {}, 86400)
      ]);

      const castCredits = (creditsRaw.cast || []).map(item => normalizeRawItem(item));
      const crewCredits = (creditsRaw.crew || []).map(item => normalizeRawItem(item));
      const combined = [...castCredits, ...crewCredits].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      return {
        id: personRaw.id,
        name: personRaw.name,
        biography: personRaw.biography || 'No biography available.',
        birthday: personRaw.birthday,
        deathday: personRaw.deathday,
        placeOfBirth: personRaw.place_of_birth,
        profilePath: personRaw.profile_path,
        knownForDepartment: personRaw.known_for_department,
        combinedCredits: combined
      };
    } catch (err) {
      console.warn('TMDB person detail failed, falling back to mock data', err);
    }
  }

  return MOCK_PERSONS[id] || null;
}
