import { Sparkles, Search, Heart, Film, Flame, Compass } from 'lucide-react';
import { AdultToggle } from '../adult/AdultToggle';
import { useWatchlistStore } from '../../stores/useWatchlistStore';
import { useAIChatStore } from '../../stores/useAIChatStore';
import { cn } from '../../lib/utils';

export interface TopNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
}

export function TopNav({ activeTab, onNavigate, onOpenSearch }: TopNavProps) {
  const watchlistCount = useWatchlistStore((s) => s.items.length);
  const openChat = useAIChatStore((s) => s.openChat);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Film },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'watchlist', label: 'Watchlist', icon: Heart, badge: watchlistCount }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2A42] bg-[#06080F]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Film className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-[#F8FAFC]">
              Cine<span className="text-amber-400">Match</span>
            </span>
            <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase -mt-1">
              AI Discovery
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111828]/60 p-1.5 rounded-2xl border border-[#1E2A42]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate(link.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#172035]'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={cn(
                      'ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions (Search, AI Trigger, 18+ Toggle) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Search Shortcut Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111828] border border-[#1E2A42] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-amber-500/40 transition-colors cursor-pointer text-xs font-medium"
            title="Search movies & TV shows (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-amber-400" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden sm:inline-block rounded px-1.5 py-0.5 text-[10px] font-mono text-[#64748B] bg-[#0C1220] border border-[#1E2A42]">
              Ctrl+K
            </kbd>
          </button>

          {/* AI Agent Chat Trigger Button */}
          <button
            type="button"
            onClick={openChat}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all text-xs sm:text-sm font-bold shadow-sm cursor-pointer"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* 18+ Adult Toggle */}
          <AdultToggle />
        </div>
      </div>
    </header>
  );
}
