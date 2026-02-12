import { useEffect } from 'react'
import { useDreamStore } from '@/store/useDreamStore'
import { mockDreams, mockUserProfile } from '@/utils/mockData'

/**
 * 꿈 데이터를 관리하는 커스텀 훅
 * API 연동 시 이 훅만 수정하면 됨
 */
export function useDreams() {
  const {
    dreams,
    currentDream,
    userProfile,
    isLoading,
    error,
    setDreams,
    addDream,
    updateDream,
    deleteDream,
    setCurrentDream,
    toggleFavorite,
    setUserProfile,
    setLoading,
    setError,
  } = useDreamStore()

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // TODO: 실제 API 호출로 교체
        // const dreams = await dreamAPI.getAllDreams(userId)
        // const profile = await userAPI.getProfile(userId)

        // Mock 데이터 사용
        setTimeout(() => {
          setDreams(mockDreams)
          setUserProfile(mockUserProfile)
          setLoading(false)
        }, 500)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dreams')
        setLoading(false)
      }
    }

    if (dreams.length === 0) {
      loadInitialData()
    }
  }, [])

  return {
    dreams,
    currentDream,
    userProfile,
    isLoading,
    error,
    addDream,
    updateDream,
    deleteDream,
    setCurrentDream,
    toggleFavorite,
  }
}
