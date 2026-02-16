import { create } from 'zustand'
import { DreamEntry, UserProfile } from '@/types'
import { mockDreams } from '@/utils/mockData'

interface DreamStore {
  // State
  dreams: DreamEntry[]
  currentDream: DreamEntry | null
  userProfile: UserProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  setDreams: (dreams: DreamEntry[]) => void
  addDream: (dream: DreamEntry) => void
  updateDream: (id: string, updates: Partial<DreamEntry>) => void
  deleteDream: (id: string) => void
  setCurrentDream: (dream: DreamEntry | null) => void
  toggleFavorite: (id: string) => void
  setUserProfile: (profile: UserProfile) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDreamStore = create<DreamStore>((set) => ({
  // Initial state
  dreams: mockDreams,
  currentDream: null,
  userProfile: null,
  isLoading: false,
  error: null,

  // Actions
  setDreams: (dreams) => set({ dreams }),

  addDream: (dream) => set((state) => ({
    dreams: [dream, ...state.dreams]
  })),

  updateDream: (id, updates) => set((state) => ({
    dreams: state.dreams.map((dream) =>
      dream.id === id ? { ...dream, ...updates } : dream
    ),
  })),

  deleteDream: (id) => set((state) => ({
    dreams: state.dreams.filter((dream) => dream.id !== id),
  })),

  setCurrentDream: (dream) => set({ currentDream: dream }),

  toggleFavorite: (id) => set((state) => ({
    dreams: state.dreams.map((dream) =>
      dream.id === id ? { ...dream, isFavorite: !dream.isFavorite } : dream
    ),
  })),

  setUserProfile: (profile) => set({ userProfile: profile }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}))
