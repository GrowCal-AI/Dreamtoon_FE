import { DreamEntry, DreamInputForm, WebtoonGenerationRequest, WebtoonGenerationResponse } from '@/types'

// API Base URL (환경변수로 관리 권장)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// API 요청 헬퍼
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Dream API
export const dreamAPI = {
  // 모든 꿈 가져오기
  getAllDreams: async (userId: string): Promise<DreamEntry[]> => {
    return apiRequest<DreamEntry[]>(`/dreams?userId=${userId}`)
  },

  // 특정 꿈 가져오기
  getDream: async (dreamId: string): Promise<DreamEntry> => {
    return apiRequest<DreamEntry>(`/dreams/${dreamId}`)
  },

  // 꿈 생성
  createDream: async (data: DreamInputForm): Promise<DreamEntry> => {
    return apiRequest<DreamEntry>('/dreams', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 꿈 업데이트
  updateDream: async (dreamId: string, data: Partial<DreamEntry>): Promise<DreamEntry> => {
    return apiRequest<DreamEntry>(`/dreams/${dreamId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // 꿈 삭제
  deleteDream: async (dreamId: string): Promise<void> => {
    return apiRequest<void>(`/dreams/${dreamId}`, {
      method: 'DELETE',
    })
  },

  // 웹툰 생성 요청
  generateWebtoon: async (request: WebtoonGenerationRequest): Promise<WebtoonGenerationResponse> => {
    return apiRequest<WebtoonGenerationResponse>('/webtoon/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // 음성 녹음 업로드 및 텍스트 변환
  uploadVoice: async (audioBlob: Blob): Promise<{ text: string }> => {
    const formData = new FormData()
    formData.append('audio', audioBlob)

    const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  },
}

// Analytics API
export const analyticsAPI = {
  // 사용자 건강 지수 가져오기
  getHealthIndex: async (userId: string) => {
    return apiRequest(`/analytics/health-index?userId=${userId}`)
  },

  // 감정 분석 데이터 가져오기
  getEmotionAnalysis: async (userId: string, period: 'week' | 'month' | 'year' = 'month') => {
    return apiRequest(`/analytics/emotions?userId=${userId}&period=${period}`)
  },

  // 꿈 패턴 분석
  getDreamPatterns: async (userId: string) => {
    return apiRequest(`/analytics/patterns?userId=${userId}`)
  },
}
