import { create } from 'zustand'
import { UserProfile } from '@/types'
import { authAPI, userAPI } from '@/services/api'
import { setOnAuthExpired } from '@/services/apiClient'

interface AuthStore {
    isLoggedIn: boolean
    user: UserProfile | null
    isLoading: boolean

    // Actions
    login: () => Promise<void>
    testLogin: (userId?: number) => Promise<void>
    logout: () => void
    fetchUser: () => Promise<void>
    updateUser: (updates: Partial<UserProfile>) => void
    checkSaveLimit: () => boolean
    setLoggedIn: (token: string) => void
}

// 앱 시작 시 유효하지 않은 토큰 정리
const initToken = localStorage.getItem('accessToken')
if (initToken) {
    // JWT는 최소 3개의 dot-separated 파트가 있어야 함
    const parts = initToken.split('.')
    if (parts.length !== 3) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isLoggedIn: !!localStorage.getItem('accessToken'),
    user: null,
    isLoading: false,

    // OAuth2 로그인 후 토큰 설정
    setLoggedIn: (token: string) => {
        localStorage.setItem('accessToken', token)
        set({ isLoggedIn: true })
    },

    // 개발용 테스트 로그인
    testLogin: async (userId = 1) => {
        try {
            set({ isLoading: true })
            await authAPI.testLogin(userId)
            set({ isLoggedIn: true })
            await get().fetchUser()
        } catch (error) {
            console.error('Test login failed:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    // 일반 로그인 (OAuth2 콜백 후)
    login: async () => {
        set({ isLoggedIn: true })
        await get().fetchUser()
    },

    // 사용자 정보 BE에서 가져오기
    fetchUser: async () => {
        try {
            const userData = await userAPI.getMe()

            let usageData: any = {}
            try {
                usageData = await userAPI.getUsage()
            } catch {
                // 구독 정보 실패 시 무시
            }

            const user: UserProfile = {
                id: String(userData.userId || userData.id),
                name: userData.nickname || userData.name || '',
                email: userData.email || '',
                createdAt: new Date(userData.createdAt),
                dreamCount: userData.dreamCount || 0,
                subscriptionTier: usageData.tier?.toLowerCase() === 'premium' ? 'premium' : 'free',
                monthlySaveCount: usageData.generationCount || 0,
                healthIndex: {
                    stressLevel: 0,
                    anxietyLevel: 0,
                    emotionalResilience: 50,
                    relationshipStress: 0,
                    sleepQuality: 50,
                    nightmareRatio: 0,
                    lastUpdated: new Date(),
                },
            }
            set({ user })
        } catch (error) {
            console.error('Failed to fetch user:', error)
        }
    },

    logout: () => {
        authAPI.logout().catch(() => {})
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ isLoggedIn: false, user: null })
    },

    updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
    })),

    checkSaveLimit: () => {
        const { user } = get()
        if (!user) return false
        if (user.subscriptionTier === 'premium') return true
        return user.monthlySaveCount < 3
    },
}))

// 401 발생 시 스토어 동기화 (apiClient에서 토큰 정리 후 호출됨)
setOnAuthExpired(() => {
    useAuthStore.setState({ isLoggedIn: false, user: null })
})
