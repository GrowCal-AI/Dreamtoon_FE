import { useState, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Heart, Calendar, Tag } from 'lucide-react'
import { useDreamStore } from '@/store/useDreamStore'
import { DreamEntry, DreamStyle } from '@/types'

// Memoized Dream Card
const DreamCard = memo(({ dream }: { dream: DreamEntry }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/webtoon/${dream.id}`)}
      className="glass-effect rounded-xl overflow-hidden cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-purple-200 to-pink-200 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center px-4">
            <div className="text-lg font-semibold mb-2">{dream.title}</div>
            <div className="text-sm opacity-90">
              {dream.scenes.length > 0 ? `${dream.scenes.length}개 장면` : '웹툰 생성 완료'}
            </div>
          </div>
        </div>
        {dream.isFavorite && (
          <div className="absolute top-3 right-3">
            <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {dream.recordedAt.toLocaleDateString('ko-KR')}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
            {dream.style}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{dream.content}</p>
        {dream.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dream.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
})

DreamCard.displayName = 'DreamCard'

export default function LibraryPage() {
  const { dreams } = useDreamStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStyle, setFilterStyle] = useState<DreamStyle | 'all'>('all')
  const [showFavorites, setShowFavorites] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')

  // Filtered and sorted dreams (useMemo로 최적화)
  const filteredDreams = useMemo(() => {
    let result = [...dreams]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (dream) =>
          dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dream.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Style filter
    if (filterStyle !== 'all') {
      result = result.filter((dream) => dream.style === filterStyle)
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((dream) => dream.isFavorite)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return b.recordedAt.getTime() - a.recordedAt.getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

    return result
  }, [dreams, searchQuery, filterStyle, showFavorites, sortBy])

  return (
    <div className="min-h-full py-12 px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="dream-text-gradient">꿈 라이브러리</span>
          </h1>
          <p className="text-gray-600">
            당신이 기록한 모든 꿈을 한눈에 확인하세요
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect p-6 rounded-2xl mb-8"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="꿈 제목이나 내용으로 검색..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${showFavorites
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              즐겨찾기
            </button>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value as DreamStyle | 'all')}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              >
                <option value="all">모든 스타일</option>
                <option value="romance">로맨스</option>
                <option value="school">학원물</option>
                <option value="dark-fantasy">다크 판타지</option>
                <option value="healing">힐링</option>
                <option value="comedy">코미디</option>
                <option value="horror">호러</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              >
                <option value="date">최신순</option>
                <option value="title">제목순</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Dream Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-gray-600"
        >
          총 {filteredDreams.length}개의 꿈
        </motion.div>

        {/* Dream Grid */}
        {filteredDreams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect p-12 rounded-2xl text-center"
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">검색 결과가 없습니다</p>
              <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredDreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
