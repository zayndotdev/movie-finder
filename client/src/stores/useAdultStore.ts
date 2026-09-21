import { create } from 'zustand';

interface AdultStoreState {
  adultMode: boolean;
  ageVerified: boolean;
  verifiedAt: number | null;
  isAgeGateOpen: boolean;
  toggleAdultMode: () => void;
  confirmAge: () => void;
  declineAge: () => void;
  openAgeGate: () => void;
  closeAgeGate: () => void;
}

const STORAGE_KEY = 'cinematch_adult_settings_v1';

function loadInitialState(): { adultMode: boolean; ageVerified: boolean; verifiedAt: number | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { adultMode: false, ageVerified: false, verifiedAt: null };
    const parsed = JSON.parse(raw);
    // Check 30-day expiration
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    if (parsed.verifiedAt && Date.now() - parsed.verifiedAt > THIRTY_DAYS_MS) {
      return { adultMode: false, ageVerified: false, verifiedAt: null };
    }
    return {
      adultMode: Boolean(parsed.adultMode),
      ageVerified: Boolean(parsed.ageVerified),
      verifiedAt: parsed.verifiedAt || null
    };
  } catch {
    return { adultMode: false, ageVerified: false, verifiedAt: null };
  }
}

function saveState(state: { adultMode: boolean; ageVerified: boolean; verifiedAt: number | null }): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save adult settings', err);
  }
}

export const useAdultStore = create<AdultStoreState>((set, get) => {
  const initial = loadInitialState();

  return {
    adultMode: initial.adultMode,
    ageVerified: initial.ageVerified,
    verifiedAt: initial.verifiedAt,
    isAgeGateOpen: false,

    toggleAdultMode: () => {
      const { adultMode, ageVerified } = get();

      // If turning ON and not verified, open the confirmation age gate dialog
      if (!adultMode && !ageVerified) {
        set({ isAgeGateOpen: true });
        return;
      }

      const nextMode = !adultMode;
      const stateToSave = {
        adultMode: nextMode,
        ageVerified: get().ageVerified,
        verifiedAt: get().verifiedAt
      };
      saveState(stateToSave);
      set({ adultMode: nextMode });
    },

    confirmAge: () => {
      const now = Date.now();
      const stateToSave = {
        adultMode: true,
        ageVerified: true,
        verifiedAt: now
      };
      saveState(stateToSave);
      set({
        adultMode: true,
        ageVerified: true,
        verifiedAt: now,
        isAgeGateOpen: false
      });
    },

    declineAge: () => {
      const stateToSave = {
        adultMode: false,
        ageVerified: false,
        verifiedAt: null
      };
      saveState(stateToSave);
      set({
        adultMode: false,
        ageVerified: false,
        verifiedAt: null,
        isAgeGateOpen: false
      });
    },

    openAgeGate: () => set({ isAgeGateOpen: true }),
    closeAgeGate: () => set({ isAgeGateOpen: false })
  };
});
