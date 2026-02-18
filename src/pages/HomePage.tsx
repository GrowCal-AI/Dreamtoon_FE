import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Send } from "lucide-react";
import Particles from "@/components/common/Particles";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Isolated Input Component to prevent re-renders
const DreamInput = ({ onNavigate }: { onNavigate: () => void }) => {
  const [inputText, setInputText] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleMicClick = () => {
    console.log("Voice input triggered");
    // Future STT logic here
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;

    console.log("Submitting dream...");
    setIsExiting(true);

    // Allow exit animation to play before navigating
    setTimeout(() => {
      onNavigate();
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (isExiting) return null;

  return (
    <motion.div
      className="z-10 w-full px-4 md:px-0 md:max-w-2xl"
      variants={itemVariants}
    >
      <div className="glass-card h-[48px] px-4 flex items-center gap-3 border border-white/20 focus-within:border-[#FFFAB5]/50 transition-colors bg-white/5 shadow-[0_0_15px_rgba(255,250,181,0.1)] focus-within:shadow-[0_0_20px_rgba(255,250,181,0.2)]">
        {/* Mic Icon */}
        <motion.button
          onClick={handleMicClick}
          className="text-gray-400 hover:text-[#FFFAB5] transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Mic size={20} />
        </motion.button>

        {/* Input Field */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="어젯밤 꿈 이야기를 해보세요..."
          className="flex-1 bg-transparent border-none outline-none text-base md:text-lg text-[#FFFAB5] placeholder-gray-500"
        />

        {/* Send Icon */}
        <motion.button
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className={`transition-all duration-300 ${
            inputText.trim()
              ? "text-[#FFFAB5] hover:scale-110"
              : "text-gray-600 cursor-not-allowed"
          }`}
          whileHover={inputText.trim() ? { scale: 1.05 } : {}}
          whileTap={inputText.trim() ? { scale: 0.95 } : {}}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative flex-1 w-full flex flex-col items-center justify-center text-white overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
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
          variants={itemVariants}
        >
          <h1 className="text-2xl md:text-5xl mb-3 md:mb-4 tracking-tighter text-[#FFffff] font-bold drop-shadow-[0_0_10px_rgba(255,250,181,0.5)] leading-tight">
            당신의 꿈을 들려주세요
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-medium px-6 md:px-0 leading-relaxed">
            무의식이 만든 이야기를 AI가 멋진 웹툰으로 만들어드립니다
          </p>
        </motion.div>

        {/* Isolated Input Section */}
        <DreamInput onNavigate={() => navigate("/chat")} />
      </motion.div>
    </AnimatePresence>
  );
}
