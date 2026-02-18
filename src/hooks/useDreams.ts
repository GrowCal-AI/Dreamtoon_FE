import { useEffect } from 'react'
import { useDreamStore } from '@/store/useDreamStore'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * 꿈 데이터를 관리하는 커스텀 훅
 * BE API에서 실제 데이터를 가져옴
 */
export function useDreams() {
  const {
    dreams,
    currentDream,
    userProfile,
    isLoading,
    error,
    fetchDreams,
    addDream,
    updateDream,
    deleteDream,
    setCurrentDream,
    toggleFavorite,
  } = useDreamStore()

  const { isLoggedIn } = useAuthStore()

  // 로그인 상태일 때 BE에서 꿈 목록 가져오기
  useEffect(() => {
    if (isLoggedIn && dreams.length === 0) {
      fetchDreams()
    }
  }, [isLoggedIn])

  return {
    dreams,
    currentDream,
    userProfile,
    isLoading,
    error,
    fetchDreams,
    addDream,
    updateDream,
    deleteDream,
    setCurrentDream,
    toggleFavorite,
  }
}
