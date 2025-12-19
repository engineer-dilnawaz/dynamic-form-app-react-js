import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CategorySchema } from '../types';

interface SchemaState {
  schemas: CategorySchema[];
  addSchema: (schema: CategorySchema) => void;
  updateSchema: (id: string, schema: Partial<CategorySchema>) => void;
  deleteSchema: (id: string) => void;
  getSchema: (id: string) => CategorySchema | undefined;
}

export const useSchemaStore = create<SchemaState>()(
  persist(
    (set, get) => ({
      schemas: [],
      addSchema: (schema) =>
        set((state) => ({ schemas: [...state.schemas, schema] })),
      updateSchema: (id, updated) =>
        set((state) => ({
          schemas: state.schemas.map((s) =>
            s.id === id ? { ...s, ...updated } : s
          ),
        })),
      deleteSchema: (id) =>
        set((state) => ({
          schemas: state.schemas.filter((s) => s.id !== id),
        })),
      getSchema: (id) => get().schemas.find((s) => s.id === id),
    }),
    {
      name: 'form-schemas',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
