import { DreamEntry, DreamStyle } from "@/types";
import { GENRE_TO_STYLE, FAVORITES_KEY } from "./constants";

export const getLocalFavoriteIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
};

/** FE DreamStyle → BE Genre (UPPERCASE) 변환 */
export const styleToGenre = (style: DreamStyle | "all"): string | undefined => {
  if (style === "all") return undefined;
  const entry = Object.entries(GENRE_TO_STYLE).find(([, v]) => v === style);
  return entry?.[0]; // e.g. "HEALING"
};

/** BE 라이브러리 API 응답 항목(dreamId, thumbnailUrl 등)을 DreamEntry 형태로 변환 */
export function mapLibraryItemToDreamEntry(
  item: Record<string, unknown>,
): DreamEntry {
  const id = String(item.dreamId ?? item.id ?? "");
  const recordedAt = String(
    item.recordedAt ?? item.createdAt ?? new Date().toISOString(),
  );
  const createdAt = String(
    item.createdAt ?? item.recordedAt ?? new Date().toISOString(),
  );
  const rawGenre = String(
    item.selectedGenre ?? item.genre ?? item.style ?? "HEALING",
  );
  const style =
    GENRE_TO_STYLE[rawGenre] ??
    (rawGenre.toLowerCase().replace(/_/g, "-") as DreamStyle);

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
    scenes: Array.isArray(item.scenes)
      ? (item.scenes as DreamEntry["scenes"])
      : [],
    analysis: (item.analysis as DreamEntry["analysis"]) ?? {
      emotions: {} as DreamEntry["analysis"]["emotions"],
      tensionLevel: 0,
      controlLevel: 0,
      isNightmare: false,
      repeatingSymbols: [],
      relationshipPatterns: [],
      hasResolution: false,
    },
    webtoonUrl: item.webtoonUrl
      ? String(item.webtoonUrl)
      : item.thumbnailUrl
        ? String(item.thumbnailUrl)
        : undefined,
    videoUrl: item.videoUrl ? String(item.videoUrl) : undefined,
    tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
    genreName: item.genreName ? String(item.genreName) : undefined,
    isFavorite: Boolean(item.isFavorite),
    isInLibrary: true,
  };
}
