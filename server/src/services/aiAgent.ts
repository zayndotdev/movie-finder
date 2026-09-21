import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import axios from 'axios';
import { AIChatIntent, AIChatResponseData, UnifiedMediaItem } from '../types/api';
import { parseIntentDeterministically, MOOD_RULES } from '../utils/moodMapper';
import { fetchTMDB, hasTMDBKey, normalizeRawItem } from './tmdbShared';
import { filterAdultContent } from './adultFilter';
import { MOCK_MEDIA_ITEMS } from './mockData';
import { serverCache } from '../utils/cache';
import path from 'path';

function getGeminiKey(): string {
  dotenv.config();
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  return (process.env.GEMINI_API_KEY || '').trim();
}

function getGroqKey(): string {
  dotenv.config();
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  return (process.env.GROQ_API_KEY || '').trim();
}

function getMistralKey(): string {
  dotenv.config();
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  return (process.env.MISTRAL_API_KEY || '').trim();
}

function getCohereKey(): string {
  dotenv.config();
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  return (process.env.COHERE_API_KEY || '').trim();
}

const SYSTEM_PROMPT = `
You are CineMatch AI, an expert cinematic and television discovery agent.
Analyze the user's natural language request (mood, genre, actor, director, era, rating, language, content type, 18+ content) and optional conversation history.

CRITICAL RULES:
1. You MUST respond with ONLY valid JSON adhering to the specified schema. Do not include markdown codeblocks or extra text.
2. CONVERSATIONAL VS RECOMMENDATION INTENT:
   - If the user is simply saying hello, greeting (e.g., "hey", "hi", "hello", "how are you"), asking who you are, or general chatter WITHOUT requesting movies or shows:
     Set "isConversational": true
     Set "limit": 0
     Set "searchTitles": []
     In "reply", warmly greet them as CineMatch AI and suggest what they can ask for (genres, moods, actors, favorite movies).
   - If the user is asking to find, recommend, or explore movies/TV shows:
     Set "isConversational": false
     If the user asked for a specific number of titles (e.g. "give me 3 movies", "top 2 shows", "only 1 film"), set "limit" to that number. Otherwise set "limit": 5.
     In "searchTitles", provide 3 to 8 REAL, well-known movie/TV titles that perfectly fit the request (e.g. for mind-bending sci-fi: ["Inception", "Interstellar", "Tenet", "The Matrix", "Arrival"]).
     In "reply", write an engaging 1-2 sentence response explaining why these titles match their vibe.
3. Content Type:
   - If user asks for "series", "tv", "show", "seasons", "episodes", set contentType = "tv".
   - If user asks for "movie", "film", "cinema", set contentType = "movie".
   - Otherwise, set contentType = "all".
4. Language ISO codes:
   - Bollywood/Hindi: "hi", South Indian: "te"|"ta"|"ml", Korean: "ko", Japanese/Anime: "ja", French: "fr", Spanish: "es", English: "en".
5. If adult/18+/uncensored/erotic is requested, set isAdultQuery = true.

SCHEMA:
{
  "reply": "Conversational friendly response",
  "isConversational": boolean,
  "limit": number,
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
    "specificPeople": [string],
    "isConversational": boolean,
    "limit": number
  },
  "searchTitles": [string]
}
`;

