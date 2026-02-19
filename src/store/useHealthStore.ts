import { create } from 'zustand'
import { EmotionType } from '@/types'
import { analyticsAPI } from '@/services/api'

export interface DailyDreamStat {
    date: string
    dreamId: string
    primaryEmotion: EmotionType
    sleepScore: number
    webtoonData?: {
        id: string
        thumbnail: string
    }
}

export interface HealthAnalysis {
    userId: string
    lastUpdated: Date
    stressIndex: number
    sleepQuality: number
    emotionDistribution: {
        [key in EmotionType]: number
    }
    weeklyStats: DailyDreamStat[]
    currentInsight?: {
        message: string
        recommendation: string
    }
}

interface HealthStore {
    analysis: HealthAnalysis | null
    isLoading: boolean
    fetchError: string | null
    fetchAnalysis: (userId: string) => Promise<void>
}

export const useHealthStore = create<HealthStore>((set) => ({
    analysis: null,
    isLoading: false,
    fetchError: null,

    fetchAnalysis: async (_userId: string) => {
        set({ isLoading: true, fetchError: null })

        try {
            const [healthData, emotionData] = await Promise.all([
                analyticsAPI.getHealthIndex().catch(() => null),
                analyticsAPI.getEmotionAnalysis('week').catch(() => null),
            ])

            const dist =
                (healthData?.emotionDistribution ?? emotionData?.emotionDistribution) || {}
            const dailyData = emotionData?.dailyData ?? []

            const analysis: HealthAnalysis = {
                userId: _userId,
                lastUpdated: new Date(),
                stressIndex: healthData?.stressLevel ?? 0,
                sleepQuality: healthData?.sleepQuality ?? 50,
                emotionDistribution: {
                    joy: dist.JOY ?? dist.joy ?? 0,
                    anxiety: dist.ANXIETY ?? dist.anxiety ?? 0,
                    anger: dist.ANGER ?? dist.anger ?? 0,
                    sadness: dist.SADNESS ?? dist.sadness ?? 0,
                    surprise: dist.SURPRISE ?? dist.surprise ?? 0,
                    peace: dist.PEACE ?? dist.peace ?? 0,
                },
                weeklyStats: dailyData.map((d: Record<string, unknown>) => ({
                    date: String(d.date ?? ''),
                    dreamId: String(d.dreamId ?? ''),
                    primaryEmotion: (String(d.primaryEmotion ?? 'peace').toLowerCase()) as EmotionType,
                    sleepScore: Number(d.sleepScore ?? 3),
                })),
                currentInsight:
                    healthData?.insights?.[0] != null
                        ? {
                              message: healthData.insights[0],
                              recommendation: healthData.insights[1] ?? '',
                          }
                        : undefined,
            }

            set({ analysis, isLoading: false, fetchError: null })
        } catch (error) {
            console.error('Failed to fetch health analysis:', error)
            set({
                isLoading: false,
                fetchError: '분석 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
            })
        }
    },
}))
