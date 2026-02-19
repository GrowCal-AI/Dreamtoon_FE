import { useEffect, useState, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Download, Share2, Play, Pause } from 'lucide-react'
import { useDreamStore } from '@/store/useDreamStore'
import { DreamEntry, DreamScene, formatDate } from '@/types'
import { dreamAPI } from '@/services/api'

// Memoized Scene Card
const SceneCard = memo(({ scene, index }: { scene: DreamScene; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="mb-8"
  >
    <div className="glass-card overflow-hidden">
      {/* Scene Image */}
      <div className="aspect-[16/9] bg-gradient-to-br from-[#2D2A4A] to-[#1A1638] flex items-center justify-center relative">
        <div className="text-center text-gray-500">
          <div className="text-sm font-medium mb-2">Scene {scene.sceneNumber}</div>
          <div className="text-xs px-4">{scene.description}</div>
        </div>
        {scene.imageUrl && (
          <img
            src={scene.imageUrl}
            alt={`Scene ${scene.sceneNumber}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Scene Content */}
      <div className="p-6">
        {scene.narration && (
          <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-gray-300 italic">{scene.narration}</p>
          </div>
        )}

        {scene.dialogue && scene.dialogue.length > 0 && (
          <div className="space-y-2">
            {scene.dialogue.map((d, i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                  {d.character}
                </div>
                <div className="bg-[#2D2A4A] border border-white/10 px-4 py-2 rounded-lg shadow-sm flex-1 text-gray-200">
                  {d.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scene Meta */}
        <div className="mt-4 flex flex-wrap gap-2">
          {scene.characters.map((char, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-sm"
            >
              {char}
            </span>
          ))}
          <span className="px-3 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-full text-sm">
            {scene.emotion}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
))

SceneCard.displayName = 'SceneCard'

export default function WebtoonViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dreams, toggleFavorite, addDream } = useDreamStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [localDream, setLocalDream] = useState<DreamEntry | null>(null)

  const storeDream = dreams.find((d) => d.id === id)
  const dream = storeDream || localDream

  // 스토어에 없으면 BE에서 가져오기
  useEffect(() => {
    if (!storeDream && id) {
      dreamAPI.getDream(id).then((d) => {
        setLocalDream(d)
        addDream(d)
      }).catch(() => {
        navigate('/')
      })
    }
  }, [id, storeDream])

  if (!dream) return null

  const scenes: DreamScene[] = dream.scenes || []

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Auto-scroll simulation
    if (!isPlaying) {
      const interval = setInterval(() => {
        // setCurrentScene((prev) => {
        //   if (prev >= scenes.length - 1) {
        //     clearInterval(interval)
        //     setIsPlaying(false)
        //     return prev
        //   }
        //   return prev + 1
        // }) 
        // Logic simplified as we are not using scroll yet but mimicking play state
        // If we want to simulate playing, we can just toggle off after some time
        setTimeout(() => setIsPlaying(false), 9000);
        clearInterval(interval);
      }, 3000)
    }
  }

  return (
    <div className="min-h-full py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(dream.id)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${dream.isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                    }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-6 h-6 text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Download className="w-6 h-6 text-gray-400" />
              </motion.button>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-white">{dream.title}</h1>
          <p className="text-gray-400">
            {formatDate(dream.recordedAt, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {/* Auto-play Controls */}
          <div className="mt-4 flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex items-center space-x-2 px-6 py-3 dream-gradient text-white rounded-lg font-medium shadow-glow"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>자동 재생</span>
                </>
              )}
            </motion.button>
            <div className="text-sm text-gray-400">
              {scenes.length}개의 장면
            </div>
          </div>
        </motion.div>

        {/* Webtoon Scenes */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {scenes.map((scene, index) => (
              <SceneCard key={scene.id} scene={scene} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Dream Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mt-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">원본 꿈 내용</h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed border-t border-white/10 pt-4">{dream.content}</p>
        </motion.div>
      </div>
    </div>
  )
}
