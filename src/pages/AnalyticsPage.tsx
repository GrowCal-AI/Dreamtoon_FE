import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHealthStore, DailyDreamStat } from "@/store/useHealthStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, LogIn } from "lucide-react";
import {
  StressIndexCard,
  SleepQualityCard,
  EmotionRadarCard,
  WeeklyDreamHeatmap,
  CoachingSection,
} from "@/components/features/analytics";
import { DreamDetailModal } from "./AnalyticsPage/components/DreamDetailModal";
import { EMOTION_LABELS } from "./AnalyticsPage/constants";

const SummarySection = ({
  stress,
  sleep,
}: {
  stress: number;
  sleep: number;
}) => (
  <div className="grid grid-cols-2 gap-4 mb-8">
    <StressIndexCard score={stress} />
    <SleepQualityCard score={sleep} />
  </div>
);

const DetailAnalysisSection = ({
  emotions,
  weekly,
  onSelectDate,
}: {
  emotions: any;
  weekly: DailyDreamStat[];
  onSelectDate: (stat: DailyDreamStat) => void;
}) => {
  // Transform emotion object to array for RadarChart
  const radarData = Object.keys(emotions).map((key) => ({
    subject: EMOTION_LABELS[key] || key,
    A: emotions[key],
    fullMark: 100,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <EmotionRadarCard data={radarData} />
      <WeeklyDreamHeatmap stats={weekly} onSelect={onSelectDate} />
    </div>
  );
};

export default function AnalyticsPage() {
  const { isLoggedIn } = useAuthStore();
  const { fetchAnalysis, isLoading, analysis, fetchError } = useHealthStore();
  const navigate = useNavigate();
  const [selectedStat, setSelectedStat] = useState<DailyDreamStat | null>(null);

  useEffect(() => {
    if (isLoggedIn) fetchAnalysis("current-user");
  }, [isLoggedIn, fetchAnalysis]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-full pt-20 pb-24 px-5 flex flex-col items-center justify-center bg-[#0F0C29]">
        <div className="text-center max-w-sm space-y-6">
          <p className="text-gray-400 text-lg">로그인이 필요합니다.</p>
          <p className="text-gray-500 text-sm">
            로그인 후 꿈 분석을 이용할 수 있어요.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-5 h-5" />
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !analysis) {
    return (
      <div className="min-h-full flex items-center justify-center bg-[#0F0C29]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-full pt-20 pb-24 px-5 flex flex-col items-center justify-center bg-[#0F0C29]">
        <p className="text-gray-400 mb-4">{fetchError}</p>
        <button
          type="button"
          onClick={() => fetchAnalysis("current-user")}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#0F0C29] text-white flex flex-col pt-20 pb-32 px-5 xl:pt-28 xl:px-8 overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-8 text-left md:text-center px-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#ffffff] drop-shadow-sm mb-2 tracking-tight">
            Dream Health Analysis
          </h1>
          <p className="text-gray-400 text-sm">
            당신의 무의식이 보내는 신호를 해석해드립니다.
          </p>
        </motion.header>

        {/* Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {analysis && (
            <>
              <SummarySection
                stress={analysis.stressIndex}
                sleep={analysis.sleepQuality}
              />
              <DetailAnalysisSection
                emotions={analysis.emotionDistribution}
                weekly={analysis.weeklyStats}
                onSelectDate={setSelectedStat}
              />
              <CoachingSection
                stress={analysis.stressIndex}
                emotions={analysis.emotionDistribution}
              />
            </>
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedStat && (
            <DreamDetailModal
              stat={selectedStat}
              onClose={() => setSelectedStat(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
