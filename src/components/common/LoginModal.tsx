import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "react-i18next";

const SUPER_EMAIL = "test@jocoding.net";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const BE_BASE_URL = API_BASE_URL.replace("/api/v1", "");

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const { emailLogin, emailRegister, emailSignin } = useAuthStore();
  const { t } = useTranslation();

  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"register" | "signin">("register");

  const handleKakaoLogin = () => {
    window.location.href = `${BE_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(window.location.origin)}`;
  };

  const resetState = () => {
    setStep("email");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMode("register");
    setShowPassword(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t("loginModal.error.emailRequired"));
      return;
    }
    setError("");

    if (trimmed.toLowerCase() === SUPER_EMAIL) {
      setIsLoading(true);
      try {
        await emailLogin(trimmed);
        resetState();
        onLoginSuccess();
        onClose();
      } catch {
        setError(t("loginModal.error.failed"));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setStep("password");
  };

  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) {
      setError(t("loginModal.error.passwordRequired"));
      return;
    }
    if (mode === "register") {
      if (password.length < 8) {
        setError(t("loginModal.error.passwordTooShort"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("loginModal.error.passwordMismatch"));
        return;
      }
    }
    setError("");
    setIsLoading(true);
    try {
      if (mode === "register") {
        await emailRegister(email.trim(), password);
      } else {
        await emailSignin(email.trim(), password);
      }
      resetState();
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("loginModal.error.failed");
      if (msg.includes("이미 사용 중") || err?.response?.status === 409) {
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
        setError(t("loginModal.error.alreadyRegistered"));
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMode("register");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      {/* 뒤로가기 (비밀번호 단계) */}
      {step === "password" && (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors z-10"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {step === "email" ? (
            <>
              {t("loginModal.title.email")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {t("loginModal.title.emailHighlight")}
              </span>
            </>
          ) : mode === "register" ? (
            t("loginModal.title.register")
          ) : (
            t("loginModal.title.signin")
          )}
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          {step === "email"
            ? t("loginModal.description.email")
            : mode === "register"
              ? t("loginModal.description.register")
              : t("loginModal.description.signin")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div
            key="modal-email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                t("loginModal.benefits.saveDreams"),
                t("loginModal.benefits.monthlyAnalysis"),
                t("loginModal.benefits.premiumAccess"),
                t("loginModal.benefits.hdDownload"),
                t("loginModal.benefits.firstLoginCoupon"),
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 bg-white/5 rounded-lg p-3 border border-white/5 ${
                    idx === 4 ? "col-span-2" : ""
                  }`}
                >
                  <div className="bg-green-500/20 p-1 rounded-full">
                    <Check size={12} className="text-green-400" />
                  </div>
                  <span className="text-xs text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* 이메일 입력 */}
            <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder={t("loginModal.placeholder.email")}
                  className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 px-1">{error}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Mail size={16} />
                )}
                {isLoading ? t("loginModal.button.loggingIn") : t("loginModal.button.emailStart")}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/10 text-gray-400 rounded">
                  {t("loginModal.divider")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleKakaoLogin}
              className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#000000] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {t("loginModal.button.kakaoLogin")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="modal-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* 선택된 이메일 */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-4">
              <Mail
                size={14}
                className="text-purple-400 flex-shrink-0"
              />
              <span className="text-sm text-gray-300 truncate">
                {email}
              </span>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder={t("loginModal.placeholder.password")}
                  className="w-full py-3.5 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {mode === "register" && (
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder={t("loginModal.placeholder.confirmPassword")}
                    className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    disabled={isLoading}
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 px-1">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                {isLoading
                  ? t("loginModal.button.loggingIn")
                  : mode === "register"
                    ? t("loginModal.button.register")
                    : t("loginModal.button.signin")}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-4">
              {mode === "register" ? (
                <>
                  이미 계정이 있으신가요?{" "}
                  <button
                    onClick={() => {
                      setMode("signin");
                      setError("");
                      setConfirmPassword("");
                    }}
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    로그인
                  </button>
                </>
              ) : (
                <>
                  계정이 없으신가요?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    회원가입
                  </button>
                </>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs text-gray-500 text-center">
        로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
      </p>
    </Modal>
  );
};

export default LoginModal;
