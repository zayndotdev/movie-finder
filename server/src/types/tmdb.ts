export interface TMDBMovieRaw {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  popularity: number;
  adult: boolean;
  video?: boolean;
}

export interface TMDBTVRaw {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  original_language: string;
  popularity: number;
  adult: boolean;
  origin_country?: string[];
}

export interface TMDBCreditsRaw {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface TMDBVideosRaw {
  results: {
    id: string;
    iso_639_1: string;
    iso_3166_1: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
  }[];
}

export interface TMDBWatchProvidersRaw {
  results: Record<
    string,
    {
      link: string;
      flatrate?: {
        provider_id: number;
        provider_name: string;
        logo_path: string;
        display_priority: number;
      }[];
      rent?: {
        provider_id: number;
        provider_name: string;
        logo_path: string;
        display_priority: number;
      }[];
      buy?: {
        provider_id: number;
        provider_name: string;
        logo_path: string;
        display_priority: number;
      }[];
    }
  >;
}

export interface TMDBPersonRaw {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  imdb_id: string | null;
}

export interface TMDBCombinedCreditsRaw {
  cast: (TMDBMovieRaw & TMDBTVRaw & { media_type: 'movie' | 'tv'; character: string })[];
  crew: (TMDBMovieRaw & TMDBTVRaw & { media_type: 'movie' | 'tv'; job: string; department: string })[];
}
