import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Library, BarChart3, User, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import LoginModal from "@/components/common/LoginModal";

export default function BottomNavigation() {
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/library", icon: Library, label: "보관함" },
    { path: "/analytics", icon: BarChart3, label: "분석" },
  ];

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

          {/* 로그인/프로필 버튼 */}
          <button
            type="button"
            onClick={() => !isLoggedIn && setIsLoginModalOpen(true)}
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
              {isLoggedIn ? "내 정보" : "로그인"}
            </span>
          </button>
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
