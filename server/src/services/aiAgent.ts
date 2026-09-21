import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { AIChatIntent, AIChatResponseData, UnifiedMediaItem } from '../types/api';
import { parseIntentDeterministically, MOOD_RULES } from '../utils/moodMapper';
import { fetchTMDB, hasTMDBKey, normalizeRawItem } from './tmdbShared';
import { filterAdultContent } from './adultFilter';
import { MOCK_MEDIA_ITEMS } from './mockData';
import { serverCache } from '../utils/cache';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `
You are CineMatch AI, an expert cinematic and television discovery agent.
Analyze the user's natural language request (mood, genre, actor, director, era, rating, language, content type, 18+ content) and extract precise search parameters for TMDB.

CRITICAL RULES:
1. You MUST respond with ONLY valid JSON adhering to the specified schema. Do not include markdown codeblocks or extra text.
2. Content Type:
   - If user asks for "series", "tv", "show", "seasons", "episodes", set contentType = "tv".
   - If user asks for "movie", "film", "cinema", set contentType = "movie".
   - Otherwise, set contentType = "all".
3. Language ISO codes:
   - Bollywood/Hindi: "hi", South Indian: "te"|"ta"|"ml", Korean: "ko", Japanese/Anime: "ja", French: "fr", Spanish: "es", English: "en".
4. If adult/18+/uncensored/erotic is requested, set isAdultQuery = true.

SCHEMA:
{
  "reply": "Friendly 1-2 sentence conversational response describing the match",
  "intent": {
    "contentType": "movie" | "tv" | "all",
    "genres": [number],
    "keywords": [string],
    "minRating": number or null,
    "language": string or null,
    "yearFrom": number or null,
    "yearTo": number or null,
    "sortBy": "popularity.desc" | "vote_average.desc" | "primary_release_date.desc",
    "isAdultQuery": boolean,
    "specificPeople": [string]
  },
  "searchTitles": [string]
}
`;

export async function parseQueryWithAI(query: string, adultMode: boolean): Promise<{ reply: string; intent: AIChatIntent; searchTitles?: string[]; provider: 'gemini' | 'groq' | 'rule-based' }> {
  // 1. Try Gemini if configured
  if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 5) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `${SYSTEM_PROMPT}\n\nUser Query: "${query}"\nAdult Mode Enabled: ${adultMode}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.intent) {
        return {
          reply: parsed.reply || 'Here are some excellent recommendations that match your vibe!',
          intent: {
            contentType: parsed.intent.contentType || 'all',
            genres: parsed.intent.genres || [],
            keywords: parsed.intent.keywords || [],
            minRating: parsed.intent.minRating || undefined,
            language: parsed.intent.language || undefined,
            yearFrom: parsed.intent.yearFrom || undefined,
            yearTo: parsed.intent.yearTo || undefined,
            sortBy: parsed.intent.sortBy || 'popularity.desc',
            isAdultQuery: Boolean(parsed.intent.isAdultQuery || adultMode),
            specificPeople: parsed.intent.specificPeople || []
          },
          searchTitles: parsed.searchTitles,
          provider: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, attempting fallback to Groq', err);
    }
  }

  // 2. Try Groq fallback if configured
  if (GROQ_API_KEY && GROQ_API_KEY.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `User Query: "${query}"\nAdult Mode: ${adultMode}` }
        ],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.intent) {
          return {
            reply: parsed.reply || 'I found some titles that align with what you are looking for!',
            intent: {
              contentType: parsed.intent.contentType || 'all',
              genres: parsed.intent.genres || [],
              keywords: parsed.intent.keywords || [],
              minRating: parsed.intent.minRating || undefined,
              language: parsed.intent.language || undefined,
              yearFrom: parsed.intent.yearFrom || undefined,
              yearTo: parsed.intent.yearTo || undefined,
              sortBy: parsed.intent.sortBy || 'popularity.desc',
              isAdultQuery: Boolean(parsed.intent.isAdultQuery || adultMode),
              specificPeople: parsed.intent.specificPeople || []
            },
            searchTitles: parsed.searchTitles,
            provider: 'groq'
          };
        }
      }
    } catch (err) {
      console.warn('Groq API call failed, falling back to deterministic parser', err);
    }
  }

  // 3. Deterministic rule-based fallback
  const intent = parseIntentDeterministically(query, adultMode);
  const matchedRule = MOOD_RULES.find(r => r.regex.some(rx => rx.test(query)));
  const reply = matchedRule
    ? `I've tailored a selection for your ${matchedRule.name} mood: ${matchedRule.explanation}`
    : `Here is a curated lineup matched to your criteria.`;

  return {
    reply,
    intent,
    provider: 'rule-based'
  };
}

