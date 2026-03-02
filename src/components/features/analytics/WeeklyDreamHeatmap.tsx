import { memo } from "react";
import { motion } from "framer-motion";
import { DailyDreamStat } from "@/store/useHealthStore";
import { SLEEP_SCORE_EMOJIS } from "@/pages/AnalyticsPage/constants";

interface WeeklyDreamHeatmapProps {
  stats: DailyDreamStat[];
  onSelect: (stat: DailyDreamStat) => void;
}

export const WeeklyDreamHeatmap = memo(
  ({ stats, onSelect }: WeeklyDreamHeatmapProps) => (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-80 flex flex-col">
      <h3 className="text-gray-300 font-medium mb-6 text-center">
        Weekly Dream Flow
      </h3>
      <div className="flex-1 grid grid-cols-7 gap-2 items-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            onClick={() => onSelect(stat)}
          >
            <span className="text-xs text-gray-500 mb-1">
              {new Date(stat.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl shadow-lg transition-all duration-300 relative`}
              style={{
                backgroundColor: `rgba(139, 92, 246, ${stat.sleepScore * 0.2})`,
                border: `1px solid rgba(255, 255, 255, ${stat.sleepScore * 0.1})`,
              }}
            >
              {SLEEP_SCORE_EMOJIS[stat.sleepScore - 1] || "❓"}
              {stat.webtoonData && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-[#0F0C29]" />
              )}
            </motion.div>
            <div className="h-1 w-1 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors" />
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-gray-500 mt-4">
        꿈의 선명도와 수면 만족도를 색상 농도로 표현합니다.
      </div>
    </div>
  ),
);

WeeklyDreamHeatmap.displayName = "WeeklyDreamHeatmap";

export default WeeklyDreamHeatmap;
