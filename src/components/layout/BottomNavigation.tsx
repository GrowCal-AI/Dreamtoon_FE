import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Library,
  BarChart3,
  User,
  LogIn,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import LoginModal from "@/components/common/LoginModal";

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/library", icon: Library, label: "보관함" },
    { path: "/analytics", icon: BarChart3, label: "분석" },
  ];

  const tierLabel: Record<string, string> = {
    free: "Free",
    plus: "Plus",
    pro: "Pro",
    ultra: "Ultra",
  };
  const currentTier = user?.subscriptionTier ?? "free";

  const handleLogout = () => {
    logout();
    setIsProfileSheetOpen(false);
  };

  const handleUpgrade = () => {
    navigate("/pricing");
    setIsProfileSheetOpen(false);
  };

  return (
    <>
      <nav className="bg-[#0F0C29]/80 backdrop-blur-md border-t border-white/10 pb-safe pt-2 px-6">
        <div className="flex justify-between px-6 items-center max-w-md mx-auto h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
                  isActive
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* 로그인/프로필 아이콘 (라벨 없음) */}
          <button
            type="button"
            onClick={() =>
              isLoggedIn
                ? setIsProfileSheetOpen(true)
                : setIsLoginModalOpen(true)
            }
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              isLoggedIn
                ? "text-purple-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {isLoggedIn ? (
              <User size={24} strokeWidth={2} />
            ) : (
              <LogIn size={24} strokeWidth={2} />
            )}
            <span className="text-[10px] font-medium">
              {isLoggedIn ? "" : "로그인"}
            </span>
          </button>
        </div>
      </nav>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />

      {/* 프로필 바텀 시트 */}
      <AnimatePresence>
        {isProfileSheetOpen && (
          <>
            {/* 딤 배경 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsProfileSheetOpen(false)}
            />

            {/* 바텀 시트 */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1635] border-t border-white/10 rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl"
            >
              {/* 핸들 바 */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="absolute top-4 right-5 text-white/40 hover:text-white/70 transition-colors"
              >
                <X size={20} />
              </button>

              {/* 유저 정보 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <User size={20} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {user?.name ?? user?.email ?? "사용자"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Sparkles size={11} className="text-purple-400" />
                    <span className="text-xs text-purple-300 font-medium">
                      {tierLabel[currentTier] ?? "Free"} 플랜
                    </span>
                  </div>
                </div>
              </div>

              {/* 메뉴 옵션 */}
              <div className="space-y-2">
                {currentTier === "free" ? (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-white hover:from-purple-600/40 hover:to-indigo-600/40 transition-all"
                  >
                    <Sparkles size={18} className="text-purple-300" />
                    <span className="font-medium text-sm">
                      프리미엄 업그레이드
                    </span>
                    <span className="ml-auto text-xs text-purple-400 font-semibold">
                      플랜 보기 →
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleUpgrade}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    <Sparkles size={18} className="text-purple-300" />
                    <span className="font-medium text-sm">구독 관리</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                >
                  <LogOut size={18} />
                  <span className="font-medium text-sm">로그아웃</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
