import { Film, Compass, Flame, Heart, Sparkles } from 'lucide-react';
import { useWatchlistStore } from '../../stores/useWatchlistStore';
import { useAIChatStore } from '../../stores/useAIChatStore';
import { cn } from '../../lib/utils';

export interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export function MobileNav({ activeTab, onNavigate }: MobileNavProps) {
  const watchlistCount = useWatchlistStore((s) => s.items.length);
  const openChat = useAIChatStore((s) => s.openChat);

  const navItems = [
    { id: 'home', label: 'Home', icon: Film },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'ai', label: 'AI Agent', icon: Sparkles, isAction: true },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'watchlist', label: 'Watchlist', icon: Heart, badge: watchlistCount }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#1E2A42] bg-[#06080F]/95 backdrop-blur-xl px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={openChat}
                className="flex flex-col items-center gap-1 text-amber-400 p-1 cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold">Ask AI</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-1.5 transition-colors cursor-pointer',
                isActive ? 'text-amber-400' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-1 px-1 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
