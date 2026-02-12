import { useEffect, useState, memo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Download, Share2, Play, Pause } from 'lucide-react'
import { useDreamStore } from '@/store/useDreamStore'
import { DreamScene } from '@/types'

// Memoized Scene Card
const SceneCard = memo(({ scene, index }: { scene: DreamScene; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="mb-8"
  >
    <div className="glass-effect rounded-2xl overflow-hidden">
      {/* Scene Image */}
      <div className="aspect-[16/9] bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center relative">
        <div className="text-center text-gray-600">
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
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 italic">{scene.narration}</p>
          </div>
        )}

        {scene.dialogue && scene.dialogue.length > 0 && (
          <div className="space-y-2">
            {scene.dialogue.map((d, i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="bg-purple-100 px-3 py-1 rounded-full text-sm font-medium">
                  {d.character}
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex-1">
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
              className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
            >
              {char}
            </span>
          ))}
          <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">
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
  const { dreams, toggleFavorite } = useDreamStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScene, setCurrentScene] = useState(0)

  const dream = dreams.find((d) => d.id === id)

  useEffect(() => {
    if (!dream) {
      navigate('/')
    }
  }, [dream, navigate])

  if (!dream) return null

  // Mock scenes if empty
  const scenes: DreamScene[] = dream.scenes.length > 0 ? dream.scenes : [
    {
      id: '1',
      sceneNumber: 1,
      description: '이상한 나라로 떨어지는 장면',
      characters: ['나'],
      emotion: 'surprise',
      backgroundKeywords: ['하늘', '구름', '빛'],
      narration: '갑자기 발 밑이 무너지면서 끝없이 떨어지기 시작했다.',
    },
    {
      id: '2',
      sceneNumber: 2,
      description: '신비로운 숲속',
      characters: ['나', '신비한 존재'],
      emotion: 'peace',
      backgroundKeywords: ['숲', '나무', '빛'],
      narration: '부드럽게 착지한 곳은 형형색색의 나무들이 빛나는 숲이었다.',
      dialogue: [
        { character: '신비한 존재', text: '여기는 꿈의 세계란다.' },
        { character: '나', text: '정말 아름다워요...' },
      ],
    },
    {
      id: '3',
      sceneNumber: 3,
      description: '하늘을 나는 장면',
      characters: ['나'],
      emotion: 'joy',
      backgroundKeywords: ['하늘', '별', '달'],
      narration: '갑자기 몸이 가벼워지면서 하늘을 날기 시작했다.',
    },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Auto-scroll simulation
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentScene((prev) => {
          if (prev >= scenes.length - 1) {
            clearInterval(interval)
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>돌아가기</span>
            </button>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(dream.id)}
                className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    dream.isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Download className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{dream.title}</h1>
          <p className="text-gray-600">
            {dream.recordedAt.toLocaleDateString('ko-KR', {
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
              className="flex items-center space-x-2 px-6 py-3 dream-gradient text-white rounded-lg font-medium"
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
            <div className="text-sm text-gray-600">
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
          className="glass-effect rounded-2xl p-6 mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">원본 꿈 내용</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{dream.content}</p>
        </motion.div>
      </div>
    </div>
  )
}
