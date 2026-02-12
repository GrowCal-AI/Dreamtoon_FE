import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Library, Sparkles, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="glass-effect sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold dream-text-gradient">
              ChatGPT
            </span>
          </Link>

          {/* Right Side - Navigation Items + Login */}
          <div className="flex items-center space-x-4">
            {/* Library Link */}
            <Link
              to="/library"
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Library className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">라이브러리</span>
            </Link>

            {/* Analytics Link */}
            <Link
              to="/analytics"
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">분석</span>
            </Link>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex space-x-3">
            <Link
              to="/library"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Library className="w-6 h-6 text-gray-600" />
            </Link>
            <Link
              to="/analytics"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
