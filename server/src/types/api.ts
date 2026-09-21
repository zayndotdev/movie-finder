export interface UnifiedMediaItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  genreNames: string[];
  originalLanguage: string;
  popularity: number;
  adult: boolean;
  aiReason?: string;
}

export interface WatchProvider {
  providerId: number;
  providerName: string;
  logoPath: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface TVSeasonSummary {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  posterPath: string | null;
  overview: string;
}

export interface TVEpisodeItem {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  voteAverage: number;
  voteCount: number;
  runtime: number | null;
}

export interface TVSeasonDetail {
  id: number;
  seasonNumber: number;
  name: string;
  overview: string;
  posterPath: string | null;
  airDate: string | null;
  episodes: TVEpisodeItem[];
}

export interface UnifiedMediaDetail extends UnifiedMediaItem {
  tagline: string | null;
  status: string;
  runtime: number | null;
  budget?: number;
  revenue?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  seasons?: TVSeasonSummary[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
    directors: CrewMember[];
  };
  trailers: {
    id: string;
    key: string;
    name: string;
    type: string;
  }[];
  watchProviders: {
    country: string;
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
  };
  similar: UnifiedMediaItem[];
  certification?: string;
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  profilePath: string | null;
  knownForDepartment: string;
  combinedCredits: UnifiedMediaItem[];
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    totalPages?: number;
    totalResults?: number;
    cached?: boolean;
    timestamp: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}

export interface AIChatIntent {
  contentType: 'movie' | 'tv' | 'all';
  genres: number[];
  keywords: string[];
  minRating?: number;
  maxRating?: number;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
  sortBy?: string;
  isAdultQuery?: boolean;
  specificPeople?: string[];
}

export interface AIChatResponseData {
  reply: string;
  parsedIntent: AIChatIntent;
  recommendations: UnifiedMediaItem[];
  providerUsed: 'gemini' | 'groq' | 'rule-based';
}
