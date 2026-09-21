import { Dialog, DialogTitle } from '../ui/Dialog';

export interface TrailerModalProps {
  trailerKey: string | null;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function TrailerModal({ trailerKey, title, open, onClose }: TrailerModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()} className="max-w-4xl p-0 overflow-hidden bg-black border-slate-800">
      <div className="p-4 pb-2 bg-[#0C1220] border-b border-[#1E2A42]">
        <DialogTitle className="text-base font-bold text-[#F8FAFC]">
          {title} — Official Trailer
        </DialogTitle>
      </div>

      <div className="relative aspect-video w-full bg-black">
        {trailerKey ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
            title={`${title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">
            No video trailer available for this title.
          </div>
        )}
      </div>
    </Dialog>
  );
}
