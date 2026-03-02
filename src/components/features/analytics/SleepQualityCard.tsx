import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Moon, Cloud } from "lucide-react";

interface SleepQualityCardProps {
  score: number;
}

export const SleepQualityCard = memo(({ score }: SleepQualityCardProps) => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <h3 className="text-gray-300 font-medium mb-4 z-10">Sleep Quality</h3>
    <div className="relative z-10">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {score >= 80 ? (
          <Star className="w-16 h-16 text-yellow-300 fill-yellow-300/20" />
        ) : score >= 50 ? (
          <Moon className="w-16 h-16 text-purple-300 fill-purple-300/20" />
        ) : (
          <Cloud className="w-16 h-16 text-gray-400 fill-gray-400/20" />
        )}
      </motion.div>
    </div>
    <div className="mt-4 text-center z-10">
      <span className="text-3xl font-bold text-white">{score}</span>
      <span className="text-sm text-gray-400 ml-1">점</span>
    </div>
    <p className="text-xs text-gray-400 mt-2 z-10">
      {score >= 70 ? "꿀잠 주무셨네요! 🌙" : "수면의 질 개선이 필요해요."}
    </p>
  </div>
));

SleepQualityCard.displayName = "SleepQualityCard";

export default SleepQualityCard;
