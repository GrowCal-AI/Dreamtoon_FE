/**
 * 사용자 생성 콘텐츠(UGC) 필터링 유틸리티
 * Google AdSense 정책 준수 및 유해 콘텐츠 방지를 위한 클라이언트 사이드 1차 필터
 *
 * ⚠️ 주의: 이 필터는 1차 방어선입니다. 서버 사이드 검증도 함께 운영해야 합니다.
 */

// 성인/유해 콘텐츠 키워드 패턴 (한국어 + 영어)
const ADULT_PATTERNS: RegExp[] = [
  /\b포르노\b/i,
  /\b야동\b/i,
  /\b음란\b/i,
  /\bporn(ography)?\b/i,
  /\bxxx\b/i,
  /\bnude\b/i,
  /\bsex(ual)?\b/i,
  /\b성인물\b/i,
  /\b야설\b/i,
];

// 혐오/차별 키워드 패턴
const HATE_SPEECH_PATTERNS: RegExp[] = [
  /\b혐오\s*발언\b/i,
  /\b인종차별\b/i,
  /\b hate\s*speech\b/i,
];

// 폭력적 콘텐츠 키워드 패턴
const VIOLENCE_PATTERNS: RegExp[] = [
  /\b자살\s*방법\b/i,
  /\b살인\s*방법\b/i,
  /\bhow\s*to\s*kill\b/i,
  /\bsuicide\s*method\b/i,
];

export interface FilterResult {
  isClean: boolean;
  flaggedCategory: "adult" | "hate" | "violence" | null;
  message: string;
}

/**
 * 텍스트 콘텐츠를 검사하여 유해 콘텐츠 여부를 반환합니다
 */
export function filterContent(text: string): FilterResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true, flaggedCategory: null, message: "" };
  }

  for (const pattern of ADULT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isClean: false,
        flaggedCategory: "adult",
        message: "성인 콘텐츠가 포함된 것으로 감지되었습니다. 꿈 내용을 수정해주세요.",
      };
    }
  }

  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isClean: false,
        flaggedCategory: "hate",
        message: "혐오 또는 차별적 표현이 포함된 것으로 감지되었습니다. 꿈 내용을 수정해주세요.",
      };
    }
  }

  for (const pattern of VIOLENCE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isClean: false,
        flaggedCategory: "violence",
        message: "유해한 폭력적 표현이 포함된 것으로 감지되었습니다. 꿈 내용을 수정해주세요.",
      };
    }
  }

  return { isClean: true, flaggedCategory: null, message: "" };
}

/**
 * 텍스트가 최소 품질 기준을 충족하는지 확인합니다 (AdSense 박한 콘텐츠 방지)
 */
export function validateContentQuality(text: string): { isValid: boolean; message: string } {
  const trimmed = text.trim();

  if (trimmed.length < 10) {
    return { isValid: false, message: "꿈 내용을 10자 이상 입력해주세요." };
  }

  if (trimmed.length > 5000) {
    return { isValid: false, message: "꿈 내용은 5,000자 이내로 입력해주세요." };
  }

  return { isValid: true, message: "" };
}
