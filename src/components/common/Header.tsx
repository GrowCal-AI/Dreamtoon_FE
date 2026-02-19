import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Library, LogIn, LogOut, User } from 'lucide-react'
import LogoImage from '@/asset/Group 2.svg'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/useAuthStore'
import LoginModal from '@/components/common/LoginModal'

export default function Header() {
    const location = useLocation()
    const { isLoggedIn, logout } = useAuthStore()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const isActive = (path: string) => location.pathname === path

    const handleLogin = () => {
        setIsLoginModalOpen(true)
    }

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F0C29]/80 backdrop-blur-md border-b border-white/5 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-start md:justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={LogoImage}
                            alt="Dreamtoon Lab Logo"
                            className="h-[18px] md:h-[20px] w-auto object-contain"
                            style={{ imageRendering: '-webkit-optimize-contrast' } as React.CSSProperties}
                        />
                    </Link>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Library: 로그인 시 링크, 미로그인 시 로그인 유도 */}
                        {isLoggedIn ? (
                            <Link
                                to="/library"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${isActive('/library')
                                    ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Library className={`w-5 h-5 ${isActive('/library') ? 'text-purple-400' : ''}`} />
                                <span className="font-medium">라이브러리</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                                <Library className="w-5 h-5" />
                                <span className="font-medium">라이브러리</span>
                            </button>
                        )}

                        {/* 분석: 로그인 시 링크, 미로그인 시 로그인 유도 */}
                        {isLoggedIn ? (
                            <Link
                                to="/analytics"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${isActive('/analytics')
                                    ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                    : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <BarChart3 className={`w-5 h-5 ${isActive('/analytics') ? 'text-purple-400' : ''}`} />
                                <span className="font-medium">분석</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-white/10 text-gray-400 hover:text-white"
                            >
                                <BarChart3 className="w-5 h-5" />
                                <span className="font-medium">분석</span>
                            </button>
                        )}

                        {/* Login Button / Profile Icon */}
                        <div className="w-[100px] flex justify-end"> {/* Fixed width container for layout stability */}
                            <AnimatePresence mode="wait">
                                {!isLoggedIn ? (
                                    <motion.button
                                        key="login-btn"
                                        onClick={handleLogin}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all font-medium backdrop-blur-sm shadow-lg whitespace-nowrap"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>로그인</span>
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="profile-icon"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setIsProfileOpen((o) => !o)}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-all group"
                                        >
                                            <User className="w-5 h-5 text-white group-hover:text-purple-400 transition-colors" />
                                        </button>
                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    aria-hidden
                                                    onClick={() => setIsProfileOpen(false)}
                                                />
                                                <div className="absolute right-0 top-full mt-2 z-50 min-w-[140px] py-1 rounded-xl bg-[#1a1635] border border-white/10 shadow-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            logout()
                                                            setIsProfileOpen(false)
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>로그아웃</span>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <LoginModal
                        isOpen={isLoginModalOpen}
                        onClose={() => setIsLoginModalOpen(false)}
                        onLoginSuccess={handleLoginSuccess}
                    />

                    {/* Mobile Navigation (Hidden completely as requested) */}
                    <div className="hidden">
                        <Link
                            to="/library"
                            className={`p-2 rounded-lg transition-colors ${isActive('/library') ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            <Library className="w-6 h-6" />
                        </Link>
                        <Link
                            to="/analytics"
                            className={`p-2 rounded-lg transition-colors ${isActive('/analytics') ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            <BarChart3 className="w-6 h-6" />
                        </Link>
                        <button
                            onClick={!isLoggedIn ? handleLogin : undefined}
                            className={`p-2 rounded-lg transition-colors hover:bg-white/10 text-gray-400`}
                        >
                            {isLoggedIn ? <User className="w-6 h-6 text-purple-400" /> : <LogIn className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
