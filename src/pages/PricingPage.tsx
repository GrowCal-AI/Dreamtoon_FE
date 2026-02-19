import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles, X, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { subscriptionAPI } from '@/services/api'
import { AxiosError } from 'axios'

// Polar Product IDs
const POLAR_PRODUCT_IDS = {
  FREE:  '4ed51c5f-c7b8-4e55-8253-6ba8b8b7f069',
  PLUS:  '7a7cdb06-2751-4490-94c2-77c7ff4ea3ea',
  PRO:   '3f6e2dd6-5664-4ff9-b1c1-bc1e006f2c43',
  ULTRA: 'bfac16e3-39d4-449a-9967-b76ea74b7b53',
} as const

type Tier = keyof typeof POLAR_PRODUCT_IDS

interface Plan {
  tier: Tier
  name: string
  price: string
  priceUsd: string
  buttonLabel: string
  highlight: boolean
  badge?: string
  features: { icon: string; text: string }[]
}

const PLANS: Plan[] = [
  {
    tier: 'FREE',
    name: '무료',
    price: '0원',
    priceUsd: '$0',
    buttonLabel: '무료 사용',
    highlight: false,
    features: [
      { icon: '🖼️', text: '스탠다드 이미지 월 1회' },
      { icon: '💛', text: '프리미엄 이미지 최초 1회 (회원가입 후 로그인 시)' },
      { icon: '🗂️', text: '감정 분석 월 1회' },
      { icon: '🌙', text: '꿈 내용 상담 월 1회' },
      { icon: '💾', text: '이미지 저장 총 10개' },
      { icon: '🧪', text: '건강 측정 월 1회' },
    ],
  },
  {
    tier: 'PLUS',
    name: 'Plus',
    price: '₩1,990',
    priceUsd: '$1.50',
    buttonLabel: 'Plus 사용',
    highlight: false,
    features: [
      { icon: '🖼️', text: '스탠다드 이미지 월 5회' },
      { icon: '💛', text: '프리미엄 이미지 월 1회' },
      { icon: '🗂️', text: '감정 분석 월 5회' },
      { icon: '🌙', text: '꿈 내용 상담 월 5회' },
      { icon: '💾', text: '이미지 저장 총 20개' },
      { icon: '🧪', text: '건강 측정 월 1회' },
    ],
  },
  {
    tier: 'PRO',
    name: 'Pro',
    price: '₩9,900',
    priceUsd: '$6.50',
    buttonLabel: 'Pro 사용',
    highlight: true,
    badge: '추천',
    features: [
      { icon: '🖼️', text: '스탠다드 이미지 월 20회' },
      { icon: '💛', text: '프리미엄 이미지 월 5회' },
      { icon: '🗂️', text: '감정 분석 무제한' },
      { icon: '🌙', text: '꿈 내용 상담 월 30회' },
      { icon: '💾', text: '이미지 저장 총 무제한' },
      { icon: '🧪', text: '건강 측정 매주 제공' },
    ],
  },
  {
    tier: 'ULTRA',
    name: 'Ultra',
    price: '₩19,900',
    priceUsd: '$13.50',
    buttonLabel: 'Ultra 사용',
    highlight: false,
    badge: '최고',
    features: [
      { icon: '🖼️', text: '스탠다드 이미지 무제한' },
      { icon: '💛', text: '프리미엄 이미지 월 20회' },
      { icon: '🗂️', text: '감정 분석 무제한' },
      { icon: '🌙', text: '꿈 내용 상담 무제한' },
      { icon: '💾', text: '이미지 저장 총 무제한' },
      { icon: '🧪', text: '건강 측정 AI 기반 매일 제공' },
    ],
  },
]

interface PricingPageProps {
  onClose?: () => void
  // modal 모드일 때 true
  isModal?: boolean
}

