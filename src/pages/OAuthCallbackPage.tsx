import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

/**
 * OAuth2 로그인 콜백 페이지 (Hybrid 방식)
 * - Access Token: URL 쿼리 (?accessToken=...) 로 전달 → 파싱 후 저장하고 URL에서 제거
 * - Refresh Token: HttpOnly Cookie로 설정됨 (JS 접근 불가, API 요청 시 credentials: 'include')
 */
export default function OAuthCallbackPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { setLoggedIn, fetchUser } = useAuthStore()

    useEffect(() => {
        const accessToken = searchParams.get('accessToken')

        if (accessToken) {
            // 1. URL 쿼리 제거 (보안: 주소창에 토큰 노출 방지)
            window.history.replaceState({}, '', window.location.pathname)

            // 2. Access Token 저장 (Zustand + localStorage)
            setLoggedIn(accessToken)

            // 3. 팝업 로그인인 경우 메인 창에 토큰 전달 후 닫기
            if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_SUCCESS', accessToken }, window.location.origin)
                window.close()
                return
            }

            // 4. 사용자 정보 조회 후 홈으로 이동
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
