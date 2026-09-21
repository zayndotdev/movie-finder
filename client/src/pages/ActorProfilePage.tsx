import * as React from 'react';
import { ArrowLeft, User, Calendar, MapPin, Film, Tv, Loader2 } from 'lucide-react';
import { PersonDetail, UnifiedMediaItem } from '../types';
import { fetchPersonDetail } from '../services/api';
import { buildImageUrl } from '../lib/utils';
import { ContentGrid } from '../components/content/ContentGrid';

export interface ActorProfilePageProps {
  actorId: number;
  onBack: () => void;
  onSelectMedia: (item: UnifiedMediaItem) => void;
}

export function ActorProfilePage({
  actorId,
  onBack,
  onSelectMedia
}: ActorProfilePageProps) {
  const [person, setPerson] = React.useState<PersonDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<'all' | 'movie' | 'tv'>('all');

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadActor = async () => {
      try {
        const res = await fetchPersonDetail(actorId);
        if (isMounted && res.data) {
          setPerson(res.data);
        }
      } catch (err) {
        console.error('Failed to load actor profile', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadActor();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [actorId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <span className="text-sm font-semibold text-[#94A3B8]">Loading profile...</span>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="mx-auto max-w-lg py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const credits = (person.combinedCredits || []).filter((item) => {
    if (filterType === 'all') return true;
    return item.mediaType === filterType;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111828] border border-[#1E2A42] text-[#F8FAFC] hover:border-amber-500/40 text-xs sm:text-sm font-semibold transition-all mb-8 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row gap-8 items-start mb-12 pb-12 border-b border-[#1E2A42]">
        <div className="h-48 w-48 sm:h-64 sm:w-64 rounded-3xl overflow-hidden bg-[#111828] border-2 border-[#1E2A42] shadow-2xl shrink-0 mx-auto sm:mx-0">
          {person.profilePath ? (
            <img
              src={buildImageUrl(person.profilePath, 'h632', 'profile')}
              alt={person.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[#64748B]">
              <User className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            {person.knownForDepartment || 'Acting'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#F8FAFC] mb-4">
            {person.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#94A3B8] mb-6">
            {person.birthday && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-400" />
                Born {person.birthday}
              </span>
            )}
            {person.placeOfBirth && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-400" />
                {person.placeOfBirth}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-h-40 overflow-y-auto pr-2">
            {person.biography || 'No biography details recorded.'}
          </p>
        </div>
      </div>

      {/* Filmography Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black text-[#F8FAFC]">
            Filmography ({credits.length})
          </h2>

          <div className="flex items-center gap-1 p-1 bg-[#111828] rounded-xl border border-[#1E2A42] self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'movie' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Film className="h-3 w-3" />
              Movies
            </button>
            <button
              onClick={() => setFilterType('tv')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'tv' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Tv className="h-3 w-3" />
              TV Shows
            </button>
          </div>
        </div>

        <ContentGrid
          items={credits}
          onSelect={onSelectMedia}
          emptyTitle="No credits found"
          emptyDescription="No movie or television credits matched this filter."
        />
      </div>
    </div>
  );
}
