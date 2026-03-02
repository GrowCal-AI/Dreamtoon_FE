import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X, ImageIcon, ChevronRight } from "lucide-react";
import { DailyDreamStat } from "@/store/useHealthStore";
import { useDreamStore } from "@/store/useDreamStore";
import { EMOTION_LABELS, SLEEP_SCORE_EMOJIS } from "../constants";

interface DreamDetailModalProps {
  stat: DailyDreamStat | null;
  onClose: () => void;
}

export const DreamDetailModal = ({
  stat,
  onClose,
}: DreamDetailModalProps) => {
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

export default DreamDetailModal;
