import { DreamStyle } from "@/types";

export const FAVORITES_KEY = "dreamics_favorites";

/** BE genre 키(UPPERCASE) → FE DreamStyle(lowercase) 변환 */
export const GENRE_TO_STYLE: Record<string, DreamStyle> = {
  CUSTOM: "custom",
  ROMANCE: "romance",
  SCHOOL: "school",
  DARK_FANTASY: "dark-fantasy",
  HEALING: "healing",
  COMEDY: "comedy",
  HORROR: "horror",
  PIXAR: "pixar",
  GHIBLI: "ghibli",
  CYBERPUNK: "cyberpunk",
  CINEMATIC: "cinematic",
  VINTAGE: "vintage",
  MARVEL: "marvel",
  LEGO: "lego",
  ANIMAL_CROSSING: "animal-crossing",
};

/** FE DreamStyle → 한글 라벨 */
export const STYLE_LABELS: Record<string, string> = {
  custom: "맞춤형",
  romance: "로맨스",
  school: "학원물",
  "dark-fantasy": "다크 판타지",
  healing: "힐링",
  comedy: "코미디",
  horror: "호러",
  pixar: "픽사",
  ghibli: "지브리",
  cyberpunk: "사이버펑크",
  cinematic: "시네마틱",
  vintage: "빈티지",
  marvel: "마블",
  lego: "레고",
  "animal-crossing": "모동숲",
};

export const STYLE_FILTER_OPTIONS = [
  { value: "all", label: "모든 스타일" },
  { value: "custom", label: "맞춤형" },
  { value: "ghibli", label: "지브리" },
  { value: "marvel", label: "마블" },
  { value: "lego", label: "레고" },
  { value: "animal-crossing", label: "모동숲" },
] as const;
