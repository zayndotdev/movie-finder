import { create } from 'zustand';

export interface FilterState {
  contentType: 'all' | 'movie' | 'tv';
  selectedGenres: number[];
  ratingRange: [number, number];
  yearRange: [number, number];
  selectedLanguage: string;
  sortBy: string;
  page: number;
  searchQuery: string;

  setContentType: (type: 'all' | 'movie' | 'tv') => void;
  toggleGenre: (id: number) => void;
  setRatingRange: (range: [number, number]) => void;
  setYearRange: (range: [number, number]) => void;
  setSelectedLanguage: (lang: string) => void;
  setSortBy: (sort: string) => void;
  setPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  contentType: 'all' as const,
  selectedGenres: [] as number[],
  ratingRange: [0, 10] as [number, number],
  yearRange: [1970, 2026] as [number, number],
  selectedLanguage: 'all',
  sortBy: 'popularity.desc',
  page: 1,
  searchQuery: ''
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTERS,

  setContentType: (contentType) => set({ contentType, page: 1 }),

  toggleGenre: (id) =>
    set((state) => {
      const exists = state.selectedGenres.includes(id);
      const updated = exists
        ? state.selectedGenres.filter((g) => g !== id)
        : [...state.selectedGenres, id];
      return { selectedGenres: updated, page: 1 };
    }),

  setRatingRange: (ratingRange) => set({ ratingRange, page: 1 }),

  setYearRange: (yearRange) => set({ yearRange, page: 1 }),

  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage, page: 1 }),

  setSortBy: (sortBy) => set({ sortBy, page: 1 }),

  setPage: (page) => set({ page }),

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  resetFilters: () => set({ ...DEFAULT_FILTERS })
}));
