import { create } from 'zustand'
import { DreamEntry, UserProfile } from '@/types'
import { dreamAPI } from '@/services/api'

interface DreamStore {
  dreams: DreamEntry[]
  currentDream: DreamEntry | null
  userProfile: UserProfile | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchDreams: () => Promise<void>
  setDreams: (dreams: DreamEntry[]) => void
  addDream: (dream: DreamEntry) => void
  updateDream: (id: string, updates: Partial<DreamEntry>) => void
  deleteDream: (id: string) => Promise<void>
  setCurrentDream: (dream: DreamEntry | null) => void
  toggleFavorite: (id: string) => Promise<void>
  setUserProfile: (profile: UserProfile) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDreamStore = create<DreamStore>((set) => ({
  dreams: [],
  currentDream: null,
  userProfile: null,
  isLoading: false,
  error: null,

  // BE에서 꿈 목록 가져오기
  fetchDreams: async () => {
    try {
      set({ isLoading: true, error: null })
      const result = await dreamAPI.getAllDreams()
      const dreams = result.content || (result as unknown as DreamEntry[])
      set({ dreams, isLoading: false })
    } catch (error: any) {
      console.error('Failed to fetch dreams:', error)
      set({ error: error.message || '꿈 목록을 불러오지 못했습니다.', isLoading: false })
    }
  },

  setDreams: (dreams) => set({ dreams }),

  addDream: (dream) => set((state) => ({
    dreams: [dream, ...state.dreams],
  })),

  updateDream: (id, updates) => set((state) => ({
    dreams: state.dreams.map((dream) =>
      dream.id === id ? { ...dream, ...updates } : dream
    ),
  })),

  // BE API로 삭제
  deleteDream: async (id) => {
    try {
      await dreamAPI.deleteDream(id)
      set((state) => ({
        dreams: state.dreams.filter((dream) => dream.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete dream:', error)
    }
  },

  setCurrentDream: (dream) => set({ currentDream: dream }),

  // BE API로 즐겨찾기 토글
  toggleFavorite: async (id) => {
    try {
      const result = await dreamAPI.toggleFavorite(id)
      set((state) => ({
        dreams: state.dreams.map((dream) =>
          dream.id === id ? { ...dream, isFavorite: result.isFavorite } : dream
        ),
      }))
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      // 낙관적 업데이트 실패 시 롤백
    }
  },

  setUserProfile: (profile) => set({ userProfile: profile }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
