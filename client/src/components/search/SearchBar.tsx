import * as React from 'react';
import { Search, Sparkles, X, Shuffle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onSurpriseMe?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onSurpriseMe,
  placeholder = "Describe what you want to watch... (e.g., 'wholesome Bollywood comedy' or 'dark Korean thriller')",
  isLoading = false,
  className
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full max-w-3xl mx-auto', className)}
    >
      <div className="relative flex items-center rounded-2xl border-2 border-[#1E2A42] bg-[#0C1220]/90 backdrop-blur-xl p-2 shadow-2xl focus-within:border-amber-500/60 focus-within:shadow-amber-500/10 transition-all duration-300">
        <div className="pl-3 pr-2 text-amber-400 shrink-0">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-2 py-2.5 text-sm sm:text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 text-[#64748B] hover:text-[#F8FAFC] rounded-lg transition-colors cursor-pointer mr-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {onSurpriseMe && !value && (
          <button
            type="button"
            onClick={onSurpriseMe}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-amber-300 hover:bg-[#172035] transition-colors border border-[#1E2A42] mr-2 cursor-pointer shrink-0"
            title="Surprise me with a top recommendation"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Surprise Me
          </button>
        )}

        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-sm text-slate-950 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </form>
  );
}
