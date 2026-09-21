import { WatchProvider } from '../../types';
import { Tv, Info } from 'lucide-react';
import { buildImageUrl } from '../../lib/utils';

export interface WatchProvidersListProps {
  providers?: {
    country: string;
    flatrate: WatchProvider[];
    rent: WatchProvider[];
    buy: WatchProvider[];
  };
}

export function WatchProvidersList({ providers }: WatchProvidersListProps) {
  const hasStream = providers?.flatrate && providers.flatrate.length > 0;
  const hasRent = providers?.rent && providers.rent.length > 0;
  const hasBuy = providers?.buy && providers.buy.length > 0;

  if (!hasStream && !hasRent && !hasBuy) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-2xl bg-[#111828] border border-[#1E2A42] text-xs text-[#94A3B8]">
        <Info className="h-4 w-4 text-amber-400 shrink-0" />
        <span>Streaming options vary by region. Check your local theater or regional provider catalogue.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#111828] border border-[#1E2A42]">
      <div className="flex items-center gap-2">
        <Tv className="h-4 w-4 text-amber-400" />
        <h4 className="font-bold text-sm text-[#F8FAFC]">Where to Watch ({providers?.country || 'US'})</h4>
      </div>

      {hasStream && (
        <div>
          <span className="text-xs font-semibold text-[#94A3B8] block mb-2">Stream Subscription</span>
          <div className="flex flex-wrap gap-2.5">
            {providers!.flatrate.map((p) => (
              <div
                key={p.providerId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0C1220] border border-[#1E2A42]"
                title={p.providerName}
              >
                <img
                  src={buildImageUrl(p.logoPath, 'w185', 'profile')}
                  alt={p.providerName}
                  className="h-6 w-6 rounded-md object-contain"
                />
                <span className="text-xs font-medium text-[#F8FAFC]">{p.providerName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(hasRent || hasBuy) && (
        <div className="pt-2 border-t border-[#1E2A42]/60">
          <span className="text-xs font-semibold text-[#94A3B8] block mb-2">Rent or Purchase</span>
          <div className="flex flex-wrap gap-2">
            {[...(providers?.rent || []), ...(providers?.buy || [])]
              .filter((v, i, a) => a.findIndex((t) => t.providerId === v.providerId) === i)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.providerId}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C1220] border border-[#1E2A42] text-[11px] text-[#94A3B8]"
                  title={p.providerName}
                >
                  <img
                    src={buildImageUrl(p.logoPath, 'w185', 'profile')}
                    alt={p.providerName}
                    className="h-4 w-4 rounded-sm object-contain"
                  />
                  <span>{p.providerName}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
