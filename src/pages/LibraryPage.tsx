import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDreamStore } from "@/store/useDreamStore";
import { useAuthStore } from "@/store/useAuthStore";
import { libraryAPI, dreamAPI } from "@/services/api";
import { DreamEntry, DreamStyle, formatDateShort } from "@/types";
import GenerationResult from "@/components/common/GenerationResult";
import { DreamCard } from "./LibraryPage/components/DreamCard";
import { FilterBar } from "./LibraryPage/components/FilterBar";
import { EmptyState } from "./LibraryPage/components/EmptyState";
import {
  getLocalFavoriteIds,
  styleToGenre,
  mapLibraryItemToDreamEntry,
} from "./LibraryPage/utils";

export default function LibraryPage() {
  const { dreams } = useDreamStore();
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [fullDreamDetail, setFullDreamDetail] = useState<DreamEntry | null>(
    null,
  );
  const [libraryDreams, setLibraryDreams] = useState<DreamEntry[]>([]);
  const [filterStyle, setFilterStyle] = useState<DreamStyle | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [localFavIds, setLocalFavIds] = useState<string[]>(getLocalFavoriteIds);

  // BE에서 라이브러리 목록 가져오기
  useEffect(() => {
    if (!isLoggedIn) {
      setLibraryDreams([]);
      return;
    }
    const fetchLibrary = async () => {
      try {
        const params: Record<string, unknown> = {};
        if (filterStyle !== "all") params.genre = styleToGenre(filterStyle);
        const result = await libraryAPI.getLibrary(params as any);
        const raw =
          result?.dreams ??
          result?.content ??
          (Array.isArray(result) ? result : []);
        const list = Array.isArray(raw) ? raw : [];
        const mapped = list.map((item: Record<string, unknown>) =>
          mapLibraryItemToDreamEntry(item),
        );
        setLibraryDreams(mapped);
      } catch {
        setLibraryDreams(dreams);
      }
    };
    fetchLibrary();
  }, [isLoggedIn, dreams, filterStyle]);

  const filteredDreams = useMemo(() => {
    let result = libraryDreams.map((d) => ({
      ...d,
      isFavorite: d.isFavorite || localFavIds.includes(d.id),
    }));
    if (filterStyle !== "all") {
      result = result.filter((dream) => dream.style === filterStyle);
    }
    if (showFavorites) {
      result = result.filter((dream) => dream.isFavorite);
    }
    result.sort(
      (a, b) =>
        new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
    );
    return result;
  }, [libraryDreams, filterStyle, showFavorites, localFavIds]);

  useEffect(() => {
    if (selectedDream) {
      document.body.style.overflow = "hidden";
    } else {
      setLocalFavIds(getLocalFavoriteIds());
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedDream]);

  // 카드 클릭 시 상세 조회
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

  // 로그인 체크 제거 - 비로그인 사용자도 자유롭게 접근 가능
  // 비로그인 시 빈 목록 표시

  return (
    <div className="min-h-full pt-20 pb-24 px-5 xl:pt-28 xl:px-8 relative overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-4 md:mb-8 md:text-center px-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[#ffffff] drop-shadow-sm mb-2 tracking-tight">
            {t('library.title')}
          </h1>
          <p className="text-gray-400 text-sm">
            {t('library.emptyDescription')}
          </p>
        </motion.div>

        {/* Filters */}
        <FilterBar
          filterStyle={filterStyle}
          showFavorites={showFavorites}
          onFilterStyleChange={setFilterStyle}
          onShowFavoritesChange={setShowFavorites}
        />

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
          <EmptyState />
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
                dreamId={fullDreamDetail.id}
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
