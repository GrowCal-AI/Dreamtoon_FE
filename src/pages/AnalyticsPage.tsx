import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useHealthStore, DailyDreamStat } from "@/store/useHealthStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDreamStore } from "@/store/useDreamStore";
import {
  Loader2,
  X,
  ChevronRight,
  Image as ImageIcon,
  LogIn,
} from "lucide-react";

import {
  RadialBarChart,
  RadialBar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Moon, Star, Cloud, Zap, Sparkles } from "lucide-react";

// Constants
const EMOTION_LABELS: Record<string, string> = {
  joy: "기쁨",
  anxiety: "불안",
  anger: "분노",
  sadness: "슬픔",
  surprise: "놀람",
  peace: "평온",
};

const SLEEP_SCORE_EMOJIS = ["😫", "🥱", "😐", "🙂", "🥰"];

// Sub-components
const StressIndexCard = ({ score }: { score: number }) => {
  const data = [
    {
      name: "Stress",
      value: score,
      fill: score >= 70 ? "#8B5CF6" : "#2DD4BF", // Purple or Teal
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-gray-300 font-medium mb-2 z-10">Stress Index</h3>
      <div className="h-40 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            barSize={10}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar background dataKey="value" cornerRadius={30 / 2} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 z-10 text-center">
        {score >= 70 ? "높은 스트레스 상태입니다." : "안정적인 상태입니다."}
      </p>
    </div>
  );
};

const SleepQualityCard = ({ score }: { score: number }) => (
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
);

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

const EmotionRadarCard = ({ data }: { data: any[] }) => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-80 relative overflow-hidden">
    <h3 className="text-gray-300 font-medium mb-2 text-center">
      Emotion Balance
    </h3>
    <ResponsiveContainer width="100%" height="90%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#ffffff20" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Emotion"
          dataKey="A"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#colorPv)"
          fillOpacity={0.6}
        />
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            borderColor: "#374151",
            color: "#F3F4F6",
          }}
          itemStyle={{ color: "#F3F4F6" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

const DreamDetailModal = ({
  stat,
  onClose,
}: {
  stat: DailyDreamStat | null;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { dreams } = useDreamStore();
  if (!stat) return null;

  // stat.webtoonData가 없으면 useDreamStore에서 dreamId로 찾기
  const storeDream = stat.dreamId
    ? dreams.find((d) => d.id === stat.dreamId)
    : undefined;
  const webtoonData =
    stat.webtoonData ??
    (storeDream
      ? {
          id: storeDream.id,
          thumbnail:
            storeDream.scenes?.[0]?.imageUrl || storeDream.webtoonUrl || "",
        }
      : undefined);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-2">
            {SLEEP_SCORE_EMOJIS[stat.sleepScore - 1]}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {new Date(stat.date).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </h3>
            <p
              className={`text-sm font-medium ${stat.sleepScore >= 3 ? "text-teal-300" : "text-gray-400"}`}
            >
              {stat.sleepScore >= 3
                ? "꿀잠 주무셨군요! 🌙"
                : "잠을 충분히 못 잤어요 ㅠ"}
            </p>
          </div>

          <div className="w-full bg-white/5 rounded-xl p-4 flex items-center justify-between">
            <div className="text-left">
              <div className="text-xs text-gray-400">수면 만족도</div>
              <div className="text-white font-bold">{stat.sleepScore} / 5</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">대표 감정</div>
              <div className="text-white font-bold capitalize">
                {EMOTION_LABELS[stat.primaryEmotion]}
              </div>
            </div>
          </div>

          {webtoonData ? (
            <div className="w-full space-y-3">
              <div
                className="aspect-video rounded-xl overflow-hidden relative group cursor-pointer"
                onClick={() => navigate(`/webtoon/${webtoonData!.id}`)}
              >
                <img
                  src={webtoonData.thumbnail}
                  alt="Webtoon Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium flex items-center gap-1">
                    보러가기 <ChevronRight size={16} />
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/webtoon/${webtoonData!.id}`)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg shadow-purple-900/20"
              >
                오늘의 꿈 웹툰 보기
              </button>
            </div>
          ) : (
            <div className="w-full py-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
              <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                기록된 꿈 웹툰이 없습니다.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const WeeklyDreamHeatmap = ({
  stats,
  onSelect,
}: {
  stats: DailyDreamStat[];
  onSelect: (stat: DailyDreamStat) => void;
}) => (
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

const getInsight = (stress: number, emotions: any) => {
  const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
    emotions[a] > emotions[b] ? a : b,
  ) as string;
  const stressLevel = stress >= 70 ? "High" : stress >= 40 ? "Mid" : "Low";

  // Logic Mapping Table
  if (stressLevel === "High" && dominantEmotion === "anxiety") {
    return {
      message:
        "현재 마음속에 막연한 **불안감**이 가득 차 있어요. 통제하기 힘든 상황에 대한 압박감이 꿈으로 나타나고 있습니다.",
      action: "자기 전 10분, 걱정 기록하기 (Worry Time)",
      tone: "공감, 위로",
    };
  }
  if (stressLevel === "High" && dominantEmotion === "anger") {
    return {
      message:
        "억눌린 **감정의 폭발**이 감지됩니다. 현실에서 표현하지 못한 답답함이 꿈속에서 표출되고 있어요.",
      action: "안전하게 감정 배출하기 (글쓰기, 운동)",
      tone: "직관, 해소",
    };
  }
  if (stressLevel === "Mid" && dominantEmotion === "sadness") {
    return {
      message:
        "**마음의 감기**가 지나가는 중이에요. 상실감이나 아쉬움이 꿈에 묻어납니다. 스스로를 토닥여줄 시간이 필요해요.",
      action: "따뜻한 카모마일 차 마시기",
      tone: "부드러움, 치유",
    };
  }
  if (stressLevel === "Low" && dominantEmotion === "peace") {
    return {
      message:
        "무의식이 매우 **안정된 상태**입니다. 정서 회복력이 훌륭해요! 지금의 평화로운 리듬을 유지하세요.",
      action: "현재의 감정 상태 일기로 남기기",
      tone: "칭찬, 긍정",
    };
  }
  if (stressLevel === "Low" && dominantEmotion === "joy") {
    return {
      message:
        "**긍정 에너지**가 넘치시네요! 꿈속에서도 활력이 느껴집니다. 이 좋은 기운을 현실에서도 마음껏 펼쳐보세요.",
      action: "새로운 취미나 도전 시작하기",
      tone: "활기, 격려",
    };
  }
  if (dominantEmotion === "surprise") {
    return {
      message:
        "변화에 대한 **긴장감**이 감지됩니다. 낯선 환경이나 새로운 도전을 앞두고 있진 않으신가요?",
      action: "예상되는 상황 미리 시뮬레이션 해보기",
      tone: "호기심",
    };
  }

  // Default (Balanced)
  return {
    message:
      "감정의 **균형이 잘 잡혀** 있습니다. 특별히 치우침 없이 건강한 무의식 흐름을 보이고 있어요.",
    action: "가벼운 산책으로 리프레시하기",
    tone: "차분함",
  };
};

const CoachingSection = ({
  stress,
  emotions,
}: {
  stress: number;
  emotions: any;
}) => {
  const navigate = useNavigate();
  const insight = getInsight(stress, emotions);

  const ConsultButton = () => (
    <button
      onClick={() => navigate("/dream-chat")}
      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-sm font-medium transition-opacity shadow-lg shadow-purple-900/20"
    >
      꿈 내용 상담하기
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 min-h-[200px] flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden"
    >
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500" /> */}

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
        <ConsultButton />
      </div>
    </motion.div>
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
