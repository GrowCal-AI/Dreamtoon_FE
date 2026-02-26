import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface SubscriptionPromptProps {
  onClose: () => void;
  onSubscribe: () => void;
  title: ReactNode;
  description: ReactNode;
  benefits: string[];
  buttonText: string;
}

export const SubscriptionPrompt = ({
  onClose,
  onSubscribe,
  title,
  description,
  benefits,
  buttonText,
}: SubscriptionPromptProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-[#1A1638] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-teal-400/20 to-purple-500/20 opacity-30 pointer-events-none" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="relative z-10 pt-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
          {title}
        </h2>

        <p className="text-gray-300 text-sm leading-relaxed mb-6 px-1">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {benefits.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 text-gray-300 text-xs font-semibold rounded-lg border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={onSubscribe}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            {buttonText}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export default SubscriptionPrompt;
