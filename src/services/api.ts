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

  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken })
    return data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
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

  getUsage: async () => {
    const { data } = await apiClient.get('/subscriptions/usage')
    return data
  },
}

// === 꿈 API ===
export const dreamAPI = {
  // Step 1: 꿈 기록 시작
  initiateDream: async (dreamContent: string): Promise<{ dreamId: number; systemMessage: string }> => {
    const { data } = await apiClient.post('/dreams', { dreamContent })
    return data
  },

  // Step 2: 감정 선택
  selectEmotion: async (dreamId: number, primaryEmotion: string): Promise<{ systemMessage: string }> => {
    const { data } = await apiClient.patch(`/dreams/${dreamId}/emotion`, { primaryEmotion })
    return data
  },

  // Step 3: 상세 설명 입력 (비동기 분석 시작)
  addDetails: async (
    dreamId: number,
    detailedDescription: string,
    realLifeContext?: string
  ): Promise<{ dreamId: number; status: string; message: string }> => {
    const { data } = await apiClient.patch(`/dreams/${dreamId}/details`, {
      detailedDescription,
      realLifeContext,
    })
    return data
  },

  // 통합 꿈 생성 (FE 메인 플로우 - 한 번에 생성)
  createDream: async (form: DreamInputForm): Promise<DreamEntry> => {
    const { data } = await apiClient.post<DreamEntry>('/dreams/create', {
      title: form.title,
      content: form.content,
      mainEmotion: form.mainEmotion?.toUpperCase(),
      style: form.style,
      characters: form.characters,
      location: form.location,
      lastScene: form.lastScene,
    })
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
      selectedGenre: genre.toUpperCase(),
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
