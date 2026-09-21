import { CastMember } from '../../types';
import { buildImageUrl } from '../../lib/utils';
import { User } from 'lucide-react';

export interface CastListProps {
  cast: CastMember[];
  onSelectActor?: (actorId: number) => void;
}

export function CastList({ cast, onSelectActor }: CastListProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="py-4">
      <h3 className="text-lg font-bold text-[#F8FAFC] mb-4">Top Cast</h3>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {cast.slice(0, 12).map((actor) => (
          <div
            key={actor.id}
            onClick={() => onSelectActor?.(actor.id)}
            className="flex flex-col items-center text-center w-24 shrink-0 group cursor-pointer"
          >
            <div className="h-20 w-20 rounded-full overflow-hidden bg-[#172035] border-2 border-[#1E2A42] group-hover:border-amber-400 transition-all duration-200 shadow-md">
              {actor.profilePath ? (
                <img
                  src={buildImageUrl(actor.profilePath, 'w185', 'profile')}
                  alt={actor.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-[#64748B]">
                  <User className="h-8 w-8" />
                </div>
              )}
            </div>
            <span className="font-semibold text-xs text-[#F8FAFC] group-hover:text-amber-400 transition-colors mt-2 line-clamp-1">
              {actor.name}
            </span>
            <span className="text-[11px] text-[#64748B] line-clamp-1">{actor.character}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