export async function parseQueryWithAI(
  query: string,
  adultMode: boolean,
  history?: { sender: string; text: string }[]
): Promise<{ reply: string; intent: AIChatIntent; searchTitles?: string[]; provider: 'gemini' | 'groq' | 'mistral' | 'cohere' | 'rule-based' }> {
  let promptText = `User Query: "${query}"\nAdult Mode: ${adultMode}`;
  if (history && history.length > 0) {
    const recentHistory = history
      .slice(-4)
      .map(h => `${h.sender === 'user' ? 'User' : 'CineMatch'}: ${h.text}`)
      .join('\n');
    promptText = `Recent Conversation:\n${recentHistory}\n\nCurrent User Query: "${query}"\nAdult Mode: ${adultMode}`;
  }

  // 1. Try Groq (Ultra-fast LLaMA & GPT OSS)
  const groqKey = getGroqKey();
  if (groqKey && groqKey.length > 5) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'];
      for (const model of candidateModels) {
        try {
          const completion = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: promptText }
            ],
            model,
            response_format: { type: 'json_object' }
          });

          const content = completion.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed.intent || parsed.reply) {
              const isConversational = Boolean(parsed.isConversational ?? parsed.intent?.isConversational ?? false);
              const limit = typeof parsed.limit === 'number' ? parsed.limit : (typeof parsed.intent?.limit === 'number' ? parsed.intent.limit : (isConversational ? 0 : 5));

              return {
                reply: parsed.reply || (isConversational ? "Hey there! How can I help you find something great to watch?" : "Here are some handpicked recommendations for you!"),
                intent: {
                  contentType: parsed.intent?.contentType || 'all',
                  genres: parsed.intent?.genres || [],
                  keywords: parsed.intent?.keywords || [],
                  minRating: parsed.intent?.minRating || undefined,
                  language: parsed.intent?.language || undefined,
                  yearFrom: parsed.intent?.yearFrom || undefined,
                  yearTo: parsed.intent?.yearTo || undefined,
                  sortBy: parsed.intent?.sortBy || 'popularity.desc',
                  isAdultQuery: Boolean(parsed.intent?.isAdultQuery || adultMode),
                  specificPeople: parsed.intent?.specificPeople || [],
                  isConversational,
                  limit
                },
                searchTitles: parsed.searchTitles || [],
                provider: 'groq'
              };
            }
          }
        } catch {
          // Try next model
        }
      }
    } catch (err) {
      console.warn('Groq API call failed, trying next provider', err);
    }
  }

  // 2. Try Mistral AI
  const mistralKey = getMistralKey();
  if (mistralKey && mistralKey.length > 5) {
    for (const model of ['open-mistral-7b', 'mistral-tiny']) {
      try {
        const res = await axios.post(
          'https://api.mistral.ai/v1/chat/completions',
          {
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: promptText }
            ],
            response_format: { type: 'json_object' }
          },
          { headers: { Authorization: `Bearer ${mistralKey}` }, timeout: 8000 }
        );

        const content = res.data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.intent || parsed.reply) {
            const isConversational = Boolean(parsed.isConversational ?? parsed.intent?.isConversational ?? false);
            const limit = typeof parsed.limit === 'number' ? parsed.limit : (typeof parsed.intent?.limit === 'number' ? parsed.intent.limit : (isConversational ? 0 : 5));

            return {
              reply: parsed.reply || "Here are handpicked titles based on your mood!",
              intent: {
                contentType: parsed.intent?.contentType || 'all',
                genres: parsed.intent?.genres || [],
                keywords: parsed.intent?.keywords || [],
                minRating: parsed.intent?.minRating || undefined,
                language: parsed.intent?.language || undefined,
                yearFrom: parsed.intent?.yearFrom || undefined,
                yearTo: parsed.intent?.yearTo || undefined,
                sortBy: parsed.intent?.sortBy || 'popularity.desc',
                isAdultQuery: Boolean(parsed.intent?.isAdultQuery || adultMode),
                specificPeople: parsed.intent?.specificPeople || [],
                isConversational,
                limit
              },
              searchTitles: parsed.searchTitles || [],
              provider: 'mistral'
            };
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  // 3. Try Cohere
  const cohereKey = getCohereKey();
  if (cohereKey && cohereKey.length > 5) {
    for (const model of ['command-r-08-2024', 'command-r7b-12-2024']) {
      try {
        const res = await axios.post(
          'https://api.cohere.com/v2/chat',
          {
            model,
            messages: [
              { role: 'system', content: `${SYSTEM_PROMPT}\nReturn ONLY JSON, no markdown codeblocks.` },
              { role: 'user', content: promptText }
            ],
            response_format: { type: 'json_object' }
          },
          { headers: { Authorization: `Bearer ${cohereKey}` }, timeout: 8000 }
        );

        const content = res.data?.message?.content?.[0]?.text;
        if (content) {
          const parsed = JSON.parse(content);
          if (parsed.intent || parsed.reply) {
            const isConversational = Boolean(parsed.isConversational ?? parsed.intent?.isConversational ?? false);
            const limit = typeof parsed.limit === 'number' ? parsed.limit : (typeof parsed.intent?.limit === 'number' ? parsed.intent.limit : (isConversational ? 0 : 5));

            return {
              reply: parsed.reply || 'Tailored with Cohere AI for your vibe!',
              intent: {
                contentType: parsed.intent?.contentType || 'all',
                genres: parsed.intent?.genres || [],
                keywords: parsed.intent?.keywords || [],
                minRating: parsed.intent?.minRating || undefined,
                language: parsed.intent?.language || undefined,
                yearFrom: parsed.intent?.yearFrom || undefined,
                yearTo: parsed.intent?.yearTo || undefined,
                sortBy: parsed.intent?.sortBy || 'popularity.desc',
                isAdultQuery: Boolean(parsed.intent?.isAdultQuery || adultMode),
                specificPeople: parsed.intent?.specificPeople || [],
                isConversational,
                limit
              },
              searchTitles: parsed.searchTitles || [],
              provider: 'cohere'
            };
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  // 4. Try Gemini if configured
  const geminiKey = getGeminiKey();
  if (geminiKey && geminiKey.length > 5 && !geminiKey.startsWith('AQ.')) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `${SYSTEM_PROMPT}\n\n${promptText}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.intent || parsed.reply) {
        const isConversational = Boolean(parsed.isConversational ?? parsed.intent?.isConversational ?? false);
        const limit = typeof parsed.limit === 'number' ? parsed.limit : (typeof parsed.intent?.limit === 'number' ? parsed.intent.limit : (isConversational ? 0 : 5));

        return {
          reply: parsed.reply || 'Here are some excellent recommendations that match your vibe!',
          intent: {
            contentType: parsed.intent?.contentType || 'all',
            genres: parsed.intent?.genres || [],
            keywords: parsed.intent?.keywords || [],
            minRating: parsed.intent?.minRating || undefined,
            language: parsed.intent?.language || undefined,
            yearFrom: parsed.intent?.yearFrom || undefined,
            yearTo: parsed.intent?.yearTo || undefined,
            sortBy: parsed.intent?.sortBy || 'popularity.desc',
            isAdultQuery: Boolean(parsed.intent?.isAdultQuery || adultMode),
            specificPeople: parsed.intent?.specificPeople || [],
            isConversational,
            limit
          },
          searchTitles: parsed.searchTitles || [],
          provider: 'gemini'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed', err);
    }
  }

  // 5. Deterministic rule-based fallback
  const intent = parseIntentDeterministically(query, adultMode);
  if (intent.isConversational) {
    return {
      reply: "Hey there! 🎬 I'm CineMatch AI, your personal entertainment guide. Tell me what mood you're in, an actor you love, or a genre you want to explore!",
      intent,
      provider: 'rule-based'
    };
  }

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
  adultMode: boolean = false,
  history?: { sender: string; text: string }[]
): Promise<AIChatResponseData> {
  const { reply, intent, searchTitles, provider } = await parseQueryWithAI(query, adultMode, history);
  const effectiveAdult = Boolean(adultMode || intent.isAdultQuery);

  // If purely conversational (greeting, question without request), return no media cards
  if (intent.isConversational) {
    return {
      reply,
      parsedIntent: intent,
      recommendations: [],
      providerUsed: provider
    };
  }

  const targetLimit = intent.limit && intent.limit > 0 ? Math.min(intent.limit, 10) : 5;
  let candidateItems: UnifiedMediaItem[] = [];
  const seenIds = new Set<number>();

  // A. TMDB Search
  if (hasTMDBKey()) {
    // 1. First, search TMDB for the specific titles recommended by the AI
    if (searchTitles && searchTitles.length > 0) {
      for (const title of searchTitles.slice(0, targetLimit + 2)) {
        if (candidateItems.length >= targetLimit) break;
        try {
          const type = intent.contentType === 'all' ? undefined : intent.contentType;
          const searchEndpoint = type === 'movie' ? '/search/movie' : (type === 'tv' ? '/search/tv' : '/search/multi');
          const sRes: any = await fetchTMDB(searchEndpoint, {
            query: title.trim(),
            include_adult: effectiveAdult
          }, 3600);

          const results = sRes?.results || [];
          const matched = results.find((r: any) =>
            (!type || r.media_type === type || (!r.media_type && (type === 'movie' ? r.title : r.name))) &&
            r.poster_path &&
            !seenIds.has(r.id)
          ) || results.find((r: any) => !seenIds.has(r.id) && (r.title || r.name));

          if (matched) {
            seenIds.add(matched.id);
            candidateItems.push(normalizeRawItem(matched, type));
          }
        } catch (err) {
          console.warn(`TMDB search for "${title}" failed:`, err);
        }
      }
    }

    // 2. If we need more items to satisfy targetLimit, query TMDB Discover with filters
    if (candidateItems.length < targetLimit) {
      try {
        const type = intent.contentType === 'all' ? 'movie' : intent.contentType;
        const endpoint = `/discover/${type}`;
        // Pick a random page (1 or 2) so results aren't identical on every single prompt
        const randomPage = Math.floor(Math.random() * 2) + 1;
        const params: Record<string, any> = {
          include_adult: effectiveAdult,
          sort_by: intent.sortBy || 'popularity.desc',
          page: randomPage
        };

        if (intent.genres.length > 0) {
          params.with_genres = intent.genres.join(',');
        }
        if (intent.minRating) {
          params['vote_average.gte'] = intent.minRating;
          params['vote_count.gte'] = 50;
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

        const res: any = await fetchTMDB(endpoint, params, 900);
        const discoverResults = (res.results || [])
          .filter((item: any) => !seenIds.has(item.id))
          .map((item: any) => normalizeRawItem(item, type));

        for (const item of discoverResults) {
          if (candidateItems.length >= targetLimit) break;
          seenIds.add(item.id);
          candidateItems.push(item);
        }
      } catch (err) {
        console.warn('TMDB Discover inside AI agent failed:', err);
      }
    }
  }

  // B. Fallback to mock dataset if TMDB returned nothing or has no key
  if (candidateItems.length === 0) {
    let pool = [...MOCK_MEDIA_ITEMS];
    if (intent.contentType !== 'all') {
      pool = pool.filter(i => i.mediaType === intent.contentType);
    }
    pool = filterAdultContent(pool, effectiveAdult);

    if (searchTitles && searchTitles.length > 0) {
      const titleMatches = pool.filter(i => searchTitles.some(t => i.title.toLowerCase().includes(t.toLowerCase())));
      if (titleMatches.length > 0) {
        pool = [...titleMatches, ...pool.filter(i => !titleMatches.includes(i))];
      }
    } else {
      if (intent.language) {
        const langMatches = pool.filter(i => i.originalLanguage === intent.language);
        if (langMatches.length > 0) pool = langMatches;
      }
      if (intent.genres.length > 0) {
        const genreMatches = pool.filter(i => i.genreIds.some(g => intent.genres.includes(g)));
        if (genreMatches.length > 0) pool = genreMatches;
      }
      if (intent.minRating) {
        const ratingMatches = pool.filter(i => i.voteAverage >= (intent.minRating as number));
        if (ratingMatches.length > 0) pool = ratingMatches;
      }
    }
    candidateItems = pool;
  }

  // Generate personalized micro-reasons and cap to exact targetLimit
  const finalRecommendations = candidateItems.slice(0, targetLimit).map(item => {
    let aiReason = item.aiReason;
    if (!aiReason) {
      const moodRule = MOOD_RULES.find(r => r.movieGenres.some(g => item.genreIds.includes(g)));
      aiReason = moodRule
        ? `Perfect for your ${moodRule.name} mood: ${item.overview.slice(0, 95)}...`
        : `Selected for you with an outstanding ${item.voteAverage}/10 rating.`;
    }
    return {
      ...item,
      aiReason
    };
  });

  return {
    reply,
    parsedIntent: intent,
    recommendations: finalRecommendations,
    providerUsed: provider
  };
}
