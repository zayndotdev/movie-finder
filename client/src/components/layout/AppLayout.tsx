import * as React from 'react';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { Toaster } from '../ui/Toast';
import { AgeGateDialog } from '../adult/AgeGateDialog';
import { GlobalSearch } from '../search/GlobalSearch';
import { AIChatPanel } from '../search/AIChatPanel';
import { UnifiedMediaItem } from '../../types';

export interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onSelectMedia: (item: UnifiedMediaItem) => void;
}

export function AppLayout({
  children,
  activeTab,
  onNavigate,
  onSelectMedia
}: AppLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Global Ctrl+K / Cmd+K listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#06080F] text-[#F8FAFC]">
      <TopNav
        activeTab={activeTab}
        onNavigate={onNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      <Footer />
      <MobileNav activeTab={activeTab} onNavigate={onNavigate} />

      {/* Global Overlays & Modals */}
      <GlobalSearch
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={onSelectMedia}
      />
      <AgeGateDialog />
      <AIChatPanel onSelectMedia={onSelectMedia} />
      <Toaster />
    </div>
  );
}
