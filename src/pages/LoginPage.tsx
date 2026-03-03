import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const SUPER_EMAIL = "test@jocoding.net";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const BE_BASE_URL = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return API_BASE_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }
})();

export default function LoginPage() {
  const navigate = useNavigate();
  const { emailLogin, emailRegister, emailSignin } = useAuthStore();

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

  const handleEmailSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setError("");

    // 슈퍼계정 → 바로 로그인
    if (trimmed.toLowerCase() === SUPER_EMAIL) {
      setIsLoading(true);
      try {
        await emailLogin(trimmed);
        navigate("/");
      } catch {
        setError("로그인에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 일반 계정 → 비밀번호 입력 단계로
    setStep("password");
  };

  const handlePasswordSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    if (mode === "register") {
      if (password.length < 4) {
        setError("비밀번호는 4자 이상이어야 합니다.");
        return;
      }
      if (password !== confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
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
      navigate("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "실패했습니다. 다시 시도해 주세요.";
      // 이미 가입된 이메일이면 로그인 모드로 전환
      if (msg.includes("이미 사용 중") || err?.response?.status === 409) {
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
        setError("이미 가입된 이메일입니다. 비밀번호로 로그인해 주세요.");
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-[#0F0C29]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10"
      >
        <button
          onClick={step === "password" ? handleBack : () => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="text-center mb-10 pt-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === "email" ? "Welcome Back" : mode === "register" ? "회원가입" : "로그인"}
          </h1>
          <p className="text-gray-400 text-sm">
            {step === "email"
              ? "로그인하고 당신의 꿈을 영구히 보관하세요."
              : mode === "register"
                ? "비밀번호를 설정해 주세요."
                : "비밀번호를 입력해 주세요."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <form onSubmit={handleEmailSubmit} className="space-y-3">
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
                    placeholder="이메일을 입력하세요"
                    className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-400 px-1">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {isLoading ? "로그인 중..." : "이메일로 시작하기"}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#0F0C29] text-gray-500">또는</span>
                </div>
              </div>

              <button
                onClick={handleKakaoLogin}
                className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#000000] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span className="font-bold">Kakao</span>
                <span>로 시작하기</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="password-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* 선택된 이메일 표시 */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <Mail size={14} className="text-purple-400 flex-shrink-0" />
                <span className="text-sm text-gray-300 truncate">{email}</span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                {/* 비밀번호 */}
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
                    placeholder="비밀번호"
                    className="w-full py-3.5 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* 비밀번호 확인 (회원가입 모드만) */}
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
                      placeholder="비밀번호 확인"
                      className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {error && <p className="text-xs text-red-400 px-1">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sparkles size={18} />
                  )}
                  {isLoading
                    ? "처리 중..."
                    : mode === "register"
                      ? "회원가입"
                      : "로그인"}
                </button>
              </form>

              {/* 모드 전환 */}
              <p className="text-center text-xs text-gray-500">
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

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            계속 진행함으로써 Dreamtoon의
            <button className="underline mx-1 hover:text-gray-300">
              이용약관
            </button>{" "}
            및
            <button className="underline mx-1 hover:text-gray-300">
              개인정보 처리방침
            </button>
            에 동의하게 됩니다.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
