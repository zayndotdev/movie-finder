import { AIChatIntent } from '../types/api';

export interface MoodRule {
  name: string;
  regex: RegExp[];
  movieGenres: number[];
  tvGenres: number[];
  keywords: string[];
  defaultSort: string;
  minRating?: number;
  explanation: string;
}

export const MOOD_RULES: MoodRule[] = [
  {
    name: 'happy',
    regex: [/happy/i, /feel.?good/i, /uplifting/i, /wholesome/i, /cheerful/i, /fun/i, /joy/i, /laugh/i, /comedy/i],
    movieGenres: [35, 10751],      // Comedy, Family
    tvGenres: [35, 10751],
    keywords: ['feel-good', 'uplifting', 'humor', 'friendship'],
    defaultSort: 'vote_average.desc',
    minRating: 6.8,
    explanation: 'Joyful, witty, and uplifting stories that brighten your mood.'
  },
  {
    name: 'sad',
    regex: [/sad/i, /cry/i, /emotional/i, /heartbreak/i, /tear.?jerker/i, /depress/i, /melanchol/i, /grief/i],
    movieGenres: [18, 10749],      // Drama, Romance
    tvGenres: [18],
    keywords: ['emotional', 'tragedy', 'heartbreak'],
    defaultSort: 'vote_average.desc',
    minRating: 7.2,
    explanation: 'Deeply moving, poignant, and emotional narratives with immense heart.'
  },
  {
    name: 'thrilling',
    regex: [/thrill/i, /suspense/i, /edge of seat/i, /twist/i, /intense/i, /mystery/i, /detective/i, /whodunit/i],
    movieGenres: [53, 9648, 80],   // Thriller, Mystery, Crime
    tvGenres: [9648, 80],
    keywords: ['suspense', 'plot-twist', 'investigation'],
    defaultSort: 'popularity.desc',
    minRating: 7.0,
    explanation: 'Fast-paced, pulse-pounding tension packed with unpredictable twists.'
  },
  {
    name: 'romantic',
    regex: [/romance/i, /romantic/i, /love/i, /couple/i, /dating/i, /soulmate/i, /crush/i],
    movieGenres: [10749, 35],      // Romance, Comedy
    tvGenres: [10749, 18],
    keywords: ['love', 'passion', 'relationship'],
    defaultSort: 'vote_average.desc',
    minRating: 6.5,
    explanation: 'Heartfelt, captivating love stories that celebrate chemistry and connection.'
  },
  {
    name: 'scary',
    regex: [/scary/i, /horror/i, /creepy/i, /spooky/i, /haunted/i, /ghost/i, /monster/i, /slasher/i],
    movieGenres: [27, 53],         // Horror, Thriller
    tvGenres: [9648],
    keywords: ['supernatural', 'fear', 'nightmare'],
    defaultSort: 'popularity.desc',
    minRating: 6.2,
    explanation: 'Chilling, atmospheric, and hair-raising suspense.'
  },
  {
    name: 'adventurous',
    regex: [/adventure/i, /action/i, /journey/i, /quest/i, /epic/i, /hero/i, /fight/i, /battle/i],
    movieGenres: [12, 28],         // Adventure, Action
    tvGenres: [10759],             // Action & Adventure
    keywords: ['quest', 'heroic', 'spectacle'],
    defaultSort: 'popularity.desc',
    minRating: 6.8,
    explanation: 'Grand adventures, spectacular set-pieces, and thrilling escapades.'
  },
  {
    name: 'mindbending',
    regex: [/mind.?bending/i, /mind.?blowing/i, /philosophical/i, /simulation/i, /time travel/i, /matrix/i, /inception/i, /parallel universe/i, /psychological/i],
    movieGenres: [878, 9648],      // Sci-Fi, Mystery
    tvGenres: [10765, 9648],
    keywords: ['time-travel', 'alternate-reality', 'psychological'],
    defaultSort: 'vote_average.desc',
    minRating: 7.5,
    explanation: 'Thought-provoking, paradigm-shifting concepts that challenge your perception.'
  },
  {
    name: 'nostalgic',
    regex: [/nostalg/i, /classic/i, /childhood/i, /retro/i, /vintage/i, /90s/i, /80s/i, /2000s/i, /old school/i],
    movieGenres: [18, 35],
    tvGenres: [18, 35],
    keywords: ['coming-of-age', 'retro', 'childhood'],
    defaultSort: 'vote_average.desc',
    minRating: 7.0,
    explanation: 'Warm, timeless classics evoking memories of golden eras.'
  }
];

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // TV specific
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