export default function PricingPage({ onClose, isModal = false }: PricingPageProps) {
  const navigate = useNavigate()
  const { isLoggedIn, user, refreshUsage } = useAuthStore()
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const currentTier = (user?.subscriptionTier?.toUpperCase() ?? 'FREE') as Tier

  const handleSelectPlan = async (plan: Plan) => {
    // 무료 플랜은 결제 불필요
    if (plan.tier === 'FREE') {
      if (onClose) onClose()
      else navigate('/')
      return
    }

    // 현재 플랜과 동일하면 무시
    if (plan.tier === currentTier) return

    // 로그인 필요
    if (!isLoggedIn) {
      navigate('/login', { state: { redirectTo: '/pricing' } })
      return
    }

    setLoadingTier(plan.tier)
    setSyncMessage(null)
    try {
      // 백엔드에서 Polar Checkout Session URL 받아오기
      const result = await subscriptionAPI.createCheckout(plan.tier as 'PLUS' | 'PRO' | 'ULTRA')
      // Polar 결제 페이지로 이동
      window.location.href = result.checkoutUrl
    } catch (err) {
      const axiosErr = err as AxiosError<{ code?: string; message?: string }>
      const errorCode = axiosErr.response?.data?.code

      // "이미 구독 중" 에러 → Polar에서 기존 구독 정보를 동기화
      if (errorCode === 'SUB009' || axiosErr.response?.status === 409) {
        try {
          await subscriptionAPI.syncSubscription()
          await refreshUsage()
          setSyncMessage('기존 구독 정보를 동기화했습니다! 플랜이 업데이트되었습니다.')
        } catch {
          setSyncMessage('구독 동기화에 실패했습니다. 잠시 후 다시 시도해주세요.')
        }
        return
      }

      console.error('Checkout 생성 실패:', err)
      // 백엔드 API 미구현 시 Polar Checkout Link로 직접 이동 (fallback)
      const fallbackUrls: Record<string, string> = {
        PLUS:  `https://buy.polar.sh/${POLAR_PRODUCT_IDS.PLUS}`,
        PRO:   `https://buy.polar.sh/${POLAR_PRODUCT_IDS.PRO}`,
        ULTRA: `https://buy.polar.sh/${POLAR_PRODUCT_IDS.ULTRA}`,
      }
      const url = fallbackUrls[plan.tier]
      if (url) window.location.href = url
    } finally {
      setLoadingTier(null)
    }
  }

  const content = (
    <div className={`w-full ${isModal ? 'max-h-[90vh] overflow-y-auto' : 'min-h-screen py-20 px-4'}`}>
      {/* 헤더 */}
      <div className="text-center mb-12 relative">
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm tracking-wider uppercase">요금제</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            당신의 꿈에 맞는 플랜을 선택하세요
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            결제는 USD로 처리됩니다 · 언제든지 취소 가능
          </p>
        </motion.div>
      </div>

      {/* 동기화 메시지 */}
      {syncMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-2xl mx-auto mb-6 px-4 py-3 rounded-xl text-center text-sm font-medium ${
            syncMessage.includes('실패')
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}
        >
          {syncMessage}
        </motion.div>
      )}

      {/* 플랜 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan, idx) => {
          const isCurrentPlan = plan.tier === currentTier
          const isLoading = loadingTier === plan.tier

          return (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all ${
                plan.highlight
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {/* 배지 */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  plan.highlight ? 'bg-purple-500' : 'bg-amber-500'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* 현재 플랜 표시 */}
              {isCurrentPlan && isLoggedIn && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                  현재 플랜
                </div>
              )}

              {/* 플랜 이름 */}
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

              {/* 가격 */}
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">{plan.price}</span>
                {plan.tier !== 'FREE' && (
                  <span className="text-gray-400 text-sm ml-1">/ 월</span>
                )}
                {plan.tier !== 'FREE' && (
                  <div className="text-gray-500 text-xs mt-0.5">{plan.priceUsd} USD로 청구됩니다</div>
                )}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">{f.icon}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA 버튼 */}
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isCurrentPlan
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                    : plan.highlight
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    처리 중...
                  </>
                ) : isCurrentPlan ? (
                  <>
                    <Check size={16} />
                    {plan.buttonLabel}
                  </>
                ) : (
                  plan.buttonLabel
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* 안내 문구 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-500 text-xs mt-10"
      >
        결제는 Polar를 통해 안전하게 처리됩니다 · 구독 취소는 언제든지 가능합니다
      </motion.p>
    </div>
  )

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#0F0C29] border border-white/10 rounded-3xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {content}
        </motion.div>
      </motion.div>
    )
  }

  // 풀 페이지 모드
  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#020005] via-[#0B0118] to-[#0F0C29] text-white">
      <div className="pt-20">
        {content}
      </div>
    </div>
  )
}
