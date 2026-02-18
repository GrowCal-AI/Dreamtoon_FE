import { create } from 'zustand'
import { UserProfile } from '@/types'
import { mockUserProfile } from '@/utils/mockData'

interface AuthStore {
    isLoggedIn: boolean
    user: UserProfile | null
    login: () => void
    logout: () => void
    updateUser: (updates: Partial<UserProfile>) => void
    checkSaveLimit: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isLoggedIn: false,
    user: null,
    login: () => {
        // Mock login with a user profile
        const user = {
            ...mockUserProfile,
            subscriptionTier: 'free' as const,
            monthlySaveCount: 0
        }
        set({ isLoggedIn: true, user })
    },
    logout: () => set({ isLoggedIn: false, user: null }),
    updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
    })),
    checkSaveLimit: () => {
        const { user } = get()
        if (!user) return false
        if (user.subscriptionTier === 'premium') return true
        return user.monthlySaveCount < 3
    }
}))
