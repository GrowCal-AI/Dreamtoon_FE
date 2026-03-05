import { motion } from 'framer-motion';
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
  onClose: () => void;
  message?: string;
  redirectTo?: string;
  isOpen?: boolean; // 기존 코드 호환성
  onLoginSuccess?: () => void; // 기존 코드 호환성
}

export default function LoginModal({ onClose, message, redirectTo, isOpen = true, onLoginSuccess }: LoginModalProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigate('/login', { state: { redirectTo: redirectTo || '/' } });
    onClose();
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSignup = () => {
    navigate('/login', { state: { redirectTo: redirectTo || '/', isSignup: true } });
    onClose();
    if (onLoginSuccess) onLoginSuccess();
  };

  // isOpen이 false면 렌더링하지 않음
  if (!isOpen) return null;

  return (
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
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#1A1638] border border-white/10 rounded-3xl p-8 w-full max-w-md text-center shadow-2xl relative"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* 아이콘 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        {/* 메시지 */}
        <h2 className="text-2xl font-bold text-white mb-3">
          {message || "로그인이 필요합니다"}
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          무료 체험은 1회만 가능합니다.<br />
          계속 사용하려면 로그인해주세요!
        </p>

        {/* 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <LogIn size={18} />
            {t('header.login')}
          </button>
          <button
            onClick={handleSignup}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all border border-white/10"
          >
            <UserPlus size={18} className="inline mr-2" />
            회원가입
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
