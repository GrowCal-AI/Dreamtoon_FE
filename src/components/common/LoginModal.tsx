import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
const BE_BASE_URL = API_BASE_URL.replace('/api/v1', '')

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
    onLoginSuccess: () => void
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const handleKakaoLogin = () => {
        window.location.href = `${BE_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(window.location.origin)}`
    }

    const handleGoogleLogin = () => {
        window.location.href = `${BE_BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin)}`
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl opacity-50" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10 text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                당신의 소중한 무의식을 <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                                    영구히 보관할까요?
                                </span>
                            </h2>
                            <p className="text-gray-300 text-sm mb-8">
                                로그인 후 나만의 꿈 보관함에 저장하세요.
                            </p>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[
                                    '무제한 꿈 저장',
                                    '월간 감정 분석',
                                    '프리미엄 상담 접근',
                                    '웹툰 고화질 다운로드'
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/5">
                                        <div className="bg-green-500/20 p-1 rounded-full">
                                            <Check size={12} className="text-green-400" />
                                        </div>
                                        <span className="text-xs text-gray-200">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 소셜 로그인 */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleKakaoLogin}
                                    className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#000000] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <span>Kakao</span>
                                    <span>로 로그인하기</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                    Google로 로그인하기
                                </button>
                            </div>

                            <p className="mt-6 text-xs text-gray-500">
                                로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default LoginModal
