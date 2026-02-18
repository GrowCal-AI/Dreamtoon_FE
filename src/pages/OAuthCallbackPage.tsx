import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

/**
 * OAuth2 로그인 콜백 페이지
 * BE SuccessHandler가 토큰을 sessionStorage에 저장 후 이 페이지로 리다이렉트
 * sessionStorage → localStorage로 이동 후 홈으로 이동
 */
export default function OAuthCallbackPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { setLoggedIn, fetchUser } = useAuthStore()

    useEffect(() => {
        // 1순위: sessionStorage (BE SuccessHandler가 저장)
        // 2순위: URL 쿼리 파라미터 (대체 방식)
        const token =
            sessionStorage.getItem('accessToken') ||
            searchParams.get('token') ||
            searchParams.get('accessToken')

        const refreshToken =
            sessionStorage.getItem('refreshToken') ||
            searchParams.get('refreshToken')

        if (token) {
            // localStorage로 이동 (앱 전체에서 사용)
            localStorage.setItem('accessToken', token)
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken)
            }

            // sessionStorage 정리
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('refreshToken')

            setLoggedIn(token)
            fetchUser().then(() => {
                navigate('/', { replace: true })
            })
        } else {
            navigate('/login', { replace: true })
        }
    }, [searchParams, navigate, setLoggedIn, fetchUser])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F0C29]">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
                <p className="text-gray-400">로그인 처리 중...</p>
            </div>
        </div>
    )
}