export async function processAIChat(
  query: string,
  adultMode: boolean = false
): Promise<AIChatResponseData> {
  const cacheKey = `ai_chat:${adultMode}:${query.trim().toLowerCase()}`;
  const cached = serverCache.get<AIChatResponseData>(cacheKey);
  if (cached) return cached;

  const { reply, intent, searchTitles, provider } = await parseQueryWithAI(query, adultMode);
  const effectiveAdult = Boolean(adultMode || intent.isAdultQuery);

  let candidateItems: UnifiedMediaItem[] = [];

  // A. If TMDB key is available, query TMDB Discover
  if (hasTMDBKey()) {
    try {
      const type = intent.contentType === 'all' ? 'movie' : intent.contentType;
      const endpoint = `/discover/${type}`;
      const params: Record<string, any> = {
        include_adult: effectiveAdult,
        sort_by: intent.sortBy || 'popularity.desc',
        page: 1
      };

      if (intent.genres.length > 0) {
        params.with_genres = intent.genres.join(',');
      }
      if (intent.minRating) {
        params['vote_average.gte'] = intent.minRating;
      }
      if (intent.language) {
        params.with_original_language = intent.language;
      }
      if (intent.yearFrom && type === 'movie') {
        params['primary_release_date.gte'] = `${intent.yearFrom}-01-01`;
      }
      if (intent.yearTo && type === 'movie') {
        params['primary_release_date.lte'] = `${intent.yearTo}-12-31`;
      }

      const res: any = await fetchTMDB(endpoint, params, 1800);
      candidateItems = (res.results || []).map((item: any) => normalizeRawItem(item, type));
    } catch (err) {
      console.warn('TMDB Discover inside AI agent failed, using mock data', err);
    }
  }

  // B. Fallback / supplementary search from mock dataset
  if (candidateItems.length === 0) {
    let pool = [...MOCK_MEDIA_ITEMS];

    // Filter by type
    if (intent.contentType !== 'all') {
      pool = pool.filter(i => i.mediaType === intent.contentType);
    }

    // Filter by adult
    pool = filterAdultContent(pool, effectiveAdult);

    // Filter by language
    if (intent.language) {
      const langMatches = pool.filter(i => i.originalLanguage === intent.language);
      if (langMatches.length > 0) pool = langMatches;
    }

    // Filter by genres
    if (intent.genres.length > 0) {
      const genreMatches = pool.filter(i => i.genreIds.some(g => intent.genres.includes(g)));
      if (genreMatches.length > 0) pool = genreMatches;
    }

    // Filter by rating
    if (intent.minRating) {
      const ratingMatches = pool.filter(i => i.voteAverage >= (intent.minRating as number));
      if (ratingMatches.length > 0) pool = ratingMatches;
    }

    // Filter by specific search titles if AI suggested them
    if (searchTitles && searchTitles.length > 0) {
      const titleMatches = pool.filter(i => searchTitles.some(t => i.title.toLowerCase().includes(t.toLowerCase())));
      if (titleMatches.length > 0) {
        pool = [...titleMatches, ...pool.filter(i => !titleMatches.includes(i))];
      }
    }

    candidateItems = pool;
  }

  // Generate personalized micro-reasons for top recommendations
  const topRecommendations = candidateItems.slice(0, 8).map(item => {
    let aiReason = item.aiReason;
    if (!aiReason) {
      const moodRule = MOOD_RULES.find(r => r.movieGenres.some(g => item.genreIds.includes(g)));
      aiReason = moodRule
        ? `Perfect for your ${moodRule.name} mood: ${item.overview.slice(0, 95)}...`
        : `Highly recommended with an outstanding ${item.voteAverage}/10 rating.`;
    }
    return {
      ...item,
      aiReason
    };
  });

  const responseData: AIChatResponseData = {
    reply,
    parsedIntent: intent,
    recommendations: topRecommendations,
    providerUsed: provider
  };

  serverCache.set(cacheKey, responseData, 3600);
  return responseData;
}
