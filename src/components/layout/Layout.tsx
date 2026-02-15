import { Outlet, useLocation } from 'react-router-dom'
import Navigation from './Navigation'
import BottomNavigation from './BottomNavigation'

export default function Layout() {
  const location = useLocation()
  // Pages that require fixed layout (no global scroll)
  const isFixedPage = ['/', '/input', '/chat'].includes(location.pathname)

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      {/* Header - Visible only on PC (xl: 1280px+) */}
      <div className="hidden xl:flex w-full flex-col">
        <Navigation />
      </div>

      <main
        className={`flex-1 relative flex flex-col ${isFixedPage ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'
          }`}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation - Visible only on Mobile (< 1280px) */}
      <div className="flex xl:hidden w-full flex-col">
        <BottomNavigation />
      </div>
    </div>
  )
}
