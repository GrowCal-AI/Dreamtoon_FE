// 꿈 감정 타입
export type EmotionType = 'joy' | 'anxiety' | 'anger' | 'sadness' | 'surprise' | 'peace'

// 꿈 스타일 프리셋
export type DreamStyle = 'custom' | 'romance' | 'school' | 'dark-fantasy' | 'healing' | 'comedy' | 'horror' | 'pixar' | 'ghibli' | 'cyberpunk' | 'cinematic' | 'vintage' | 'marvel' | 'lego' | 'animal-crossing'

// 꿈 장면 컷
export interface DreamScene {
  id: string
  sceneNumber: number
  description: string
  characters: string[]
  emotion: EmotionType
  backgroundKeywords: string[]
  imageUrl?: string
  narration?: string
  dialogue?: Array<{
    character: string
    text: string
  }>
}

// 꿈 분석 데이터
export interface DreamAnalysis {
  emotions: Record<EmotionType, number>
  tensionLevel: number
  controlLevel: number
  isNightmare: boolean
  repeatingSymbols: string[]
  relationshipPatterns: string[]
  hasResolution: boolean
}

// 꿈 헬스 지수
export interface DreamHealthIndex {
  stressLevel: number
  anxietyLevel: number
  emotionalResilience: number
  relationshipStress: number
  sleepQuality: number
  nightmareRatio: number
  lastUpdated: Date
}

// 꿈 엔트리 (BE DreamResponse와 매핑)
export interface DreamEntry {
  id: string
  userId: string
  title: string
  content: string
  recordedAt: string  // BE에서 ISO string으로 옴
  createdAt: string   // BE에서 ISO string으로 옴
  inputMethod: 'text' | 'voice'
  style: DreamStyle
  format: 'webtoon' | 'animation'
  scenes: DreamScene[]
  analysis: DreamAnalysis
  webtoonUrl?: string
  videoUrl?: string
  tags: string[]
  genreName?: string
  isFavorite: boolean
  isInLibrary?: boolean
  processingStatus?: string
  errorMessage?: string
}

// 구독 티어
export type SubscriptionTier = 'free' | 'plus' | 'pro' | 'ultra'

// 사용량 정보 (BE /subscriptions/usage 응답)
export interface UsageInfo {
  tier: 'FREE' | 'PLUS' | 'PRO' | 'ULTRA'
  isActive: boolean
  standardGenerationCount: number
  maxStandardGenerations: number
  premiumGenerationCount: number
  maxPremiumGenerations: number
  premiumTrialUsed: boolean
  libraryCount: number
  maxLibrary: number
  favoriteCount: number
  maxFavorites: number
  quotaResetDate: string
  canGenerateStandard: boolean
  canGeneratePremium: boolean
  canAddToLibrary: boolean
  canFavorite: boolean
}

// 사용자 프로필
export interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: Date
  dreamCount: number
  subscriptionTier: SubscriptionTier
  monthlySaveCount: number
  usage?: UsageInfo
  healthIndex: DreamHealthIndex
}

// 꿈 입력 폼 데이터
export interface DreamInputForm {
  title: string
  content: string
  characters?: string[]
  location?: string[]
  mainEmotion?: EmotionType
  lastScene?: string
  style: DreamStyle
}

// 웹툰 생성 요청
export interface WebtoonGenerationRequest {
  dreamId: string
  style: DreamStyle
  sceneCount?: number
}

// 웹툰 생성 응답
export interface WebtoonGenerationResponse {
  dreamId: string
  scenes: DreamScene[]
  webtoonUrl: string
  videoUrl?: string
  estimatedTime: number
}

// 날짜 포맷 헬퍼
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', options || { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}
