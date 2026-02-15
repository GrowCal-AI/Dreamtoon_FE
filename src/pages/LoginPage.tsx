import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, User, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export default function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const handleSocialLogin = (provider: string) => {
        // Simulate login
        setTimeout(() => {
            login() // Update store state
            navigate(-1) // Go back to previous page
        }, 1000)
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-gray-50">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl relative z-10"
            >
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="text-center mb-10 pt-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">로그인하고 당신의 꿈을 영구히 보관하세요.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleSocialLogin('Kakao')}
                        className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#000000] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                        <span className="font-bold relative z-10">Kakao</span>
                        <span className="relative z-10">로 3초 만에 시작하기</span>
                    </button>

                    <button
                        onClick={() => handleSocialLogin('Google')}
                        className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Google로 계속하기
                    </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400">
                    <button className="hover:text-gray-600 transition-colors">아이디 찾기</button>
                    <span className="w-[1px] h-3 bg-gray-300"></span>
                    <button className="hover:text-gray-600 transition-colors">비밀번호 찾기</button>
                    <span className="w-[1px] h-3 bg-gray-300"></span>
                    <button className="hover:text-gray-600 transition-colors">회원가입</button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        계속 진행함으로써 Dreamtoon의
                        <button className="underline mx-1 hover:text-gray-600">이용약관</button> 및
                        <button className="underline mx-1 hover:text-gray-600">개인정보 처리방침</button>에 동의하게 됩니다.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
