// 꿈 감정 타입
export type EmotionType = 'joy' | 'anxiety' | 'anger' | 'sadness' | 'surprise' | 'peace'

// 꿈 스타일 프리셋
export type DreamStyle = 'romance' | 'school' | 'dark-fantasy' | 'healing' | 'comedy' | 'horror'

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
  tensionLevel: number // 0-100
  controlLevel: number // 0-100 (루시드 드림 정도)
  isNightmare: boolean
  repeatingSymbols: string[]
  relationshipPatterns: string[]
  hasResolution: boolean // 꿈이 해결 구조를 가지는지
}

// 꿈 헬스 지수
export interface DreamHealthIndex {
  stressLevel: number // 0-100
  anxietyLevel: number // 0-100
  emotionalResilience: number // 0-100
  relationshipStress: number // 0-100
  sleepQuality: number // 0-100
  nightmareRatio: number // 0-1
  lastUpdated: Date
}

// 꿈 엔트리 (사용자가 입력한 꿈)
export interface DreamEntry {
  id: string
  userId: string
  title: string
  content: string
  recordedAt: Date
  createdAt: Date
  inputMethod: 'text' | 'voice'
  style: DreamStyle
  scenes: DreamScene[]
  analysis: DreamAnalysis
  webtoonUrl?: string
  videoUrl?: string
  tags: string[]
  isFavorite: boolean
}

// 사용자 프로필
export interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: Date
  dreamCount: number
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
