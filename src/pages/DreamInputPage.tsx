import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mic, Send, Sparkles, Loader2, X, Layout, PlayCircle } from 'lucide-react'
import GenerationResult from '@/components/common/GenerationResult'

import { useChatStore } from '@/store/useChatStore'
import { useDreamStore } from '@/store/useDreamStore'
import { useAuthStore } from '@/store/useAuthStore'
import LoginModal from '@/components/common/LoginModal'
import { EmotionType, DreamStyle, DreamEntry, DreamScene } from '@/types'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

// --- Components ---

const EmotionChip = ({
  label,
  emoji,
  onClick,
}: {
  emotion: EmotionType
  label: string
  emoji: string
  onClick: () => void
}) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-full glass-card hover:bg-white/10 transition-all w-24 h-24"
  >
    <span className="text-3xl mb-1">{emoji}</span>
    <span className="text-xs font-medium text-gray-200">{label}</span>
  </motion.button>
)

const AnalysisDashboard = ({ analysis }: { analysis: any }) => {
  // Mock Data for Radar Chart if analysis is null
  const data = [
    { subject: '기쁨', A: analysis?.emotions?.joy || 20, fullMark: 100 },
    { subject: '불안', A: analysis?.emotions?.anxiety || 60, fullMark: 100 },
    { subject: '분노', A: analysis?.emotions?.anger || 10, fullMark: 100 },
    { subject: '슬픔', A: analysis?.emotions?.sadness || 30, fullMark: 100 },
    { subject: '놀람', A: analysis?.emotions?.surprise || 40, fullMark: 100 },
    { subject: '평온', A: analysis?.emotions?.peace || 10, fullMark: 100 },
  ]

  return (
    <div className="w-full max-w-md glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 text-center">
        꿈 감정 분석
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="My Dream"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-200 leading-relaxed">
            무의식 속에 <span className="font-bold text-purple-400">불안감</span>이
            높게 나타나고 있어요. 현실에서의 스트레스가 꿈에 반영된 것 같아요.
            잠시 휴식을 취하는 건 어떨까요?
          </p>
        </div>
      </div>
    </div>
  )
}

