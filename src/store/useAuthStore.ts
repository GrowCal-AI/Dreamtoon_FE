import { create } from 'zustand'
import { UserProfile, SubscriptionTier, UsageInfo } from '@/types'
import { authAPI, userAPI } from '@/services/api'
import { setOnAuthExpired } from '@/services/apiClient'

interface AuthStore {
    isLoggedIn: boolean
    user: UserProfile | null
    usage: UsageInfo | null
    isLoading: boolean

    // Actions
    login: () => Promise<void>
    testLogin: (userId?: number) => Promise<void>
    logout: () => void
    fetchUser: () => Promise<void>
    refreshUsage: () => Promise<void>
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

// BE tier 문자열 → 프론트 SubscriptionTier 변환
const parseTier = (tier?: string): SubscriptionTier => {
    const t = tier?.toLowerCase()
    if (t === 'plus') return 'plus'
    if (t === 'pro') return 'pro'
    if (t === 'ultra') return 'ultra'
    return 'free'
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    isLoggedIn: !!localStorage.getItem('accessToken'),
    user: null,
    usage: null,
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

    // 사용자 정보 + 구독 usage 통합 조회
    fetchUser: async () => {
        try {
            const [userData, usageData] = await Promise.allSettled([
                userAPI.getMe(),
                userAPI.getUsage(),
            ])

            const user_d = userData.status === 'fulfilled' ? userData.value : null
            const usage_d: UsageInfo | null = usageData.status === 'fulfilled' ? usageData.value : null

            if (!user_d) return

            const user: UserProfile = {
                id: String(user_d.userId || user_d.id),
                name: user_d.nickname || user_d.name || '',
                email: user_d.email || '',
                createdAt: new Date(user_d.createdAt),
                dreamCount: user_d.dreamCount || 0,
                subscriptionTier: parseTier(usage_d?.tier),
                monthlySaveCount: usage_d?.standardGenerationCount || 0,
                usage: usage_d ?? undefined,
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
            set({ user, usage: usage_d })
        } catch (error) {
            console.error('Failed to fetch user:', error)
        }
    },

    // 결제 완료 후 usage만 재조회 (tier 갱신)
    refreshUsage: async () => {
        try {
            const usageData: UsageInfo = await userAPI.getUsage()
            set((state) => ({
                usage: usageData,
                user: state.user
                    ? { ...state.user, subscriptionTier: parseTier(usageData.tier), usage: usageData }
                    : null,
            }))
        } catch (error) {
            console.error('Failed to refresh usage:', error)
        }
    },

    logout: () => {
        authAPI.logout().catch(() => {})
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ isLoggedIn: false, user: null, usage: null })
    },

    updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
    })),

    // usage 기반 생성 가능 여부 체크
    checkSaveLimit: () => {
        const { usage, user } = get()
        if (!user) return false
        // usage 정보가 있으면 BE 판단 기준 사용
        if (usage) return usage.canGenerateStandard
        // fallback: tier 기반
        return user.subscriptionTier !== 'free' || user.monthlySaveCount < 1
    },
}))

// 401 발생 시 스토어 동기화 (apiClient에서 토큰 정리 후 호출됨)
setOnAuthExpired(() => {
    useAuthStore.setState({ isLoggedIn: false, user: null })
})
