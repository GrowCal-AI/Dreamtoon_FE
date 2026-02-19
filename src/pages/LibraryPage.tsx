import { useState, useMemo, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Calendar } from "lucide-react";
import { useDreamStore } from "@/store/useDreamStore";
import { libraryAPI } from "@/services/api";
import { DreamEntry, DreamStyle, formatDateShort } from "@/types";
import GenerationResult from "@/components/common/GenerationResult";

// Memoized Dream Card
const DreamCard = memo(
  ({ dream, onClick }: { dream: DreamEntry; onClick: () => void }) => {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="glass-card overflow-hidden cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-[#2D2A4A] to-[#1A1638] relative overflow-hidden">
          {dream.webtoonUrl ||
          (dream.scenes &&
            dream.scenes.length > 0 &&
            dream.scenes[0].imageUrl) ? (
            <img
              src={dream.webtoonUrl || dream.scenes[0].imageUrl}
              alt={dream.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : null}

          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

          <div className="absolute inset-0 flex items-center justify-center text-white p-4">
            <div className="text-center">
              <div className="text-lg font-semibold drop-shadow-md">
                {dream.title}
              </div>
            </div>
          </div>
          {dream.isFavorite && (
            <div className="absolute top-3 right-3 z-10">
              <Heart className="w-6 h-6 fill-red-500 text-red-500 drop-shadow-md" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDateShort(dream.recordedAt)}
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
              {dream.style}
            </span>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{dream.content}</p>
          {dream.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {dream.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

DreamCard.displayName = "DreamCard";

export default function LibraryPage() {
  const { dreams } = useDreamStore();
  const navigate = useNavigate();
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [libraryDreams, setLibraryDreams] = useState<DreamEntry[]>([]);

  // BE에서 라이브러리 목록 가져오기
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const result = await libraryAPI.getLibrary();
        const all = result.content || (result as unknown as DreamEntry[]);
        setLibraryDreams(all);
      } catch {
        // 미로그인 시 로컬 스토어 사용
        setLibraryDreams(dreams);
      }
    };
    fetchLibrary();
  }, [dreams]);

  const [filterStyle, setFilterStyle] = useState<DreamStyle | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filtered dreams (useMemo)
  const filteredDreams = useMemo(() => {
    let result = [...libraryDreams];

    // Style filter
    if (filterStyle !== "all") {
      result = result.filter((dream) => dream.style === filterStyle);
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter((dream) => dream.isFavorite);
    }

    // Sort by Date (Default)
    result.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

    return result;
  }, [dreams, filterStyle, showFavorites]);

  // Body scroll lock
  useEffect(() => {
    if (selectedDream) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDream]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isDropdownOpen && !target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="min-h-full pt-20 pb-24 px-5 xl:pt-28 xl:px-8 relative overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        {/* ... (existing content) */}
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-4 md:mb-8 md:text-center px-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#ffffff] drop-shadow-sm mb-2 tracking-tight">
            꿈 라이브러리
          </h1>
          <p className="text-gray-400 text-sm">
            당신이 기록한 모든 꿈을 한눈에 확인하세요
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-end gap-3 mb-8 px-1"
        >
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showFavorites
                ? "bg-red-500/20 text-red-400 border border-red-500/50"
                : "glass-card text-gray-400 hover:bg-white/10"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`}
            />
            즐겨찾기
          </button>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-40 pl-4 pr-4 py-2 rounded-lg font-medium transition-all cursor-pointer outline-none flex items-center justify-between ${
                filterStyle !== "all"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                  : "glass-card text-gray-400 hover:bg-white/10"
              }`}
            >
              <span>
                {filterStyle === "all"
                  ? "모든 스타일"
                  : filterStyle === "romance"
                    ? "로맨스"
                    : filterStyle === "school"
                      ? "학원물"
                      : filterStyle === "dark-fantasy"
                        ? "다크 판타지"
                        : filterStyle === "healing"
                          ? "힐링"
                          : filterStyle === "comedy"
                            ? "코미디"
                            : "호러"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                } ${
                  filterStyle !== "all" ? "text-purple-300" : "text-white/60"
                }`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-40 glass-card rounded-lg overflow-hidden z-20 shadow-xl"
                >
                  {[
                    { value: "all", label: "모든 스타일" },
                    { value: "romance", label: "로맨스" },
                    { value: "school", label: "학원물" },
                    { value: "dark-fantasy", label: "다크 판타지" },
                    { value: "healing", label: "힐링" },
                    { value: "comedy", label: "코미디" },
                    { value: "horror", label: "호러" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterStyle(option.value as DreamStyle | "all");
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left transition-colors ${
                        filterStyle === option.value
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        {/* Dream Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-gray-400"
        >
          총 {filteredDreams.length}개의 꿈
        </motion.div>

        {/* Dream Grid */}
        {filteredDreams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <div className="text-gray-500 mb-4">
              <p className="text-lg">기록된 꿈이 없습니다</p>
              <p className="text-sm mt-2">새로운 꿈을 기록해보세요!</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredDreams.map((dream) => (
                <DreamCard
                  key={dream.id}
                  dream={dream}
                  onClick={() => setSelectedDream(dream)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Full Screen Generation Result Modal */}
      <AnimatePresence>
        {selectedDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F0C29] overflow-y-auto max-h-screen"
          >
            <GenerationResult
              title={selectedDream.title}
              date={formatDateShort(selectedDream.recordedAt)}
              mediaUrl={
                selectedDream.webtoonUrl || selectedDream.videoUrl || ""
              }
              type={selectedDream.format}
              isSaved={true}
              onSave={() => {}}
              onReset={() => navigate("/")}
              onTalkMore={() => alert("꿈 대화하기 기능은 준비 중입니다.")}
              onClose={() => setSelectedDream(null)}
              initialFavorite={selectedDream.isFavorite}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