const StyleCard = ({
  label,
  desc,
  onClick,
  selected,
  isPremium = false
}: {
  style: string,
  label: string,
  desc: string,
  onClick: () => void,
  selected: boolean,
  isPremium?: boolean
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative p-4 rounded-xl text-left transition-all border overflow-hidden glass-card ${selected
      ? 'border-purple-500 bg-purple-500/20 shadow-glow'
      : 'border-white/10 hover:border-purple-400/50'
      }`}
  >
    {isPremium && (
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
        PRO
      </div>
    )}
    <div className="font-bold text-white flex items-center gap-1">
      {label}
    </div>
    <div className="text-xs text-gray-400">{desc}</div>
  </motion.button>
)

// --- Style Configurations ---

const WEBTOON_STYLES = [
  { id: 'romance', label: '로맨스', desc: '설레는 순정만화', isPremium: false },
  { id: 'dark-fantasy', label: '판타지', desc: '신비로운 마법세계', isPremium: true },
  { id: 'healing', label: '힐링', desc: '따뜻한 수채화풍', isPremium: false },
  { id: 'horror', label: '호러', desc: '오싹한 공포물', isPremium: false },
]

const ANIMATION_STYLES = [
  // Basic
  { id: 'healing', label: '2D 애니메이션', desc: '부드러운 움직임', isPremium: false },
  { id: 'school', label: '심플 드로잉', desc: '깔끔한 선화', isPremium: false },
  { id: 'romance', label: '수채화', desc: '감성적인 터치', isPremium: false },
  // Premium
  { id: 'pixar', label: '픽사 스타일 3D', desc: '디즈니 감성 가득', isPremium: true },
  { id: 'ghibli', label: '지브리 감성', desc: '몽글몽글한 느낌', isPremium: true },
  { id: 'cyberpunk', label: '사이버펑크', desc: '네온빛 미래도시', isPremium: true },
  { id: 'cinematic', label: '실사 시네마틱', desc: '영화 같은 연출', isPremium: true },
  { id: 'vintage', label: '빈티지 필름', desc: '아날로그 노이즈', isPremium: true },
  { id: 'dark-fantasy', label: '다크 판타지', desc: '웅장하고 어두운', isPremium: true },
]
// --- Post-Generation Components ---

const SubscriptionModal = ({
  onClose,
  onSubscribe,
  title,
  description,
  benefits,
  buttonText
}: {
  onClose: () => void,
  onSubscribe: () => void,
  title: React.ReactNode,
  description: React.ReactNode,
  benefits: string[],
  buttonText: string
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-[#1A1638] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-teal-400/20 to-purple-500/20 opacity-30 pointer-events-none" />
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20">
        <X size={24} />
      </button>

      <div className="relative z-10 pt-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
          {title}
        </h2>

        <p className="text-gray-300 text-sm leading-relaxed mb-6 px-1">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {benefits.map((tag, i) => (
            <span key={i} className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs font-semibold rounded-lg border border-white/10">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={onSubscribe}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            {buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

// --- Main Page ---

export default function DreamInputPage() {
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'style' | 'deep_chat'>('style') // Added modalType state

  // State for pending save actions
  const [pendingSave, setPendingSave] = useState(false)
  const initializedRef = useRef(false)

  const { addDream } = useDreamStore()
  const { isLoggedIn, login, checkSaveLimit, updateUser } = useAuthStore()

  const {
    step,
    messages,
    addMessage,
    setStep,
    selectEmotion,
    setDreamContent,
    dreamContent,
    isAnalyzing,
    setIsAnalyzing,
    selectStyle,
    selectedStyle,
    selectFormat,
    selectedFormat,
    isGenerating,
    setIsGenerating,
    isSaved,
    setIsSaved,
    showPremiumModal,
    setShowPremiumModal,
    isPremium,
    setIsPremium,
    reset
  } = useChatStore()

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, step, isAnalyzing, isGenerating])

  // Initial Greeting
  useEffect(() => {
    if (messages.length === 0 && step === 0 && !initializedRef.current) {
      initializedRef.current = true
      setTimeout(() => {
        addMessage({
          role: 'ai',
          content: '안녕하세요! 어젯밤 꾸셨던 꿈은 어떠셨나요? 가장 먼저 떠오르는 감정을 알려주세요.',
          type: 'text'
        })
        setStep(1) // Emotion Step
      }, 500)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleEmotionClick = (emotion: EmotionType) => {
    selectEmotion(emotion)
    addMessage({ role: 'user', content: getEmotionLabel(emotion), type: 'text' })

    setTimeout(() => {
      const reaction = getEmotionReaction(emotion)
      addMessage({ role: 'ai', content: reaction, type: 'text' })
      setStep(2) // Reality/Input Step
    }, 600)
  }

  const handleContentSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!dreamContent.trim()) return

    addMessage({ role: 'user', content: dreamContent, type: 'text' })
    setDreamContent('')

    setIsAnalyzing(true)

    setTimeout(() => {
      setIsAnalyzing(false)
      addMessage({ role: 'ai', content: '', type: 'analysis' })

      setTimeout(() => {
        addMessage({ role: 'ai', content: '분석이 완료되었습니다! 이 소중한 무의식을 어떤 형태로 간직하고 싶으신가요?', type: 'text' })
        setStep(4) // Format Step
      }, 1500)
    }, 2000)

    setStep(3) // Analysis Step (Hidden logic state)
  }

  const handleFormatSelect = (format: 'webtoon' | 'animation') => {
    selectFormat(format)
    addMessage({ role: 'user', content: format === 'webtoon' ? '세로 웹툰' : '쇼츠 애니메이션', type: 'text' })

    setTimeout(() => {
      addMessage({ role: 'ai', content: '좋아요! 그럼 어떤 그림체로 그려드릴까요?', type: 'text' })
      setStep(5) // Style Step
    }, 600)
  }

  // Force Logic: Pass full style object
  const handleStyleClick = (style: { id: string; label: string; isPremium: boolean }) => {
    console.log("Selected Style:", style.label, "isPremium:", style.isPremium, "UserPremium:", isPremium)

    if (style.isPremium) {
      // Premium Style Logic
      if (isPremium) {
        // If user is already premium, allow it
        console.log('User is Premium -> Proceeding')
        setShowPremiumModal(false)
        selectStyle(style.id as DreamStyle)
        setIsGenerating(true)
        setStep(6)
        setTimeout(() => { setIsGenerating(false) }, 4000)
      } else {
        // If user is NOT premium, show modal
        console.log('User NOT Premium -> Show Modal')
        setIsGenerating(false)
        setModalType('style') // Set Type to Style
        setShowPremiumModal(true)
      }
    } else {
      // Basic Style Logic
      console.log('Basic Style -> Proceeding')
      setShowPremiumModal(false)
      selectStyle(style.id as DreamStyle)
      setIsGenerating(true)
      setStep(6)

      setTimeout(() => {
        setIsGenerating(false)
      }, 4000)
    }
  }

  const executeSave = () => {
    // Prevent duplicate saves
    if (isSaved) {
      console.log("Dream already saved, skipping.")
      return
    }

    try {
      // Check Save Limit
      const canSave = checkSaveLimit()
      if (!canSave) {
        setModalType('style')
        setShowPremiumModal(true)
        alert("저장 공간이 부족합니다. 프리미엄으로 업그레이드하세요!")
        return
      }

      // Generate Mock Data based on format
      let mockScenes: DreamScene[] = []
      let mockWebtoonUrl = ''
      let mockVideoUrl = ''

      if (selectedFormat === 'webtoon') {
        mockScenes = [
          {
            id: '1',
            sceneNumber: 1,
            description: '꿈의 시작',
            characters: ['나'],
            emotion: 'surprise',
            backgroundKeywords: ['안개', '숲'],
            imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3',
            narration: '깊은 안개 속에서 눈을 떴다.'
          },
          {
            id: '2',
            sceneNumber: 2,
            description: '감정의 고조',
            characters: ['나', '그림자'],
            emotion: 'anxiety',
            backgroundKeywords: ['어둠'],
            imageUrl: 'https://images.unsplash.com/photo-1516410541193-62d80d2208a7',
            dialogue: [{ character: '그림자', text: '왜 도망치는 거지?' }]
          },
          {
            id: '3',
            sceneNumber: 3,
            description: '해결과 평온',
            characters: ['나'],
            emotion: 'peace',
            backgroundKeywords: ['빛', '하늘'],
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            narration: '빛이 쏟아지며 모든 두려움이 사라졌다.'
          }
        ]
        mockWebtoonUrl = 'https://images.unsplash.com/photo-1633469924738-52101af51d87'
      } else {
        // Animation
        mockVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-starry-sky-at-night-1077-large.mp4' // Mock video
      }

      // Create Dream Object
      const newDream: DreamEntry = {
        id: Date.now().toString(),
        userId: 'current-user',
        title: '무의식의 숲을 지나서',
        content: messages.find(m => m.role === 'user' && m.type === 'text' && m.content.length > 20)?.content || '꿈 내용',
        recordedAt: new Date(),
        createdAt: new Date(),
        inputMethod: 'text',
        style: selectedStyle || 'healing',
        format: selectedFormat || 'webtoon',
        scenes: mockScenes,
        analysis: {
          emotions: { joy: 20, anxiety: 60, anger: 10, sadness: 30, surprise: 40, peace: 10 },
          tensionLevel: 50,
          controlLevel: 30,
          isNightmare: false,
          repeatingSymbols: [],
          relationshipPatterns: [],
          hasResolution: false
        },
        tags: [selectedFormat === 'webtoon' ? 'Webtoon' : 'Animation', selectedStyle || 'healing'],
        isFavorite: false,
        webtoonUrl: mockWebtoonUrl,
        videoUrl: mockVideoUrl
      }

      console.log("Saving Dream:", newDream)
      console.log("Previous Store State:", useDreamStore.getState().dreams)

      addDream(newDream)
      updateUser({ monthlySaveCount: (useAuthStore.getState().user?.monthlySaveCount || 0) + 1 })
      setIsSaved(true)
      setPendingSave(false)

      console.log("New Store State:", useDreamStore.getState().dreams)

    } catch (error) {
      console.error("Failed to save dream:", error)
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }
  }

  const handleSaveDream = () => {
    if (!isLoggedIn) {
      setPendingSave(true)
      setIsLoginModalOpen(true)
      return
    }
    executeSave()
  }

  const handleReset = () => {
    reset()
    navigate('/') // Navigate home as requested
  }

  const handleSubscribe = () => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      alert('구독을 위해 로그인이 필요합니다.') // Simple toast replacement
      navigate('/login')
      return
    }

    // If logged in, proceed to subscribe
    setIsPremium(true)
    setShowPremiumModal(false)

    // Update user profile
    updateUser({ subscriptionTier: 'premium' })

    alert('프리미엄 구독이 시작되었습니다! 이제 무제한으로 저장할 수 있습니다.')

    // If pending save existed and was blocked by limit, retry?
    if (pendingSave) {
      executeSave()
    }
  }

  const handleLoginSuccess = () => {
    login()
    setIsLoginModalOpen(false)

    // Resume pending save
    if (pendingSave) {
      // Slight delay to ensure state update
      setTimeout(() => {
        executeSave()
      }, 100)
    }
  }

  // Render Generation View Full Screen or inside Chat?
  // User Prompt: "Loading State... 몽환적인 로딩 애니메이션... Result Display... 결과 카드 노출"
  // It implies replacing the chat view or overlaying. 
  // Given "Step 6" logic, let's render it within the main container, perhaps replacing chat or scrolling to bottom.
  // The Prompt says: "Loading State: ... 즉시 홈으로 리다이렉트되는 대신... 로딩 애니메이션... 결과 카드... Card List below?"
  // Let's render Step 6 as a full view replacement or focused view. 
  // Since it leads to "generation", let's make it fill the content area.

  if (step === 6) {
    return (
      <div className="h-full bg-transparent relative overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center p-6 text-center min-h-full pb-32 pt-4">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">무의식을 그리는 중...</h2>
                  <p className="text-gray-400">당신의 꿈을 웹툰으로 변환하고 있어요</p>
                </div>
              </motion.div>
            ) : (
              <GenerationResult
                key="result"
                title="무의식의 숲을 지나서"
                date={new Date().toLocaleDateString()}
                mediaUrl="https://images.unsplash.com/photo-1633469924738-52101af51d87?q=80&w=1000&auto=format&fit=crop"
                type={selectedFormat || 'webtoon'}
                onSave={handleSaveDream}
                onReset={handleReset}
                onTalkMore={() => {
                  setModalType('deep_chat') // Set Type to Deep Chat
                  setShowPremiumModal(true)
                }}
                isSaved={isSaved}
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPremiumModal && (
            <SubscriptionModal
              onClose={() => setShowPremiumModal(false)}
              onSubscribe={handleSubscribe}
              title={
                modalType === 'style' ? (
                  <>
                    프리미엄 스타일로<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">꿈을 더 생생하게</span> 그려보세요
                  </>
                ) : (
                  <>
                    당신의 무의식,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">더 깊이 들여다볼까요?</span>
                  </>
                )
              }
              description={
                modalType === 'style' ? (
                  <>
                    지브리, 픽사, 시네마틱 실사 등<br />
                    고퀄리티 프리미엄 화풍은 구독 서비스를 통해<br />
                    무제한으로 이용하실 수 있습니다.<br />
                    <span className="font-semibold text-gray-800">지금 바로 당신의 꿈을 영화처럼 만들어보세요!</span>
                  </>
                ) : (
                  <>
                    AI 심리 전문가와 함께하는 1:1 심층 코칭은<br />
                    프리미엄 전용 서비스입니다. 무의식의 진짜 의미를 분석하고<br />
                    현실의 고민을 해결하는 맞춤형 가이드를 받아보세요.
                  </>
                )
              }
              benefits={
                modalType === 'style'
                  ? ['✨ 고해상도 렌더링', '🎨 프리미엄 전용 화풍 10종', '🚫 워터마크 제거']
                  : ['🧠 현실 기반 심층 분석', '📝 개인 맞춤형 액션 플랜', '💬 무제한 대화 기능']
              }
              buttonText={
                modalType === 'style'
                  ? '구독하고 프리미엄 스타일로 시작하기'
                  : '구독하고 심층 대화 시작하기'
              }
            />
          )}
        </AnimatePresence>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  }

  // --- Normal Chat View ---

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-6 pt-24 pb-32">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${messages.indexOf(msg) === 0 ? 'mt-4' : ''}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                ? 'bg-[#2D2A4A] border border-white/5 text-white rounded-tr-none'
                : msg.type === 'analysis'
                  ? 'w-full max-w-md bg-transparent shadow-none p-0'
                  : 'glass-card text-white rounded-tl-none text-sm'
                }`}
            >
              {msg.type === 'analysis' ? (
                <AnalysisDashboard analysis={null} />
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </motion.div>
        ))}

        {isAnalyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass-card rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-xs text-gray-300">열심히 분석하고 있어요...</span>
            </div>
          </motion.div>
        )}

        {/* Step 1: Emotion Selection */}
        {step === 1 && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-4"
          >
            <EmotionChip emotion="joy" label="기쁨" emoji="😊" onClick={() => handleEmotionClick('joy')} />
            <EmotionChip emotion="anxiety" label="불안" emoji="😰" onClick={() => handleEmotionClick('anxiety')} />
            <EmotionChip emotion="anger" label="분노" emoji="😠" onClick={() => handleEmotionClick('anger')} />
            <EmotionChip emotion="sadness" label="슬픔" emoji="😢" onClick={() => handleEmotionClick('sadness')} />
            <EmotionChip emotion="surprise" label="놀람" emoji="😲" onClick={() => handleEmotionClick('surprise')} />
            <EmotionChip emotion="peace" label="평온" emoji="😌" onClick={() => handleEmotionClick('peace')} />
          </motion.div>
        )}

        {/* Step 4: Format Selection */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4 max-w-lg mx-auto mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFormatSelect('webtoon')}
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all text-left group glass-card ${selectedFormat === 'webtoon' ? 'border-teal-400 bg-teal-500/10 shadow-glow' : 'border-white/10 hover:border-teal-400/50'}`}
            >
              <div className={`p-3 rounded-full w-fit mb-4 ${selectedFormat === 'webtoon' ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-gray-400 group-hover:bg-teal-500/10 group-hover:text-teal-400'}`}>
                <Layout size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-1">세로 웹툰</h3>
              <p className="text-gray-400 text-sm">한 칸씩 읽는 몰입감</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFormatSelect('animation')}
              className={`relative overflow-hidden p-6 rounded-2xl border transition-all text-left group glass-card ${selectedFormat === 'animation' ? 'border-teal-400 bg-teal-500/10 shadow-glow' : 'border-white/10 hover:border-teal-400/50'}`}
            >
              <div className={`p-3 rounded-full w-fit mb-4 ${selectedFormat === 'animation' ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-gray-400 group-hover:bg-teal-500/10 group-hover:text-teal-400'}`}>
                <PlayCircle size={24} />
              </div>
              <h3 className="font-bold text-white text-lg mb-1">쇼츠 애니메이션</h3>
              <p className="text-gray-400 text-sm">생생하게 움직이는 꿈</p>
            </motion.button>
          </motion.div>
        )}

        {/* Step 5: Style Selection */}
        {step === 5 && (
          <div className="pb-20">
            {selectedFormat === 'webtoon' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-4"
              >
                {WEBTOON_STYLES.map((s) => (
                  <StyleCard
                    key={s.id}
                    style={s.id}
                    label={s.label}
                    desc={s.desc}
                    isPremium={s.isPremium}
                    selected={selectedStyle === s.id}
                    onClick={() => handleStyleClick(s)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto mt-4 space-y-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">Basic Styles</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ANIMATION_STYLES.filter(s => !s.isPremium).map((s) => (
                      <StyleCard
                        key={s.id}
                        style={s.id}
                        label={s.label}
                        desc={s.desc}
                        isPremium={s.isPremium}
                        selected={selectedStyle === s.id}
                        onClick={() => handleStyleClick(s)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-amber-500 mb-3 ml-1 flex items-center gap-1">
                    <Sparkles size={14} />
                    Premium Styles
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ANIMATION_STYLES.filter(s => s.isPremium).map((s) => (
                      <StyleCard
                        key={s.id}
                        style={s.id}
                        label={s.label}
                        desc={s.desc}
                        isPremium={s.isPremium}
                        selected={selectedStyle === s.id}
                        onClick={() => handleStyleClick(s)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ... (end of chat messages) */}

      {/* Global Modals */}
      <AnimatePresence>
        {showPremiumModal && (
          <SubscriptionModal
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={handleSubscribe}
            title={
              modalType === 'style' ? (
                <>
                  프리미엄 스타일로<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">꿈을 더 생생하게</span> 그려보세요
                </>
              ) : (
                <>
                  당신의 무의식,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">더 깊이 들여다볼까요?</span>
                </>
              )
            }
            description={
              modalType === 'style' ? (
                <>
                  지브리, 픽사, 시네마틱 실사 등<br />
                  고퀄리티 프리미엄 화풍은 구독 서비스를 통해<br />
                  무제한으로 이용하실 수 있습니다.<br />
                  <span className="font-semibold text-gray-800">지금 바로 당신의 꿈을 영화처럼 만들어보세요!</span>
                </>
              ) : (
                <>
                  AI 심리 전문가와 함께하는 1:1 심층 코칭은<br />
                  프리미엄 전용 서비스입니다. 무의식의 진짜 의미를 분석하고<br />
                  현실의 고민을 해결하는 맞춤형 가이드를 받아보세요.
                </>
              )
            }
            benefits={
              modalType === 'style'
                ? ['✨ 고해상도 렌더링', '🎨 프리미엄 전용 화풍 10종', '🚫 워터마크 제거']
                : ['🧠 현실 기반 심층 분석', '📝 개인 맞춤형 액션 플랜', '💬 무제한 대화 기능']
            }
            buttonText={
              modalType === 'style'
                ? '구독하고 프리미엄 스타일로 시작하기'
                : '구독하고 심층 대화 시작하기'
            }
          />
        )}
      </AnimatePresence>

      {/* Input Area (Bottom) */}
      <div className="p-4 bg-[#0F0C29]/90 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 z-20 pb-8 max-w-[1200px] mx-auto">
        <form
          onSubmit={handleContentSubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto bg-white/5 rounded-full p-1.5 border border-white/10 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all"
        >
          <button type="button" className="p-2.5 rounded-full text-gray-400 hover:bg-white/10 transition-colors">
            <Mic size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
            placeholder="이야기를 들려주세요..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm px-2"
          />
          <button
            type="submit"
            disabled={!dreamContent.trim()}
            className={`p-2.5 rounded-full transition-all ${dreamContent.trim() ? 'bg-purple-600 text-white shadow-glow' : 'bg-white/10 text-gray-500'
              }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

// Helpers
const getEmotionLabel = (e: EmotionType) => {
  const map: Record<string, string> = { joy: '기뻤어', anxiety: '불안했어', anger: '화났어', sadness: '슬펐어', surprise: '놀랐어', peace: '평온했어' }
  return map[e] || e
}

const getEmotionReaction = (e: EmotionType) => {
  const map: Record<string, string> = {
    joy: '좋은 꿈을 꾸셨군요! 어떤 점이 가장 즐거우셨나요?',
    anxiety: '저런, 마음이 많이 쓰이셨겠어요. 무엇 때문에 불안하셨나요?',
    anger: '화가 나는 일이 있었군요. 꿈속에서 무슨 일이 있었는지 말씀해 주실래요?',
    sadness: '슬픈 꿈이었군요... 괜찮으시다면 이야기를 더 들려주시겠어요?',
    surprise: '깜짝 놀라셨군요! 어떤 장면이 가장 기억에 남으세요?',
    peace: '편안한 꿈이라 다행이에요. 어떤 풍경이 펼쳐졌나요?'
  }
  return map[e] || '그렇군요. 더 자세히 이야기해 주실래요?'
}
