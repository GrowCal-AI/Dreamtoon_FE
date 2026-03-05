import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Send } from "lucide-react";
import Particles from "@/components/common/Particles";
import { staggerContainer, staggerItem } from "@/utils/animations";
import { useTranslation } from "react-i18next";

// Isolated Input Component to prevent re-renders
const DreamInput = ({
  onNavigate,
  onVoiceMode,
}: {
  onNavigate: (text: string) => void;
  onVoiceMode: () => void;
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    setIsExiting(true);
    setTimeout(() => {
      onNavigate(inputText);
    }, 500);
  };

  if (isExiting) return null;

  return (
    <motion.div
      className="z-10 w-full px-4 md:px-0 md:max-w-2xl"
      variants={staggerItem}
    >
      <div className="relative glass-card rounded-full px-6 py-3 flex items-center gap-3 border border-white/20 focus-within:border-[#FFFAB5]/50 transition-colors bg-white/5 shadow-[0_0_15px_rgba(255,250,181,0.1)] focus-within:shadow-[0_0_20px_rgba(255,250,181,0.2)]">
        <button
          type="button"
          onClick={onVoiceMode}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          aria-label="Voice input"
        >
          <Mic size={20} />
        </button>
        <input
          type="text"
          placeholder={t('home.inputPlaceholder')}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && inputText.trim()) {
              handleSubmit();
            }
          }}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className={`flex-shrink-0 transition-colors ${
            inputText.trim()
              ? "text-[#FFFAB5] hover:text-white"
              : "text-gray-600 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDreamInput = (text: string) => {
    // 로그인 여부와 상관없이 모두 /chat으로 이동
    navigate("/chat", { state: { initialMessage: text } });
  };

  const handleVoiceMode = () => {
    // 로그인 여부와 상관없이 모두 /chat으로 이동
    navigate("/chat", { state: { voiceMode: true } });
  };

  return (
    <>
      <motion.div
        className="relative flex-1 w-full flex flex-col items-center justify-center text-white overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        exit={{
          opacity: 0,
          y: -20,
          transition: { duration: 0.5, ease: "easeInOut" },
        }}
      >
        {/* Background Gradient (Black Violet) */}
        <div className="fixed inset-0 z-[-2] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#020005] via-[#0B0118] to-[#0F0C29]" />

        {/* Background Particles - Memoized & Stable Props */}
        <Particles
          className="fixed inset-0 z-[-1] pointer-events-none"
          particleCount={150}
          particleBaseSize={1000}
          speed={0.1}
          sizeRandomness={1.0}
          moveParticlesOnHover={true}
          alphaParticles={true}
        />

        {/* Hero Section */}
        <motion.div
          className="z-10 text-center mb-10 md:mb-16 px-4"
          variants={staggerItem}
        >
          <h1 className="text-2xl md:text-5xl mb-3 md:mb-4 tracking-tighter text-[#FFffff] font-bold drop-shadow-[0_0_10px_rgba(255,250,181,0.5)] leading-tight">
            {t('home.title')}
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-medium px-6 md:px-0 leading-relaxed">
            {t('home.description')}
          </p>
        </motion.div>

        {/* Isolated Input Section */}
        <DreamInput
          onNavigate={handleDreamInput}
          onVoiceMode={handleVoiceMode}
        />
      </motion.div>
    </>
  );
}
