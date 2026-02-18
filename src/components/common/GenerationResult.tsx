import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Sparkles,
  RotateCcw,
  MessageCircle,
  Heart,
  Share2,
  Download,
  X,
  Copy,
  Check,
} from "lucide-react";
import Header from "@/components/common/Header";

interface GenerationResultProps {
  title: string;
  date: string;
  mediaUrl: string;
  type: "webtoon" | "animation";
  isSaved: boolean;
  onSave?: () => void;
  onReset?: () => void;
  onTalkMore?: () => void;
  onClose?: () => void;
  initialFavorite?: boolean;
}

const GenerationResult = ({
  title,
  date,
  mediaUrl,
  type,
  isSaved,
  onSave,
  onReset,
  onTalkMore,
  onClose,
  initialFavorite = false,
}: GenerationResultProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = `dream-${type}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden text-white fixed inset-0">
      {/* Background Gradient (Black Violet) */}
      <div className="fixed inset-0 z-[-2] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#020005] via-[#0B0118] to-[#0F0C29]" />

      {/* 0. Global Header (fixed top-0, z-50) */}
      <Header />

      {/* 1. Top Info Bar Section (fixed top-16, z-40) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-16 left-0 right-0 z-40 bg-dream-night/80 backdrop-blur-md border-b border-white/5"
      >
        <div className="max-w-[1200px] mx-auto px-5 xl:px-8 py-4 flex items-center justify-between">
          {/* Left Content */}
          <div className="flex flex-col gap-1 items-start text-left">
            <span className="text-xs text-purple-400 font-medium">
              오늘의 꿈 웹툰 완성!
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">
              {title}
            </h2>
            <span className="text-xs text-gray-400">{date}</span>
          </div>

          {/* Right Content - Save Button or Close Button */}
          <div className="flex items-center gap-3">
            {onSave &&
              (!isSaved ? (
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-purple-400/50 transition-all text-sm font-semibold text-white group"
                >
                  <Save
                    size={16}
                    className="text-gray-400 group-hover:text-purple-400 transition-colors"
                  />
                  라이브러리에 저장
                </button>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-bold">
                  <Sparkles size={16} />
                  저장 완료
                </div>
              ))}

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Main Content Area (Full Screen Image/Video) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden pt-44 pb-32"
      >
        <div
          className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative ${type === "webtoon" ? "h-[60vh]" : "aspect-[3/4]"}`}
        >
          {type === "webtoon" ? (
            <img
              src={mediaUrl}
              alt="Dream Webtoon"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <video
                src={mediaUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Action Buttons (Favorite, Share, Download) */}
        <div className="flex justify-center gap-6 py-2 mt-4">
          <button
            onClick={handleFavorite}
            className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div
              className={`p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all ${
                isFavorite
                  ? "text-pink-500 border-pink-500/50 bg-pink-500/10"
                  : ""
              }`}
            >
              <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
            </div>
          </button>

          <button
            onClick={handleShare}
            className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all">
              <Share2 size={24} />
            </div>
          </button>

          <button
            onClick={handleDownload}
            className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all">
              <Download size={24} />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsShareOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl opacity-50" />

              <button
                onClick={() => setIsShareOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  꿈 공유하기
                </h2>
                <p className="text-gray-300 text-sm mb-8">
                  신비로운 무의식의 이야기를
                  <br />
                  친구들에게 들려주세요.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#FAE100] text-[#371D1E] font-medium hover:opacity-90 transition-opacity border border-transparent">
                    <MessageCircle size={24} className="mb-2" />
                    카카오톡
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    {shareCopied ? (
                      <Check size={24} className="mb-2 text-green-400" />
                    ) : (
                      <Copy size={24} className="mb-2" />
                    )}
                    {shareCopied ? "복사됨" : "링크 복사"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Bottom Fixed CTA Section */}
      {(onReset || onTalkMore) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0C29]/90 backdrop-blur-md border-t border-white/10 pb-8 pt-4 px-6"
        >
          <div className="max-w-md mx-auto flex gap-3">
            {onReset && (
              <button
                onClick={onReset}
                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                새로운 채팅
              </button>
            )}
            {onTalkMore && (
              <button
                onClick={onTalkMore}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-900/40 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />꿈 더 대화하기
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerationResult;
