import { useState, useMemo, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Heart, Calendar, LogIn, Loader2 } from "lucide-react";
import { useDreamStore } from "@/store/useDreamStore";
import { useAuthStore } from "@/store/useAuthStore";
import { libraryAPI, dreamAPI } from "@/services/api";
import { DreamEntry, DreamStyle, formatDateShort } from "@/types";
import GenerationResult from "@/components/common/GenerationResult";

/** BE genre 키(UPPERCASE) → FE DreamStyle(lowercase) 변환 */
const GENRE_TO_STYLE: Record<string, DreamStyle> = {
  CUSTOM: "custom", ROMANCE: "romance", SCHOOL: "school",
  DARK_FANTASY: "dark-fantasy", HEALING: "healing", COMEDY: "comedy",
  HORROR: "horror", PIXAR: "pixar", GHIBLI: "ghibli", CYBERPUNK: "cyberpunk",
  CINEMATIC: "cinematic", VINTAGE: "vintage", MARVEL: "marvel",
  LEGO: "lego", ANIMAL_CROSSING: "animal-crossing",
};

/** FE DreamStyle → 한글 라벨 */
const STYLE_LABELS: Record<string, string> = {
  custom: "맞춤형", romance: "로맨스", school: "학원물",
  "dark-fantasy": "다크 판타지", healing: "힐링", comedy: "코미디",
  horror: "호러", pixar: "픽사", ghibli: "지브리", cyberpunk: "사이버펑크",
  cinematic: "시네마틱", vintage: "빈티지", marvel: "마블",
  lego: "레고", "animal-crossing": "모동숲",
};

