import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
// URL origin 추출 (프로토콜 + 호스트 + 포트)
const BE_BASE_URL = (() => {
  try { return new URL(API_BASE_URL).origin } catch { return API_BASE_URL.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '') }
})()

export default function LoginPage() {
    const navigate = useNavigate()
    const { testLogin } = useAuthStore()

    const handleKakaoLogin = () => {
        window.location.href = `${BE_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(window.location.origin)}`
    }

    const handleGoogleLogin = () => {
        window.location.href = `${BE_BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin)}`
    }

    const handleDevLogin = async () => {
        await testLogin(1)
        navigate(-1)
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[#0F0C29]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card p-8 relative z-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="text-center mb-10 pt-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 text-sm">로그인하고 당신의 꿈을 영구히 보관하세요.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleDevLogin}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                    >
                        <Sparkles size={18} />
                        바로 시작하기
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-[#0F0C29] text-gray-500">또는</span>
                        </div>
                    </div>

                    <button
                        onClick={handleKakaoLogin}
                        className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#000000] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <span className="font-bold">Kakao</span>
                        <span>로 시작하기</span>
                    </button>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Google로 계속하기
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                        계속 진행함으로써 Dreamtoon의
                        <button className="underline mx-1 hover:text-gray-300">이용약관</button> 및
                        <button className="underline mx-1 hover:text-gray-300">개인정보 처리방침</button>에 동의하게 됩니다.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
