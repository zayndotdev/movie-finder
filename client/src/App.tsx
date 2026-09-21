import * as React from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { TVDetailPage } from './pages/TVDetailPage';
import { ActorProfilePage } from './pages/ActorProfilePage';
import { UnifiedMediaItem } from './types';

export function App() {
  const [activeTab, setActiveTab] = React.useState<string>('home');
  const [selectedMedia, setSelectedMedia] = React.useState<{ id: number; mediaType: 'movie' | 'tv' } | null>(null);
  const [selectedActorId, setSelectedActorId] = React.useState<number | null>(null);

  const handleNavigate = (tab: string) => {
    setSelectedMedia(null);
    setSelectedActorId(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMedia = (item: UnifiedMediaItem) => {
    setSelectedActorId(null);
    setSelectedMedia({ id: item.id, mediaType: item.mediaType });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectActor = (actorId: number) => {
    setSelectedActorId(actorId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedActorId !== null && selectedMedia !== null) {
      setSelectedActorId(null);
    } else {
      setSelectedMedia(null);
      setSelectedActorId(null);
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onNavigate={handleNavigate}
      onSelectMedia={handleSelectMedia}
    >
      {selectedActorId !== null ? (
        <ActorProfilePage
          actorId={selectedActorId}
          onBack={handleBack}
          onSelectMedia={handleSelectMedia}
        />
      ) : selectedMedia !== null ? (
        selectedMedia.mediaType === 'tv' ? (
          <TVDetailPage
            tvId={selectedMedia.id}
            onBack={handleBack}
            onSelectMedia={handleSelectMedia}
            onSelectActor={handleSelectActor}
          />
        ) : (
          <MovieDetailPage
            movieId={selectedMedia.id}
            onBack={handleBack}
            onSelectMedia={handleSelectMedia}
            onSelectActor={handleSelectActor}
          />
        )
      ) : activeTab === 'discover' ? (
        <DiscoverPage onSelectMedia={handleSelectMedia} />
      ) : activeTab === 'trending' ? (
        <TrendingPage onSelectMedia={handleSelectMedia} />
      ) : activeTab === 'watchlist' ? (
        <WatchlistPage onSelectMedia={handleSelectMedia} onNavigate={handleNavigate} />
      ) : (
        <HomePage onSelectMedia={handleSelectMedia} onNavigate={handleNavigate} />
      )}
    </AppLayout>
  );
}

export default App;