export function parseIntentDeterministically(query: string, adultMode: boolean): AIChatIntent {
  const lower = query.toLowerCase();

  // 1. Detect content type
  let contentType: 'movie' | 'tv' | 'all' = 'all';
  const isTV = /\b(tv|series|show|shows|season|seasons|episode|episodes|k-drama|kdrama|anime series|sitcom)\b/i.test(lower);
  const isMovie = /\b(movie|movies|film|films|cinema|feature)\b/i.test(lower);

  if (isTV && !isMovie) {
    contentType = 'tv';
  } else if (isMovie && !isTV) {
    contentType = 'movie';
  }

  // 2. Detect language / culture
  let language: string | undefined;
  if (/\b(bollywood|hindi|indian)\b/i.test(lower)) language = 'hi';
  else if (/\b(korean|k-drama|kdrama|korea)\b/i.test(lower)) language = 'ko';
  else if (/\b(japanese|anime|japan)\b/i.test(lower)) language = 'ja';
  else if (/\b(french|france)\b/i.test(lower)) language = 'fr';
  else if (/\b(spanish|spain|mexican)\b/i.test(lower)) language = 'es';
  else if (/\b(hollywood|english|american|british)\b/i.test(lower)) language = 'en';
  else if (/\b(tamil)\b/i.test(lower)) language = 'ta';
  else if (/\b(telugu)\b/i.test(lower)) language = 'te';
  else if (/\b(malayalam)\b/i.test(lower)) language = 'ml';

  // 3. Detect rating constraint
  let minRating: number | undefined;
  const ratingMatch = lower.match(/\b([5-9](?:\.[0-9])?)\s*(?:\+|plus|\s*stars?|\s*rating)/i) ||
                      lower.match(/(?:rating|rated)\s*(?:of|above|over|greater than|at least|>=|>)?\s*([5-9](?:\.[0-9])?)/i);
  if (ratingMatch) {
    minRating = parseFloat(ratingMatch[1]);
  }

  // 4. Detect adult intent
  const isAdultQuery = adultMode || /\b(18\+|adult|uncensored|erotic|nsfw|sensual|explicit)\b/i.test(lower);

  // 5. Match Mood Rules
  const matchedGenres = new Set<number>();
  const keywords: string[] = [];
  let sortBy = 'popularity.desc';

  for (const rule of MOOD_RULES) {
    const isMatch = rule.regex.some(r => r.test(lower));
    if (isMatch) {
      const genresToAdd = contentType === 'tv' ? rule.tvGenres : rule.movieGenres;
      genresToAdd.forEach(g => matchedGenres.add(g));
      keywords.push(...rule.keywords);
      sortBy = rule.defaultSort;
      if (!minRating && rule.minRating) {
        minRating = rule.minRating;
      }
    }
  }

  // If no mood matched, extract direct genres
  if (matchedGenres.size === 0) {
    for (const [id, name] of Object.entries(GENRE_MAP)) {
      if (new RegExp(`\\b${name.toLowerCase()}\\b`, 'i').test(lower)) {
        matchedGenres.add(Number(id));
      }
    }
  }

  // Year range extraction
  let yearFrom: number | undefined;
  let yearTo: number | undefined;
  if (/\b90s\b/i.test(lower)) {
    yearFrom = 1990;
    yearTo = 1999;
  } else if (/\b80s\b/i.test(lower)) {
    yearFrom = 1980;
    yearTo = 1989;
  } else if (/\b2000s\b/i.test(lower)) {
    yearFrom = 2000;
    yearTo = 2009;
  }

  return {
    contentType,
    genres: Array.from(matchedGenres),
    keywords: Array.from(new Set(keywords)).slice(0, 5),
    minRating,
    language,
    yearFrom,
    yearTo,
    sortBy,
    isAdultQuery
  };
}
