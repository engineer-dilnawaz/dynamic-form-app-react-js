import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FormEntry } from '../types';

interface EntryState {
  entries: FormEntry[];
  addEntry: (entry: FormEntry) => void;
  deleteEntry: (id: string) => void;
  getEntriesByCategory: (categoryId: string) => FormEntry[];
}

export const useEntryStore = create<EntryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({ entries: [entry, ...state.entries] })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      getEntriesByCategory: (categoryId) =>
        get().entries.filter((e) => e.categoryId === categoryId),
    }),
    {
      name: 'form-entries',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
