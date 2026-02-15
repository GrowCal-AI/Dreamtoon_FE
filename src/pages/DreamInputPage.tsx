import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mic, Send, Sparkles, Loader2, Save, RotateCcw, MessageCircle, Check, X, ChevronRight, Layout, PlayCircle } from 'lucide-react'
import { useChatStore } from '@/store/useChatStore'
import { useDreamStore } from '@/store/useDreamStore'
import { useAuthStore } from '@/store/useAuthStore'
import LoginModal from '@/components/common/LoginModal'
import { EmotionType, DreamStyle, DreamEntry } from '@/types'
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
  emotion,
  label,
  emoji,
  color,
  onClick,
}: {
  emotion: EmotionType
  label: string
  emoji: string
  color: string
  onClick: () => void
}) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: color }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all w-24 h-24"
  >
    <span className="text-3xl mb-1">{emoji}</span>
    <span className="text-xs font-medium text-gray-600">{label}</span>
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
    <div className="w-full max-w-md bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        꿈 감정 분석
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="My Dream"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">
            무의식 속에 <span className="font-bold text-purple-700">불안감</span>이
            높게 나타나고 있어요. 현실에서의 스트레스가 꿈에 반영된 것 같아요.
            잠시 휴식을 취하는 건 어떨까요?
          </p>
        </div>
      </div>
    </div>
  )
}

