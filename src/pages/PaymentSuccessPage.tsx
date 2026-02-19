import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { subscriptionAPI } from '@/services/api'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // agent.txt: 결제 완료 후 홈 복귀 시 /subscriptions/usage 재호출
  const { refreshUsage } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'cancel'>('loading')

  const isCancel = searchParams.get('cancelled') === 'true'

  useEffect(() => {
    if (isCancel) {
      setStatus('cancel')
      return
    }

    // 결제 완료: Polar 구독 동기화 후 usage 재조회 → tier 자동 갱신
    // (로컬 환경에서는 웹훅이 도달하지 못하므로 sync로 직접 Polar에서 구독 정보를 가져옴)
    const refresh = async () => {
      try {
        await new Promise((r) => setTimeout(r, 2000))
        // 1) Polar → 로컬 DB 동기화 (웹훅 누락 대비)
        try {
          await subscriptionAPI.syncSubscription()
        } catch {
          // sync 실패해도 계속 진행 (웹훅으로 이미 처리된 경우)
        }
        // 2) 갱신된 usage 조회
        await refreshUsage()
        setStatus('success')
      } catch {
        setStatus('success')
      }
    }
    refresh()
  }, [isCancel, refreshUsage])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#020005] via-[#0B0118] to-[#0F0C29] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1638] border border-white/10 rounded-3xl p-10 w-full max-w-md text-center shadow-2xl"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">결제 확인 중...</h2>
            <p className="text-gray-400 text-sm">잠시만 기다려주세요</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">구독이 시작되었습니다!</h2>
            </div>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              결제가 완료되었습니다.<br />
              이제 새로운 기능을 마음껏 이용하세요.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/chat')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                꿈 이야기 시작하기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </>
        )}

        {status === 'cancel' && (
          <>
            <XCircle className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">결제가 취소되었습니다</h2>
            <p className="text-gray-400 text-sm mb-8">
              언제든지 다시 구독을 시작할 수 있습니다.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10"
              >
                요금제 다시 보기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
