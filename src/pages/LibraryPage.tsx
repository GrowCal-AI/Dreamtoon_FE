import { useState, useMemo, memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Filter, Heart, Calendar } from 'lucide-react'
import { useDreamStore } from '@/store/useDreamStore'
import { DreamEntry, DreamStyle } from '@/types'
import GenerationResult from '@/components/common/GenerationResult'

// Memoized Dream Card
const DreamCard = memo(({ dream, onClick }: { dream: DreamEntry; onClick: () => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-[#2D2A4A] to-[#1A1638] relative overflow-hidden">
        {dream.webtoonUrl || (dream.scenes && dream.scenes.length > 0 && dream.scenes[0].imageUrl) ? (
          <img
            src={dream.webtoonUrl || dream.scenes[0].imageUrl}
            alt={dream.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

        <div className="absolute inset-0 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-lg font-semibold drop-shadow-md">{dream.title}</div>
          </div>
        </div>
        {dream.isFavorite && (
          <div className="absolute top-3 right-3 z-10">
            <Heart className="w-6 h-6 fill-red-500 text-red-500 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {dream.recordedAt.toLocaleDateString('ko-KR')}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
            {dream.style}
          </span>
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">{dream.content}</p>
        {dream.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dream.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded"
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
  const navigate = useNavigate()
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null)


  const [filterStyle, setFilterStyle] = useState<DreamStyle | 'all'>('all')
  const [showFavorites, setShowFavorites] = useState(false)

  // Filtered dreams (useMemo)
  const filteredDreams = useMemo(() => {
    let result = [...dreams]

    // Style filter
    if (filterStyle !== 'all') {
      result = result.filter((dream) => dream.style === filterStyle)
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((dream) => dream.isFavorite)
    }

    // Sort by Date (Default)
    result.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())

    return result
  }, [dreams, filterStyle, showFavorites])

  // Body scroll lock
  useEffect(() => {
    if (selectedDream) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedDream])

  return (
    <div className="min-h-full pt-20 pb-24 px-5 xl:pt-28 xl:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* ... (existing content) */}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-4 md:mb-8 md:text-center px-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-dream-yellow drop-shadow-sm mb-2 tracking-tight">
            꿈 라이브러리
          </h1>
          <p className="text-gray-400 text-sm">
            당신이 기록한 모든 꿈을 한눈에 확인하세요
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-end gap-3 mb-8 px-1"
        >

          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${showFavorites
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'glass-card text-gray-400 hover:bg-white/10'
              }`}
          >
            <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
            즐겨찾기
          </button>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-300 pointer-events-none" />
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value as DreamStyle | 'all')}
              className={`pl-10 pr-8 py-2 rounded-lg font-medium transition-all appearance-none cursor-pointer outline-none ${filterStyle !== 'all'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'glass-card text-gray-400 hover:bg-white/10'
                }`}
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
        </motion.div>
        {/* Dream Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-gray-400"
        >
          총 {filteredDreams.length}개의 꿈
        </motion.div>

        {/* Dream Grid */}
        {filteredDreams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-gray-500 mb-4">
              <p className="text-lg">기록된 꿈이 없습니다</p>
              <p className="text-sm mt-2">새로운 꿈을 기록해보세요!</p>
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
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onClick={() => setSelectedDream(dream)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Full Screen Generation Result Modal */}
      <AnimatePresence>
        {selectedDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F0C29] overflow-y-auto max-h-screen"
          >
            <GenerationResult
              title={selectedDream.title}
              date={selectedDream.recordedAt.toLocaleDateString('ko-KR')}
              mediaUrl={selectedDream.webtoonUrl || selectedDream.videoUrl || ''}
              type={selectedDream.format}
              isSaved={true}
              onSave={() => { }}
              onReset={() => navigate('/')}
              onTalkMore={() => alert("꿈 대화하기 기능은 준비 중입니다.")}
              onClose={() => setSelectedDream(null)}
              initialFavorite={selectedDream.isFavorite}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