/** BE 라이브러리 API 응답 항목(dreamId, thumbnailUrl 등)을 DreamEntry 형태로 변환 */
function mapLibraryItemToDreamEntry(item: Record<string, unknown>): DreamEntry {
  const id = String(item.dreamId ?? item.id ?? "");
  const recordedAt = String(item.recordedAt ?? item.createdAt ?? new Date().toISOString());
  const createdAt = String(item.createdAt ?? item.recordedAt ?? new Date().toISOString());
  const rawGenre = String(item.selectedGenre ?? item.genre ?? item.style ?? "HEALING");
  const style = GENRE_TO_STYLE[rawGenre] ?? rawGenre.toLowerCase().replace(/_/g, "-") as DreamStyle;
  return {
    id,
    userId: String(item.userId ?? ""),
    title: String(item.title ?? "제목 없음"),
    content: String(item.content ?? ""),
    recordedAt,
    createdAt,
    inputMethod: "text",
    style,
    format: "webtoon",
    scenes: Array.isArray(item.scenes) ? (item.scenes as DreamEntry["scenes"]) : [],
    analysis: (item.analysis as DreamEntry["analysis"]) ?? {
      emotions: {} as DreamEntry["analysis"]["emotions"],
      tensionLevel: 0,
      controlLevel: 0,
      isNightmare: false,
      repeatingSymbols: [],
      relationshipPatterns: [],
      hasResolution: false,
    },
    webtoonUrl: item.webtoonUrl ? String(item.webtoonUrl) : item.thumbnailUrl ? String(item.thumbnailUrl) : undefined,
    videoUrl: item.videoUrl ? String(item.videoUrl) : undefined,
    tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
    isFavorite: Boolean(item.isFavorite),
    isInLibrary: true,
  };
}

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
              {STYLE_LABELS[dream.style] ?? dream.style}
            </span>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{dream.content || "꿈 기록"}</p>
          {(dream.tags?.length ?? 0) > 0 && (
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
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [fullDreamDetail, setFullDreamDetail] = useState<DreamEntry | null>(null);
  const [libraryDreams, setLibraryDreams] = useState<DreamEntry[]>([]);
  const [filterStyle, setFilterStyle] = useState<DreamStyle | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /** FE DreamStyle → BE Genre (UPPERCASE) 변환 */
  const styleToGenre = (style: DreamStyle | "all"): string | undefined => {
    if (style === "all") return undefined;
    const entry = Object.entries(GENRE_TO_STYLE).find(([, v]) => v === style);
    return entry?.[0]; // e.g. "HEALING"
  };

  // BE에서 라이브러리 목록 가져오기 (로그인 시에만, 필터 변경 시 재호출)
  useEffect(() => {
    if (!isLoggedIn) {
      setLibraryDreams([]);
      return;
    }
    const fetchLibrary = async () => {
      try {
        const params: Record<string, unknown> = {};
        if (filterStyle !== "all") params.genre = styleToGenre(filterStyle);
        if (showFavorites) params.favorite = true;
        const result = await libraryAPI.getLibrary(params as any);
        const raw = result?.dreams ?? result?.content ?? (Array.isArray(result) ? result : []);
        const list = Array.isArray(raw) ? raw : [];
        const mapped = list.map((item: Record<string, unknown>) => mapLibraryItemToDreamEntry(item));
        setLibraryDreams(mapped);
      } catch {
        setLibraryDreams(dreams);
      }
    };
    fetchLibrary();
  }, [isLoggedIn, dreams, filterStyle, showFavorites]);

  const filteredDreams = useMemo(() => {
    let result = [...libraryDreams];
    if (filterStyle !== "all") {
      result = result.filter((dream) => dream.style === filterStyle);
    }
    if (showFavorites) {
      result = result.filter((dream) => dream.isFavorite);
    }
    result.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return result;
  }, [libraryDreams, filterStyle, showFavorites]);

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

  // 카드 클릭 시 상세 조회(4컷 scenes 포함) 후 모달 표시
  useEffect(() => {
    if (!selectedDream) {
      setFullDreamDetail(null);
      return;
    }
    let cancelled = false;
    dreamAPI
      .getDream(selectedDream.id)
      .then((full) => {
        if (!cancelled) setFullDreamDetail(full);
      })
      .catch(() => {
        if (!cancelled) setFullDreamDetail(selectedDream);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDream]);

  // 미로그인 시 로그인 유도 화면
  if (!isLoggedIn) {
    return (
      <div className="min-h-full pt-20 pb-24 px-5 flex flex-col items-center justify-center bg-[#0F0C29]">
        <div className="text-center max-w-sm space-y-6">
          <p className="text-gray-400 text-lg">로그인이 필요합니다.</p>
          <p className="text-gray-500 text-sm">로그인 후 나만의 꿈 라이브러리를 이용할 수 있어요.</p>
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
                {filterStyle === "all" ? "모든 스타일" : STYLE_LABELS[filterStyle] ?? filterStyle}
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
                    { value: "custom", label: "맞춤형" },
                    { value: "romance", label: "로맨스" },
                    { value: "school", label: "학원물" },
                    { value: "dark-fantasy", label: "다크 판타지" },
                    { value: "healing", label: "힐링" },
                    { value: "comedy", label: "코미디" },
                    { value: "horror", label: "호러" },
                    { value: "ghibli", label: "지브리" },
                    { value: "marvel", label: "마블" },
                    { value: "lego", label: "레고" },
                    { value: "animal-crossing", label: "모동숲" },
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
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center min-h-[200px] flex flex-col items-center justify-center"
          >
            <p className="text-lg font-medium text-gray-300">기록된 꿈이 없습니다</p>
            <p className="text-sm text-gray-500 mt-2">웹툰 결과에서 &#39;라이브러리에 저장&#39;을 누르면 여기에 쌓여요.</p>
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

      {/* Full Screen Generation Result Modal (4컷은 상세 조회 후 scenes로 표시) */}
      <AnimatePresence>
        {selectedDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0F0C29] overflow-y-auto max-h-screen"
          >
            {fullDreamDetail ? (
              <GenerationResult
                title={fullDreamDetail.title}
                date={formatDateShort(fullDreamDetail.recordedAt)}
                mediaUrl={
                  fullDreamDetail.webtoonUrl || fullDreamDetail.videoUrl || ""
                }
                type={fullDreamDetail.format}
                isSaved={true}
                scenes={fullDreamDetail.scenes}
                onSave={() => {}}
                onReset={() => navigate("/")}
                onTalkMore={() => {
                  setSelectedDream(null);
                  setFullDreamDetail(null);
                  navigate("/dream-chat", {
                    state: {
                      dreamId: fullDreamDetail.id,
                      dreamTitle: fullDreamDetail.title,
                    },
                  });
                }}
                onClose={() => {
                  setSelectedDream(null);
                  setFullDreamDetail(null);
                }}
                initialFavorite={fullDreamDetail.isFavorite}
              />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
