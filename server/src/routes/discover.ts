import { Router, Request, Response, NextFunction } from 'express';
import { fetchTMDB, hasTMDBKey, normalizeRawItem } from '../services/tmdbShared';
import { filterAdultContent } from '../services/adultFilter';
import { MOCK_MEDIA_ITEMS } from '../services/mockData';
import { UnifiedMediaItem } from '../types/api';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = (req.query.type as string) || 'all';
    const genres = req.query.genres ? (req.query.genres as string).split(',').map(Number) : [];
    const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
    const maxRating = req.query.maxRating ? parseFloat(req.query.maxRating as string) : undefined;
    const yearFrom = req.query.yearFrom ? parseInt(req.query.yearFrom as string, 10) : undefined;
    const yearTo = req.query.yearTo ? parseInt(req.query.yearTo as string, 10) : undefined;
    const language = (req.query.language as string) || undefined;
    const sortBy = (req.query.sortBy as string) || 'popularity.desc';
    const withCast = req.query.withCast ? (req.query.withCast as string) : undefined;
    const adult = req.query.adult === 'true';
    const page = parseInt(req.query.page as string, 10) || 1;

    let items: UnifiedMediaItem[] = [];
    let totalPages = 1;
    let totalResults = 0;

    if (hasTMDBKey()) {
      try {
        const fetchDiscoverFor = async (mediaType: 'movie' | 'tv') => {
          const endpoint = `/discover/${mediaType}`;
          const params: Record<string, any> = {
            include_adult: adult,
            sort_by: sortBy,
            page
          };

          if (genres.length > 0) params.with_genres = genres.join(',');
          if (minRating !== undefined) params['vote_average.gte'] = minRating;
          if (maxRating !== undefined) params['vote_average.lte'] = maxRating;
          if (language && language !== 'all') params.with_original_language = language;
          if (withCast) params.with_cast = withCast;

          if (mediaType === 'movie') {
            if (yearFrom) params['primary_release_date.gte'] = `${yearFrom}-01-01`;
            if (yearTo) params['primary_release_date.lte'] = `${yearTo}-12-31`;
          } else {
            if (yearFrom) params['first_air_date.gte'] = `${yearFrom}-01-01`;
            if (yearTo) params['first_air_date.lte'] = `${yearTo}-12-31`;
          }

          const rawRes: any = await fetchTMDB(endpoint, params, 900);
          return {
            items: (rawRes.results || []).map((i: any) => normalizeRawItem(i, mediaType)),
            totalPages: rawRes.total_pages || 1,
            totalResults: rawRes.total_results || 0
          };
        };

        if (type === 'movie' || type === 'tv') {
          const res = await fetchDiscoverFor(type);
          items = res.items;
          totalPages = res.totalPages;
          totalResults = res.totalResults;
        } else {
          // 'all': fetch both and interleave
          const [moviesRes, tvRes] = await Promise.all([
            fetchDiscoverFor('movie'),
            fetchDiscoverFor('tv')
          ]);
          items = [...moviesRes.items, ...tvRes.items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
          totalPages = Math.max(moviesRes.totalPages, tvRes.totalPages);
          totalResults = moviesRes.totalResults + tvRes.totalResults;
        }
      } catch (err) {
        console.warn('TMDB Discover failed, falling back to mock filter', err);
      }
    }

    // Fallback to in-memory filter if items is empty
    if (items.length === 0) {
      let pool = [...MOCK_MEDIA_ITEMS];

      // 1. Content Type
      if (type !== 'all') {
        pool = pool.filter(i => i.mediaType === type);
      }

      // 2. Adult Mode Filter
      pool = filterAdultContent(pool, adult);

      // 3. Genres
      if (genres.length > 0) {
        pool = pool.filter(i => i.genreIds.some(g => genres.includes(g)));
      }

      // 4. Rating
      if (minRating !== undefined) {
        pool = pool.filter(i => i.voteAverage >= minRating);
      }
      if (maxRating !== undefined) {
        pool = pool.filter(i => i.voteAverage <= maxRating);
      }

      // 5. Year
      if (yearFrom !== undefined) {
        pool = pool.filter(i => i.releaseYear !== null && i.releaseYear >= yearFrom);
      }
      if (yearTo !== undefined) {
        pool = pool.filter(i => i.releaseYear !== null && i.releaseYear <= yearTo);
      }

      // 6. Language
      if (language && language !== 'all') {
        pool = pool.filter(i => i.originalLanguage === language);
      }

      // 7. Sort
      if (sortBy.startsWith('vote_average')) {
        pool.sort((a, b) => b.voteAverage - a.voteAverage);
      } else if (sortBy.startsWith('primary_release_date')) {
        pool.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
      } else {
        pool.sort((a, b) => b.popularity - a.popularity);
      }

      items = pool;
      totalPages = 1;
      totalResults = pool.length;
    }

    res.json({
      success: true,
      data: items,
      meta: {
        page,
        totalPages,
        totalResults,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
