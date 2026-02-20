import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Refresh Token이 HttpOnly Cookie로 전달되므로 필수
})

// 요청 인터셉터: JWT 토큰이 있을 때만 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 401 발생 시 스토어 동기화를 위한 콜백
let onAuthExpired: (() => void) | null = null
export function setOnAuthExpired(callback: () => void) {
  onAuthExpired = callback
}

// 응답 인터셉터: ApiResponse 래퍼 자동 언래핑 + 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    // BE ApiResponse { success, message, data } 래퍼 언래핑
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      response.data = data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러 시 토큰 갱신 시도 (agent.txt: Body에 refreshToken 전달)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh Token은 HttpOnly Cookie로 자동 전송됨 (withCredentials: true)
        const res = await apiClient.post('/auth/refresh')
        const newToken = res.data?.accessToken
        if (newToken) {
          localStorage.setItem('accessToken', newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch {
        // 갱신 실패 → 토큰 정리 + 스토어 동기화
      }

      localStorage.removeItem('accessToken')
      onAuthExpired?.()
    }

    return Promise.reject(error)
  }
)

export default apiClient