const StyleCard = ({
  style,
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
    className={`relative p-4 rounded-xl text-left transition-all border-2 overflow-hidden ${selected
      ? 'border-purple-500 bg-purple-50 shadow-md'
      : 'border-transparent bg-white hover:border-purple-200'
      }`}
  >
    {isPremium && (
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
        PRO
      </div>
    )}
    <div className="font-bold text-gray-800 flex items-center gap-1">
      {label}
    </div>
    <div className="text-xs text-gray-500">{desc}</div>
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

const SubscriptionModal = ({ onClose, onSubscribe }: { onClose: () => void, onSubscribe: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-teal-400/20 to-purple-500/20 opacity-50 pointer-events-none" />
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20">
        <X size={24} />
      </button>

      <div className="relative z-10 pt-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-200 animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
          프리미엄 스타일로<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">꿈을 더 생생하게</span> 그려보세요
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed mb-6 px-1">
          지브리, 픽사, 시네마틱 실사 등<br />
          고퀄리티 프리미엄 화풍은 구독 서비스를 통해<br />
          무제한으로 이용하실 수 있습니다.<br />
          <span className="font-semibold text-gray-800">지금 바로 당신의 꿈을 영화처럼 만들어보세요!</span>
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['✨ 고해상도 렌더링', '🎨 프리미엄 전용 화풍 10종', '🚫 워터마크 제거'].map((tag, i) => (
            <span key={i} className="px-3 py-1.5 bg-gray-100/80 text-gray-600 text-xs font-semibold rounded-lg border border-gray-200/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={onSubscribe}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-teal-200/50 hover:shadow-teal-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            구독하고 프리미엄 스타일로 시작하기
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 font-medium text-sm transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

const GenerationResult = ({
  onSave,
  onReset,
  onTalkMore,
  isSaved
}: {
  onSave: () => void,
  onReset: () => void,
  onTalkMore: () => void,
  isSaved: boolean
}) => (
  <div className="w-full max-w-md mx-auto space-y-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
    >
      {/* Webtoon Image Area */}
      <div className="aspect-[3/4] bg-gray-200 relative group overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1633469924738-52101af51d87?q=80&w=1000&auto=format&fit=crop"
          alt="Dream Webtoon"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">Today's Dream</span>
          <h2 className="text-white text-2xl font-bold leading-tight">무의식의 숲을 지나서</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-[180px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isSaved ? (
            <motion.div
              key="unsaved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg">오늘의 꿈 웹툰 완성!</h3>
                  <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  당신의 무의식이 그려낸 특별한 이야기입니다.<br />
                  이 꿈을 보관함에 저장하거나, 더 깊은 대화를 나눠보세요.
                </p>
              </div>

              <button
                onClick={onSave}
                className="w-full py-3.5 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-700 font-semibold transition-all flex items-center justify-center gap-2 group"
              >
                <Save size={18} className="text-gray-500 group-hover:text-purple-600 transition-colors" />
                라이브러리에 등록하기
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="flex flex-col items-center justify-center space-y-4 py-4"
            >
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 52 52">
                  <motion.circle
                    cx="26" cy="26" r="25"
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.path
                    fill="none"
                    stroke="#2DD4BF"
                    strokeWidth="2"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-teal-500 mb-1">라이브러리 저장 성공!</h3>
                <p className="text-sm text-gray-500">당신의 소중한 꿈이 안전하게 보관되었습니다.</p>
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => window.location.href = '/library'} // Should be useNavigate in real app context if available or passed down
                className="absolute bottom-6 right-6 flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-teal-500 hover:underline hover:underline-offset-4 transition-all"
              >
                라이브러리 가기
                <ChevronRight size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>

    {/* External Floating CTA Buttons */}
    <AnimatePresence>
      {isSaved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 pt-2"
        >
          <button
            onClick={onReset}
            className="flex-1 py-4 rounded-2xl bg-white shadow-lg shadow-gray-200 border border-gray-100 text-gray-600 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            새로운 채팅
          </button>
          <button
            onClick={onTalkMore}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            꿈 더 대화하기
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)


// --- Main Page ---

export default function DreamInputPage() {
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const { addDream } = useDreamStore()
  const { isLoggedIn, login } = useAuthStore()

  const {
    step,
    messages,
    addMessage,
    setStep,
    selectEmotion,
    selectedEmotion,
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
    if (messages.length === 0 && step === 0) {
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
    const currentDreamContent = dreamContent // capture for storage if needed
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

  const handleSaveDream = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }

    // Create Mock Dream Object
    const newDream: DreamEntry = {
      id: Date.now().toString(),
      userId: 'current-user',
      title: '무의식의 숲을 지나서', // Mock title from result
      content: messages.find(m => m.role === 'user' && m.type === 'text' && m.content.length > 20)?.content || '꿈 내용', // Simply find long user msg
      recordedAt: new Date(),
      createdAt: new Date(),
      inputMethod: 'text',
      style: selectedStyle || 'healing',
      format: selectedFormat || 'webtoon',
      scenes: [],
      analysis: {
        emotions: { joy: 20, anxiety: 60, anger: 10, sadness: 30, surprise: 40, peace: 10 },
        tensionLevel: 50,
        controlLevel: 30,
        isNightmare: false,
        repeatingSymbols: [],
        relationshipPatterns: [],
        hasResolution: false
      },
      tags: ['Webtoon', selectedStyle || 'healing'],
      isFavorite: false,
      webtoonUrl: 'https://images.unsplash.com/photo-1633469924738-52101af51d87' // Mock URL
    }

    addDream(newDream)
    setIsSaved(true)

    // Optional: Show toast or small animation feedback?
    // User requested "success interaction (check mark animation)". 
    // Button changes state, which implies success visually. 
    // Additional global toast could be added here if we had a toast system.
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

    // If a style was selected before (but blocked), strictly we might want to auto-continue.
    // But for now just feedback is enough.
    alert('프리미엄 구독이 시작되었습니다! 이제 프리미엄 화풍을 사용할 수 있습니다.')
  }

  const handleLoginSuccess = () => {
    login()
    setIsLoginModalOpen(false)
    // Retry save after login
    // We need to call the logic of handleSaveDream again, but bypassing the check?
    // Actually simpler to just copy the save logic or extract it. 
    // Since state is preserved, calling handleSaveDream again will work because isLoggedIn is now true (if we set it).
    // But login() updates store, component re-renders. 
    // Let's just manually trigger save here to be safe and avoiding race conditions with store update if it's async (Zustand is sync though).

    // We can't easily call handleSaveDream() here if it's closed over the scope and we want to rely on the updated store value *in the next render*.
    // However, since we update store via login(), the next render will have isLoggedIn=true.
    // But we want to trigger it *now*.

    // Let's extract the core save logic or just duplicate it for this mock.
    // For now, I'll direct call handleSaveDream, but I need to ensure isLoggedIn is true when it runs.
    // Since I called login(), useAuthStore should update. 
    // But inside this function closure, `isLoggedIn` const is still false.

    // So I will implement the save logic directly here.
    const newDream: DreamEntry = {
      id: Date.now().toString(),
      userId: 'current-user',
      title: '무의식의 숲을 지나서', // Mock title from result
      content: messages.find(m => m.role === 'user' && m.type === 'text' && m.content.length > 20)?.content || '꿈 내용',
      recordedAt: new Date(),
      createdAt: new Date(),
      inputMethod: 'text',
      style: selectedStyle || 'healing',
      format: selectedFormat || 'webtoon',
      scenes: [],
      analysis: {
        emotions: { joy: 20, anxiety: 60, anger: 10, sadness: 30, surprise: 40, peace: 10 },
        tensionLevel: 50,
        controlLevel: 30,
        isNightmare: false,
        repeatingSymbols: [],
        relationshipPatterns: [],
        hasResolution: false
      },
      tags: ['Webtoon', selectedStyle || 'healing'],
      isFavorite: false,
      webtoonUrl: 'https://images.unsplash.com/photo-1633469924738-52101af51d87'
    }

    addDream(newDream)
    setIsSaved(true)
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
      <div className="h-full bg-gray-50/50 relative overflow-y-auto scrollbar-hide">
        <header className="glass-effect sticky top-0 z-10 px-6 py-4 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm">Dream AI 도슨트</h1>
              <div className="text-xs text-purple-600 font-medium">{isGenerating ? '웹툰 생성 중...' : '생성 완료'}</div>
            </div>
          </div>
          <button onClick={handleReset} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </header>

        <div className="flex flex-col items-center justify-center p-6 text-center min-h-full pb-32">
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
                  <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-purple-50 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">무의식을 그리는 중...</h2>
                  <p className="text-gray-500">당신의 꿈을 웹툰으로 변환하고 있어요</p>
                </div>
              </motion.div>
            ) : (
              <GenerationResult
                key="result"
                onSave={handleSaveDream}
                onReset={handleReset}
                onTalkMore={() => setShowPremiumModal(true)}
                isSaved={isSaved}
              />
            )}
          </AnimatePresence>
        </div>



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
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-10 px-6 py-4 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm">Dream AI 도슨트</h1>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-xs text-gray-500">{isAnalyzing ? '꿈 분석 중...' : '대화 중'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                ? 'bg-white border border-purple-100 text-gray-800 rounded-tr-none'
                : msg.type === 'analysis'
                  ? 'w-full max-w-md bg-transparent shadow-none p-0'
                  : 'bg-white/80 backdrop-blur-sm border border-white/40 text-gray-800 rounded-tl-none text-sm'
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
            <div className="bg-white/80 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span className="text-xs text-gray-500">열심히 분석하고 있어요...</span>
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
            <EmotionChip emotion="joy" label="기쁨" emoji="😊" color="#fef3c7" onClick={() => handleEmotionClick('joy')} />
            <EmotionChip emotion="anxiety" label="불안" emoji="😰" color="#e9d5ff" onClick={() => handleEmotionClick('anxiety')} />
            <EmotionChip emotion="anger" label="분노" emoji="😠" color="#fca5a5" onClick={() => handleEmotionClick('anger')} />
            <EmotionChip emotion="sadness" label="슬픔" emoji="😢" color="#bfdbfe" onClick={() => handleEmotionClick('sadness')} />
            <EmotionChip emotion="surprise" label="놀람" emoji="😲" color="#fde68a" onClick={() => handleEmotionClick('surprise')} />
            <EmotionChip emotion="peace" label="평온" emoji="😌" color="#bbf7d0" onClick={() => handleEmotionClick('peace')} />
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
              className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all text-left group bg-white/40 backdrop-blur-sm ${selectedFormat === 'webtoon' ? 'border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'border-white/20 hover:border-teal-200'}`}
            >
              <div className={`p-3 rounded-full w-fit mb-4 ${selectedFormat === 'webtoon' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-500'}`}>
                <Layout size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">세로 웹툰</h3>
              <p className="text-gray-500 text-sm">한 칸씩 읽는 몰입감</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFormatSelect('animation')}
              className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all text-left group bg-white/40 backdrop-blur-sm ${selectedFormat === 'animation' ? 'border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'border-white/20 hover:border-teal-200'}`}
            >
              <div className={`p-3 rounded-full w-fit mb-4 ${selectedFormat === 'animation' ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-50 group-hover:text-teal-500'}`}>
                <PlayCircle size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">쇼츠 애니메이션</h3>
              <p className="text-gray-500 text-sm">생생하게 움직이는 꿈</p>
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
                  <h3 className="text-sm font-bold text-gray-500 mb-3 ml-1">Basic Styles</h3>
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
          />
        )}
      </AnimatePresence>

      {/* Input Area (Bottom) */}
      <div className="p-4 bg-white border-t border-purple-100 sticky bottom-0 z-20 pb-8">
        <form
          onSubmit={handleContentSubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto bg-gray-100/50 rounded-full p-1.5 border border-gray-200 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
        >
          <button type="button" className="p-2.5 rounded-full text-gray-400 hover:bg-gray-200 transition-colors">
            <Mic size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={dreamContent}
            onChange={(e) => setDreamContent(e.target.value)}
            placeholder="이야기를 들려주세요..."
            className="flex-1 bg-transparent border-none outline-none text-sm px-2"
          />
          <button
            type="submit"
            disabled={!dreamContent.trim()}
            className={`p-2.5 rounded-full transition-all ${dreamContent.trim() ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'
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
