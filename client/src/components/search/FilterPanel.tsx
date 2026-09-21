import { Film, Tv, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useFilterStore } from '../../stores/useFilterStore';
import { cn } from '../../lib/utils';

export const GENRE_OPTIONS = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

export const LANGUAGE_OPTIONS = [
  { code: 'all', label: 'All Languages' },
  { code: 'en', label: 'English / Hollywood' },
  { code: 'hi', label: 'Hindi / Bollywood' },
  { code: 'ko', label: 'Korean' },
  { code: 'ja', label: 'Japanese' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' }
];

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Recently Released' }
];

export function FilterPanel({ className }: { className?: string }) {
  const {
    contentType,
    selectedGenres,
    ratingRange,
    selectedLanguage,
    sortBy,
    setContentType,
    toggleGenre,
    setRatingRange,
    setSelectedLanguage,
    setSortBy,
    resetFilters
  } = useFilterStore();

  const minRating = ratingRange[0];

  return (
    <aside className={cn('flex flex-col gap-6 p-5 rounded-3xl bg-[#0C1220] border border-[#1E2A42]', className)}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2A42]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-amber-400" />
          <h3 className="font-bold text-base text-[#F8FAFC]">Filters</h3>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-[#94A3B8] hover:text-amber-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* 1. Content Type Switcher */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2 block">
          Content Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#111828] rounded-xl border border-[#1E2A42]">
          <button
            type="button"
            onClick={() => setContentType('all')}
            className={cn(
              'py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              contentType === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setContentType('movie')}
            className={cn(
              'flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              contentType === 'movie'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            )}
          >
            <Film className="h-3 w-3" />
            Movies
          </button>
          <button
            type="button"
            onClick={() => setContentType('tv')}
            className={cn(
              'flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer',
              contentType === 'tv'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            )}
          >
            <Tv className="h-3 w-3" />
            TV Shows
          </button>
        </div>
      </div>

      {/* 2. Rating Threshold */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Minimum Rating
          </label>
          <span className="text-xs font-bold text-amber-400">
            {minRating === 0 ? 'Any Rating' : `${minRating.toFixed(1)}+ Stars`}
          </span>
        </div>
        <div className="flex gap-1.5">
          {[0, 6.0, 7.0, 8.0, 8.5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setRatingRange([val, 10])}
              className={cn(
                'flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer',
                minRating === val
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-[#111828] text-[#94A3B8] border-[#1E2A42] hover:border-amber-500/40 hover:text-[#F8FAFC]'
              )}
            >
              {val === 0 ? 'All' : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Language Selection */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2 block">
          Language / Region
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-[#111828] border border-[#1E2A42] text-[#F8FAFC] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500/50 cursor-pointer"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code} className="bg-[#111828] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Sort Order */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2 block">
          Sort Results By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-[#111828] border border-[#1E2A42] text-[#F8FAFC] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500/50 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111828] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Genres Pill Cloud */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
            Genres ({selectedGenres.length})
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {GENRE_OPTIONS.map((genre) => {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer',
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-[#111828] text-[#94A3B8] border-[#1E2A42] hover:border-amber-500/40 hover:text-[#F8FAFC]'
                )}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
