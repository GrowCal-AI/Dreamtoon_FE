import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, X, Loader2, Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { subscriptionAPI } from "@/services/api";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

// Polar Product IDs
const POLAR_PRODUCT_IDS = {
  FREE: "4ed51c5f-c7b8-4e55-8253-6ba8b8b7f069",
  PLUS: "7a7cdb06-2751-4490-94c2-77c7ff4ea3ea",
  PRO: "3f6e2dd6-5664-4ff9-b1c1-bc1e006f2c43",
  ULTRA: "bfac16e3-39d4-449a-9967-b76ea74b7b53",
} as const;

type Tier = keyof typeof POLAR_PRODUCT_IDS;

interface Plan {
  tier: Tier;
  name: string;
  price: string;
  priceUsd: string;
  buttonLabel: string;
  highlight: boolean;
  badge?: string;
  features: { icon: string; text: string }[];
}

interface PricingPageProps {
  onClose?: () => void;
  // modal 모드일 때 true
  isModal?: boolean;
}

export default function PricingPage({
  onClose,
  isModal = false,
}: PricingPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoggedIn, user, refreshUsage } = useAuthStore();
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const currentTier = (user?.subscriptionTier?.toUpperCase() ?? "FREE") as Tier;
  const isPaidTier = currentTier !== "FREE";

  const PLANS: Plan[] = [
    {
      tier: "FREE",
      name: t('pricing.free'),
      price: "0원",
      priceUsd: "$0",
      buttonLabel: t('pricing.useButton.free'),
      highlight: false,
      features: [
        { icon: "🖼️", text: t('pricing.plans.free.feature1') },
        { icon: "💛", text: t('pricing.plans.free.feature2') },
        { icon: "🗂️", text: t('pricing.plans.free.feature3') },
        { icon: "🌙", text: t('pricing.plans.free.feature4') },
        { icon: "💾", text: t('pricing.plans.free.feature5') },
        { icon: "🧪", text: t('pricing.plans.free.feature6') },
      ],
    },
    {
      tier: "PLUS",
      name: t('pricing.plus'),
      price: "₩1,990",
      priceUsd: "$1.50",
      buttonLabel: t('pricing.useButton.plus'),
      highlight: false,
      features: [
        { icon: "🖼️", text: t('pricing.plans.plus.feature1') },
        { icon: "💛", text: t('pricing.plans.plus.feature2') },
        { icon: "🗂️", text: t('pricing.plans.plus.feature3') },
        { icon: "🌙", text: t('pricing.plans.plus.feature4') },
        { icon: "💾", text: t('pricing.plans.plus.feature5') },
        { icon: "🧪", text: t('pricing.plans.plus.feature6') },
      ],
    },
    {
      tier: "PRO",
      name: t('pricing.pro'),
      price: "₩9,900",
      priceUsd: "$6.50",
      buttonLabel: t('pricing.useButton.pro'),
      highlight: true,
      badge: t('pricing.recommended'),
      features: [
        { icon: "🖼️", text: t('pricing.plans.pro.feature1') },
        { icon: "💛", text: t('pricing.plans.pro.feature2') },
        { icon: "🗂️", text: t('pricing.plans.pro.feature3') },
        { icon: "🌙", text: t('pricing.plans.pro.feature4') },
        { icon: "💾", text: t('pricing.plans.pro.feature5') },
        { icon: "🧪", text: t('pricing.plans.pro.feature6') },
      ],
    },
    {
      tier: "ULTRA",
      name: t('pricing.ultra'),
      price: "₩19,900",
      priceUsd: "$13.50",
      buttonLabel: t('pricing.useButton.ultra'),
      highlight: false,
      badge: t('pricing.best'),
      features: [
        { icon: "🖼️", text: t('pricing.plans.ultra.feature1') },
        { icon: "💛", text: t('pricing.plans.ultra.feature2') },
        { icon: "🗂️", text: t('pricing.plans.ultra.feature3') },
        { icon: "🌙", text: t('pricing.plans.ultra.feature4') },
        { icon: "💾", text: t('pricing.plans.ultra.feature5') },
        { icon: "🧪", text: t('pricing.plans.ultra.feature6') },
      ],
    },
  ];

  const handleSelectPlan = async (plan: Plan) => {
    // 무료 플랜은 결제 불필요
    if (plan.tier === "FREE") {
      if (onClose) onClose();
      else navigate("/");
      return;
    }

    // 현재 플랜과 동일하면 무시
    if (plan.tier === currentTier) return;

    // 로그인 필요
    if (!isLoggedIn) {
      navigate("/login", { state: { redirectTo: "/pricing" } });
      return;
    }

    setLoadingTier(plan.tier);
    setSyncMessage(null);

    // 결제 완료/취소 후 돌아올 URL
    const successUrl = `${window.location.origin}/payment/success`;
    const cancelUrl = `${window.location.origin}/payment/cancel?cancelled=true`;

    try {
      // 백엔드에서 Polar Checkout Session URL 받아오기
      const result = await subscriptionAPI.createCheckout(
        plan.tier as "PLUS" | "PRO" | "ULTRA",
      );
      window.location.href = result.checkoutUrl;
    } catch (err) {
      const axiosErr = err as AxiosError<{ code?: string; message?: string }>;
      const errorCode = axiosErr.response?.data?.code;

      // "이미 구독 중" 에러 → Polar에서 기존 구독 정보를 동기화
      if (errorCode === "SUB009" || axiosErr.response?.status === 409) {
        try {
          await subscriptionAPI.syncSubscription();
          await refreshUsage();
          setSyncMessage(t('pricing.syncSuccess'));
        } catch {
          setSyncMessage(t('pricing.syncFailed'));
        }
        return;
      }

      console.error("Checkout 생성 실패:", err);
      // fallback: Polar Checkout Link + success/cancel URL 파라미터
      const fallbackUrls: Record<string, string> = {
        PLUS: `https://buy.polar.sh/${POLAR_PRODUCT_IDS.PLUS}`,
        PRO: `https://buy.polar.sh/${POLAR_PRODUCT_IDS.PRO}`,
        ULTRA: `https://buy.polar.sh/${POLAR_PRODUCT_IDS.ULTRA}`,
      };
      const base = fallbackUrls[plan.tier];
      if (base) {
        const url = new URL(base);
        url.searchParams.set("success_url", successUrl);
        url.searchParams.set("cancel_url", cancelUrl);
        window.location.href = url.toString();
      }
    } finally {
      setLoadingTier(null);
    }
  };

  const content = (
    <div
      className={`w-full ${isModal ? "max-h-[90vh] overflow-y-auto" : "min-h-screen py-20 px-4"}`}
    >
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
            <span className="text-purple-400 font-semibold text-sm tracking-wider uppercase">
              {t('pricing.badge')}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('pricing.title')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {t('pricing.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* 동기화 메시지 */}
      {syncMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-2xl mx-auto mb-6 px-4 py-3 rounded-xl text-center text-sm font-medium ${
            syncMessage.includes("실패")
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "bg-green-500/20 text-green-300 border border-green-500/30"
          }`}
        >
          {syncMessage}
        </motion.div>
      )}

      {/* 플랜 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PLANS.map((plan, idx) => {
          const isCurrentPlan = plan.tier === currentTier;
          const isLoading = loadingTier === plan.tier;

          return (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all ${
                plan.highlight
                  ? "border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {/* 배지 */}
              {plan.badge && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                    plan.highlight ? "bg-purple-500" : "bg-amber-500"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              {/* 현재 플랜 표시 */}
              {isCurrentPlan && isLoggedIn && (
                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                  {t('pricing.currentPlan')}
                </div>
              )}

              {/* 플랜 이름 */}
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

              {/* 가격 */}
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.tier !== "FREE" && (
                  <span className="text-gray-400 text-sm ml-1">{t('pricing.perMonth')}</span>
                )}
                {plan.tier !== "FREE" && (
                  <div className="text-gray-500 text-xs mt-0.5">
                    {t('pricing.chargedAs', { price: plan.priceUsd })}
                  </div>
                )}
              </div>

              {/* 기능 목록 */}
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-base leading-none mt-0.5 flex-shrink-0">
                      {f.icon}
                    </span>
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
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                    : plan.highlight
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t('pricing.processing')}
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
          );
        })}
      </div>

      {/* 구독 관리 버튼 (유료 사용자만 표시) */}
      {isPaidTier && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-8 text-center"
        >
          <button
            onClick={async () => {
              try {
                const result = await subscriptionAPI.getPortalUrl();
                window.location.href = result.portalUrl;
              } catch (error) {
                console.error("Portal URL 조회 실패:", error);
                alert(t('pricing.manageAlert'));
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Settings size={18} />
            <span className="font-medium">{t('pricing.manageSubscription')}</span>
          </button>
          <p className="text-gray-500 text-xs mt-3">
            {t('pricing.manageDescription')}
          </p>
        </motion.div>
      )}

      {/* 안내 문구 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-10 space-y-3"
      >
        <p className="text-gray-500 text-xs">
          {t('pricing.footer')}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors underline"
          >
            {t('pricing.termsOfService')}
          </a>
          <span>·</span>
          <a
            href="/refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors underline"
          >
            {t('pricing.refundPolicy')}
          </a>
          <span>·</span>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors underline"
          >
            {t('pricing.privacyPolicy')}
          </a>
        </div>
      </motion.div>
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
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
    );
  }

  // 풀 페이지 모드
  return (
    <div className="relative min-h-screen  text-white">
      <div className="pt-20">{content}</div>
    </div>
  );
}
