import * as React from 'react';
import { Search, X, Film, Tv, Star, Loader2 } from 'lucide-react';
import { searchMulti } from '../../services/api';
import { UnifiedMediaItem } from '../../types';
import { buildImageUrl, cn, formatYear } from '../../lib/utils';
import { useAdultStore } from '../../stores/useAdultStore';

export interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: UnifiedMediaItem) => void;
}

export function GlobalSearch({ open, onClose, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<UnifiedMediaItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const adultMode = useAdultStore((s) => s.adultMode);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchMulti(query.trim(), 1, adultMode);
        setResults(res.data.slice(0, 8));
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, adultMode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-2xl rounded-2xl border border-[#1E2A42] bg-[#0C1220] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[#1E2A42] px-4 py-3.5 bg-[#111828]/50">
          <Search className="h-5 w-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, actors..."
            className="w-full bg-transparent text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-amber-400 shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="text-[#64748B] hover:text-[#F8FAFC] p-1 rounded-md cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded px-2 py-0.5 text-[11px] font-mono text-[#64748B] bg-[#1E2A42] border border-[#334155]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 && (
            <div className="flex flex-col gap-1">
              {results.map((item) => (
                <div
                  key={`${item.mediaType}-${item.id}`}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-[#172035] transition-colors cursor-pointer group"
                >
                  <img
                    src={buildImageUrl(item.posterPath, 'w185', 'poster')}
                    alt={item.title}
                    className="h-14 w-10 object-cover rounded-lg bg-[#1E2A42] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-amber-400 transition-colors truncate">
                        {item.title}
                      </h4>
                      <span className="text-xs text-[#64748B] shrink-0">
                        {formatYear(item.releaseDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
                        {item.mediaType === 'tv' ? (
                          <>
                            <Tv className="h-3 w-3 text-blue-400" /> TV Show
                          </>
                        ) : (
                          <>
                            <Film className="h-3 w-3 text-amber-400" /> Movie
                          </>
                        )}
                      </span>
                      <span className="text-xs text-[#334155]">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        {item.voteAverage.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="py-8 text-center text-sm text-[#94A3B8]">
              No titles found for "{query}". Try checking your spelling or mood keywords.
            </div>
          )}

          {!query.trim() && (
            <div className="py-6 px-4 text-center text-xs text-[#64748B]">
              Quickly find movies, series, or people. Press <kbd className="font-mono bg-[#1E2A42] px-1 py-0.5 rounded">Esc</kbd> to close.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
