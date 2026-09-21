import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/Dialog';
import { useAdultStore } from '../../stores/useAdultStore';
import { useToast } from '../ui/Toast';

export function AgeGateDialog() {
  const { isAgeGateOpen, closeAgeGate, confirmAge, declineAge } = useAdultStore();
  const { addToast } = useToast();

  const handleConfirm = () => {
    confirmAge();
    addToast({
      title: '18+ Adult Mode Activated',
      description: 'Exclusive uncensored content is now active.',
      type: 'error'
    });
  };

  const handleDecline = () => {
    declineAge();
  };

  return (
    <Dialog open={isAgeGateOpen} onOpenChange={(open) => !open && closeAgeGate()}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 glow-red">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div>
          <DialogTitle className="text-red-400">Adult & Uncensored Content</DialogTitle>
          <span className="text-xs font-bold uppercase tracking-wider text-red-500/80">Age Verification Required</span>
        </div>
      </div>

      <DialogDescription className="space-y-3 pt-2">
        <p>
          Enabling the 18+ filter activates <strong className="text-white">exclusive adult mode</strong>. All general family and mainstream titles will be replaced exclusively with 18+ certified films, Japanese uncensored cinema (R18+), French arthouse erotica, and mature uncut releases.
        </p>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span>By continuing, you verify that you are at least 18 years of age (or legal age of majority in your jurisdiction).</span>
        </div>
      </DialogDescription>

      <DialogFooter className="mt-6">
        <button
          type="button"
          onClick={handleDecline}
          className="px-4 py-2.5 rounded-xl border border-[#1E2A42] bg-[#111828] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-semibold transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          I am 18 or Older — Enter
        </button>
      </DialogFooter>
    </Dialog>
  );
}
