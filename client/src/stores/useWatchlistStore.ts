import { create } from 'zustand';
import { UnifiedMediaItem } from '../types';

export type WatchlistStatus = 'want_to_watch' | 'watched' | 'favorite';

export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string | null;
  releaseYear: number | null;
  voteAverage: number;
  genres: string[];
  status: WatchlistStatus;
  addedAt: number;
  userRating?: number;
}

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: UnifiedMediaItem, status?: WatchlistStatus) => void;
  removeItem: (id: number, mediaType: 'movie' | 'tv') => void;
  updateStatus: (id: number, mediaType: 'movie' | 'tv', status: WatchlistStatus) => void;
  setUserRating: (id: number, mediaType: 'movie' | 'tv', rating: number) => void;
  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => boolean;
  getItemStatus: (id: number, mediaType: 'movie' | 'tv') => WatchlistStatus | null;
  clearWatchlist: () => void;
}

const STORAGE_KEY = 'cinematch_watchlist_v1';

function loadInitialItems(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load watchlist from localStorage', err);
    return [];
  }
}

function saveItems(items: WatchlistItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save watchlist to localStorage', err);
  }
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: loadInitialItems(),

  addItem: (item: UnifiedMediaItem, status: WatchlistStatus = 'want_to_watch') => {
    const current = get().items;
    const exists = current.some(i => i.id === item.id && i.mediaType === item.mediaType);
    if (exists) {
      get().updateStatus(item.id, item.mediaType, status);
      return;
    }

    const newItem: WatchlistItem = {
      id: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      releaseYear: item.releaseYear,
      voteAverage: item.voteAverage,
      genres: item.genreNames,
      status,
      addedAt: Date.now()
    };

    const updated = [newItem, ...current];
    saveItems(updated);
    set({ items: updated });
  },

  removeItem: (id: number, mediaType: 'movie' | 'tv') => {
    const updated = get().items.filter(i => !(i.id === id && i.mediaType === mediaType));
    saveItems(updated);
    set({ items: updated });
  },

  updateStatus: (id: number, mediaType: 'movie' | 'tv', status: WatchlistStatus) => {
    const updated = get().items.map(i => {
      if (i.id === id && i.mediaType === mediaType) {
        return { ...i, status };
      }
      return i;
    });
    saveItems(updated);
    set({ items: updated });
  },

  setUserRating: (id: number, mediaType: 'movie' | 'tv', rating: number) => {
    const updated = get().items.map(i => {
      if (i.id === id && i.mediaType === mediaType) {
        return { ...i, userRating: rating };
      }
      return i;
    });
    saveItems(updated);
    set({ items: updated });
  },

  isInWatchlist: (id: number, mediaType: 'movie' | 'tv') => {
    return get().items.some(i => i.id === id && i.mediaType === mediaType);
  },

  getItemStatus: (id: number, mediaType: 'movie' | 'tv') => {
    const found = get().items.find(i => i.id === id && i.mediaType === mediaType);
    return found ? found.status : null;
  },

  clearWatchlist: () => {
    saveItems([]);
    set({ items: [] });
  }
}));
