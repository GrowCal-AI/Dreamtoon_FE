import { motion } from "framer-motion";
import { memo } from "react";

interface StyleCardProps {
  style: string;
  label: string;
  desc: string;
  onClick: () => void;
  selected: boolean;
  isPremium?: boolean;
}

export const StyleCard = memo(({
  label,
  desc,
  onClick,
  selected,
  isPremium = false,
}: StyleCardProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative p-4 rounded-xl text-left transition-all border overflow-hidden glass-card ${
      selected
        ? "border-purple-500 bg-purple-500/20 shadow-glow"
        : "border-white/10 hover:border-purple-400/50"
    }`}
  >
    {isPremium && (
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg shadow-sm z-10">
        PRO
      </div>
    )}
    <div className="font-bold text-white flex items-center gap-1">{label}</div>
    <div className="text-xs text-gray-400">{desc}</div>
  </motion.button>
));

StyleCard.displayName = "StyleCard";

export default StyleCard;
