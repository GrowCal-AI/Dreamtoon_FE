import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap } from "lucide-react";
import { getInsight } from "@/pages/AnalyticsPage/utils";

interface CoachingSectionProps {
  stress: number;
  emotions: any;
}

export const CoachingSection = memo(
  ({ stress, emotions }: CoachingSectionProps) => {
    const navigate = useNavigate();
    const insight = getInsight(stress, emotions);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 min-h-[200px] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden"
      >
        <div className="bg-white/10 p-3 rounded-full mb-2">
          <Sparkles className="w-8 h-8 text-yellow-300" />
        </div>

        <h3 className="text-2xl font-bold text-white leading-relaxed max-w-2xl">
          {insight.message.split(/\*\*(.*?)\*\*/g).map((part, i) =>
            i % 2 === 1 ? (
              <span key={i} className="text-purple-300">
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </h3>

        <div className="bg-white/5 rounded-xl px-6 py-4 flex items-center gap-3 border border-white/10">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="text-gray-200 text-sm font-medium">
            추천 액션: {insight.action}
          </span>
        </div>

        <div className="pt-4 flex gap-3 w-full max-w-md">
          <button
            onClick={() => navigate("/dream-chat")}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-sm font-medium transition-opacity shadow-lg shadow-purple-900/20"
          >
            꿈 내용 상담하기
          </button>
        </div>
      </motion.div>
    );
  },
);

CoachingSection.displayName = "CoachingSection";

export default CoachingSection;
