import apiClient from './apiClient'
import { DreamEntry, DreamInputForm } from '@/types'

// === 인증 API ===
export const authAPI = {
  testLogin: async (userId: number = 1) => {
    const { data } = await apiClient.post<{ accessToken: string; refreshToken: string }>(
      `/auth/test-login?userId=${userId}`
    )
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return data
  },

  /** Refresh Token은 HttpOnly Cookie로 전달됨. credentials 포함해 호출하면 됨. */
  refresh: async () => {
    const { data } = await apiClient.post('/auth/refresh', {})
    return data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('accessToken')
    // refreshToken은 HttpOnly Cookie → 서버에서 로그아웃 시 제거됨
  },
}

// === 사용자 API ===
export const userAPI = {
  getMe: async () => {
    const { data } = await apiClient.get('/users/me')
    return data
  },

  updateNickname: async (nickname: string) => {
    const { data } = await apiClient.patch(`/users/me/nickname?nickname=${encodeURIComponent(nickname)}`)
    return data
  },

  // 구독 사용량 조회 (subscriptions/usage)
  getUsage: async () => {
    const { data } = await apiClient.get('/subscriptions/usage')
    return data
  },

  // 권한 및 사용량 상세 조회
  getPermissions: async () => {
    const { data } = await apiClient.get('/users/me/permissions')
    return data
  },
}

// === 꿈 API ===
export const dreamAPI = {
  // [방법 B] Step 1: 꿈 기록 시작 (title + content)
  initiateDream: async (title: string, content: string): Promise<{ dreamId: number; status: string }> => {
    const { data } = await apiClient.post('/dreams', { title, dreamContent: content })
    return data
  },

  // [방법 B] Step 2: 감정 선택
  selectEmotion: async (dreamId: number, emotion: string): Promise<void> => {
    await apiClient.patch(`/dreams/${dreamId}/emotion`, { emotion })
  },

  // [방법 B] Step 3: 장르 선택 → 비동기 AI 분석 시작 (202 Accepted)
  addDetails: async (
    dreamId: number,
    selectedGenre: string
  ): Promise<{ dreamId: number; status: string; message: string }> => {
    const { data } = await apiClient.patch(`/dreams/${dreamId}/details`, { selectedGenre })
    return data
  },

  // [방법 A] 한 번에 전송 (권장)
  createDream: async (form: DreamInputForm): Promise<{ dreamId: string; status: string }> => {
    const payload = {
      title: form.title,
      content: form.content,
      mainEmotion: form.mainEmotion?.toUpperCase(),
      style: form.style?.toUpperCase(),
    }
    console.log('[createDream] 요청 payload:', payload)
    const { data } = await apiClient.post('/dreams/create', payload)
    console.log('[createDream] 응답 data:', data)
    return data
  },

  // 꿈 목록 조회 (페이지네이션)
  getAllDreams: async (page = 0, size = 20) => {
    const { data } = await apiClient.get('/dreams', { params: { page, size } })
    return data
  },

  // 특정 꿈 조회
  getDream: async (dreamId: string): Promise<DreamEntry> => {
    const { data } = await apiClient.get<DreamEntry>(`/dreams/${dreamId}`)
    return data
  },

  // 꿈 삭제
  deleteDream: async (dreamId: string): Promise<void> => {
    await apiClient.delete(`/dreams/${dreamId}`)
  },

  // 즐겨찾기 토글
  toggleFavorite: async (dreamId: string): Promise<{ dreamId: number; isFavorite: boolean }> => {
    const { data } = await apiClient.patch(`/dreams/${dreamId}/favorite`)
    return data
  },

  // 라이브러리에 추가
  addToLibrary: async (dreamId: string): Promise<{ dreamId: number; isInLibrary: boolean }> => {
    const { data } = await apiClient.post(`/dreams/${dreamId}/library`)
    return data
  },

  // 웹툰 생성 요청
  generateWebtoon: async (
    dreamId: string,
    genre: string
  ): Promise<{ dreamId: number; status: string; message: string }> => {
    const { data } = await apiClient.post(`/dreams/${dreamId}/webtoon`, {
      selectedGenre: genre,
    })
    return data
  },

  // 분석 결과 조회 (폴링용)
  getAnalysis: async (dreamId: string) => {
    const { data } = await apiClient.get(`/dreams/${dreamId}/analysis`)
    return data
  },

  // 꿈 대화 보내기
  sendChatMessage: async (dreamId: string, message: string) => {
    const { data } = await apiClient.post(`/dreams/${dreamId}/chat`, { message })
    return data
  },

  // 꿈 대화 기록 조회
  getChatHistory: async (dreamId: string) => {
    const { data } = await apiClient.get(`/dreams/${dreamId}/chat`)
    return data
  },
}

// === 음성 API ===
export const voiceAPI = {
  transcribe: async (audioBlob: Blob): Promise<{ text: string }> => {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    const { data } = await apiClient.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}

// === 라이브러리 API ===
export const libraryAPI = {
  getLibrary: async (params?: {
    favorite?: boolean
    genre?: string
    search?: string
    sort?: string
    page?: number
    size?: number
  }) => {
    const { data } = await apiClient.get('/library', { params })
    return data
  },
}

// === 구독 결제 API ===
export const subscriptionAPI = {
  // Polar Checkout Session 생성 → checkoutUrl로 이동
  createCheckout: async (tier: 'PLUS' | 'PRO' | 'ULTRA'): Promise<{ checkoutUrl: string; checkoutId: string; tier: string }> => {
    const { data } = await apiClient.post('/subscriptions/checkout', { tier })
    return data
  },

  // 유료 구독자 전용: Polar 구독 관리 포털 URL 조회
  getPortalUrl: async (): Promise<{ portalUrl: string }> => {
    const { data } = await apiClient.get('/subscriptions/portal')
    return data
  },

  // Polar 구독 정보를 로컬 DB에 동기화 (웹훅 누락 복구용)
  syncSubscription: async () => {
    const { data } = await apiClient.post('/subscriptions/sync')
    return data
  },

  // 관리자용 구독 티어 강제 변경 (개발/테스트용)
  adminSetTier: async (userId: number, tier: 'FREE' | 'PLUS' | 'PRO' | 'ULTRA'): Promise<void> => {
    await apiClient.patch(`/admin/users/${userId}/subscription`, { tier })
  },
}

// === 분석 API ===
export const analyticsAPI = {
  getHealthIndex: async () => {
    const { data } = await apiClient.get('/analytics/health-index')
    return data
  },

  getEmotionAnalysis: async (period: 'week' | 'month' | 'year' = 'month') => {
    const { data } = await apiClient.get('/analytics/emotions', { params: { period } })
    return data
  },

  getDreamPatterns: async () => {
    const { data } = await apiClient.get('/analytics/patterns')
    return data
  },
}
