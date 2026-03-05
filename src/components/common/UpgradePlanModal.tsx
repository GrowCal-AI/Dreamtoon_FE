import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, X, Crown, Rocket } from "lucide-react";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  errorType?: 'USAGE_LIMIT' | 'PERMISSION_DENIED' | 'SUBSCRIPTION_REQUIRED';
}

export default function UpgradePlanModal({ 
  isOpen, 
  onClose, 
  message,
  errorType = 'USAGE_LIMIT'
}: UpgradePlanModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getContent = () => {
    switch (errorType) {
      case 'USAGE_LIMIT':
        return {
          icon: <Zap className="w-12 h-12 text-yellow-400" />,
          title: "사용량이 모두 소진되었습니다",
          description: message || "이번 달 무료 사용량을 모두 사용하셨습니다.\n더 많은 꿈 분석을 위해 플랜을 업그레이드하세요!",
        };
      case 'PERMISSION_DENIED':
        return {
          icon: <Crown className="w-12 h-12 text-purple-400" />,
          title: "프리미엄 기능입니다",
          description: message || "이 기능은 유료 플랜에서만 사용 가능합니다.\n지금 업그레이드하고 모든 기능을 이용해보세요!",
        };
      case 'SUBSCRIPTION_REQUIRED':
        return {
          icon: <Rocket className="w-12 h-12 text-blue-400" />,
          title: "구독이 필요합니다",
          description: message || "계속 사용하시려면 구독이 필요합니다.\n다양한 플랜을 확인해보세요!",
        };
      default:
        return {
          icon: <Zap className="w-12 h-12 text-yellow-400" />,
          title: "플랜 업그레이드가 필요합니다",
          description: message || "더 많은 기능을 사용하시려면 플랜을 업그레이드하세요!",
        };
    }
  };

  const content = getContent();

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-gray-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>

            {/* Gradient Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative p-8 flex flex-col items-center text-center space-y-6">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center backdrop-blur-sm border border-white/10"
              >
                {content.icon}
              </motion.div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {content.title}
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {content.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 w-full pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Crown size={20} />
                  플랜 업그레이드
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium transition-all border border-white/10"
                >
                  나중에
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
