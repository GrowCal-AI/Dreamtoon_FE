import { motion } from "framer-motion";
import { EmotionType } from "@/types";
import { memo } from "react";

interface EmotionChipProps {
  emotion: EmotionType;
  label: string;
  emoji: string;
  onClick: () => void;
}

export const EmotionChip = memo(({
  label,
  emoji,
  onClick,
}: EmotionChipProps) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-full glass-card hover:bg-white/10 transition-all w-24 h-24"
  >
    <span className="text-3xl mb-1">{emoji}</span>
    <span className="text-xs font-medium text-gray-200">{label}</span>
  </motion.button>
));

EmotionChip.displayName = "EmotionChip";

export default EmotionChip;
