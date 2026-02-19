import { Link, useLocation } from "react-router-dom";
import { Home, Library, BarChart3 } from "lucide-react";

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "홈" },
    { path: "/library", icon: Library, label: "보관함" },
    { path: "/analytics", icon: BarChart3, label: "분석" },
    // { path: '/profile', icon: User, label: '내 정보' },
  ];

  return (
    <nav className="bg-[#0F0C29]/80 backdrop-blur-md border-t border-white/10 pb-safe pt-2 px-6">
      <div className="flex justify-between px-10 items-center max-w-md mx-auto h-16">
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
      </div>
    </nav>
  );
}
