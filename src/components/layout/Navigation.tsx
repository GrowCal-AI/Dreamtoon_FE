import { Link } from 'react-router-dom'
import { BarChart3, Library, Sparkles, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navigation() {

  return (
    <nav className="w-full bg-transparent z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold dream-text-gradient">
              Dream AI
            </span>
          </Link>

          {/* Right Side - Navigation Items + Login */}
          <div className="flex items-center space-x-4">
            {/* Library Link */}
            <Link
              to="/library"
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Library className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-300 hover:text-white transition-colors">라이브러리</span>
            </Link>

            {/* Analytics Link */}
            <Link
              to="/analytics"
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-300 hover:text-white transition-colors">분석</span>
            </Link>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all font-medium backdrop-blur-sm shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex space-x-3">
            <Link
              to="/library"
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <Library className="w-6 h-6 text-gray-400" />
            </Link>
            <Link
              to="/analytics"
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
