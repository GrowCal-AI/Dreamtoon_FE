import { DreamEntry, UserProfile } from '@/types'

// Mock 사용자 프로필
export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: '꿈꾸는 사람',
  email: 'dreamer@example.com',
  createdAt: new Date('2024-01-01'),
  dreamCount: 3,
  subscriptionTier: 'free',
  monthlySaveCount: 0,
  healthIndex: {
    stressLevel: 35,
    anxietyLevel: 40,
    emotionalResilience: 75,
    relationshipStress: 25,
    sleepQuality: 70,
    nightmareRatio: 0.2,
    lastUpdated: new Date(),
  },
}

// Mock 꿈 데이터
export const mockDreams: DreamEntry[] = [
  {
    id: 'mock-1',
    userId: 'user-1',
    title: '레오파드 게코 파이리와의 비행',
    content: '파이리와 함께 하늘을 나는 평온한 꿈',
    recordedAt: new Date('2026-02-16'),
    createdAt: new Date('2026-02-16'),
    inputMethod: 'text',
    style: 'healing',
    format: 'webtoon',
    scenes: [
      { id: '1', sceneNumber: 1, description: '파이리와 만남', characters: ['나', '파이리'], emotion: 'peace', backgroundKeywords: ['하늘'], narration: '파이리가 나에게 날아왔다.', imageUrl: 'https://picsum.photos/seed/gecko1/800/600' },
      { id: '2', sceneNumber: 2, description: '함께 비행', characters: ['나', '파이리'], emotion: 'joy', backgroundKeywords: ['구름'], narration: '우리는 구름 위를 날았다.', imageUrl: 'https://picsum.photos/seed/gecko2/800/600' }
    ],
    analysis: {
      emotions: { joy: 30, anxiety: 0, anger: 0, sadness: 0, surprise: 0, peace: 70 },
      tensionLevel: 10, controlLevel: 80, isNightmare: false, repeatingSymbols: [], relationshipPatterns: [], hasResolution: true
    },
    webtoonUrl: 'https://picsum.photos/seed/gecko_cover/400/600',
    tags: ['도마뱀', '비행', '평온'],
    isFavorite: true
  },
  {
    id: 'mock-2',
    userId: 'user-1',
    title: '네온 사인이 가득한 심해 도시',
    content: '심해 깊은 곳에 화려한 네온 도시가 있었다.',
    recordedAt: new Date('2026-02-15'),
    createdAt: new Date('2026-02-15'),
    inputMethod: 'text',
    style: 'cyberpunk',
    format: 'animation',
    scenes: [],
    analysis: {
      emotions: { joy: 20, anxiety: 10, anger: 0, sadness: 0, surprise: 70, peace: 0 },
      tensionLevel: 60, controlLevel: 50, isNightmare: false, repeatingSymbols: [], relationshipPatterns: [], hasResolution: false
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-lights-at-night-999-large.mp4',
    tags: ['심해', '네온', '미래'],
    isFavorite: false
  },
  {
    id: 'mock-3',
    userId: 'user-1',
    title: '거대한 보라색 구름 속의 미로',
    content: '보라색 구름 속에서 길을 잃었다.',
    recordedAt: new Date('2026-02-14'),
    createdAt: new Date('2026-02-14'),
    inputMethod: 'text',
    style: 'dark-fantasy',
    format: 'webtoon',
    scenes: [
      { id: '1', sceneNumber: 1, description: '미로 입구', characters: ['나'], emotion: 'anxiety', backgroundKeywords: ['구름', '보라색'], narration: '끝없는 미로 앞에 섰다.', imageUrl: 'https://picsum.photos/seed/cloud1/800/600' }
    ],
    analysis: {
      emotions: { joy: 0, anxiety: 80, anger: 0, sadness: 10, surprise: 10, peace: 0 },
      tensionLevel: 90, controlLevel: 20, isNightmare: true, repeatingSymbols: [], relationshipPatterns: [], hasResolution: false
    },
    webtoonUrl: 'https://picsum.photos/seed/cloud_cover/400/600',
    tags: ['미로', '구름', '불안'],
    isFavorite: false
  },
  {
    id: 'mock-4',
    userId: 'user-1',
    title: '끝없이 펼쳐진 에메랄드빛 숲',
    content: '초록빛 숲을 달리는 기분 좋은 꿈',
    recordedAt: new Date('2026-02-13'),
    createdAt: new Date('2026-02-13'),
    inputMethod: 'text',
    style: 'ghibli',
    format: 'animation',
    scenes: [],
    analysis: {
      emotions: { joy: 80, anxiety: 0, anger: 0, sadness: 0, surprise: 10, peace: 10 },
      tensionLevel: 20, controlLevel: 90, isNightmare: false, repeatingSymbols: [], relationshipPatterns: [], hasResolution: true
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    tags: ['숲', '자연', '기쁨'],
    isFavorite: true
  }
]
