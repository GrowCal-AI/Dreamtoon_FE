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
    fetchAnalysis: (userId: string) => Promise<void>
}

export const useHealthStore = create<HealthStore>((set) => ({
    analysis: null,
    isLoading: false,

    fetchAnalysis: async (_userId: string) => {
        set({ isLoading: true })

        try {
            const healthData = await analyticsAPI.getHealthIndex()
            const emotionData = await analyticsAPI.getEmotionAnalysis('week')

            const dist = healthData.emotionDistribution || emotionData.emotionDistribution || {}

            const analysis: HealthAnalysis = {
                userId: _userId,
                lastUpdated: new Date(),
                stressIndex: healthData.stressLevel ?? 0,
                sleepQuality: healthData.sleepQuality ?? 50,
                emotionDistribution: {
                    joy: dist.JOY ?? dist.joy ?? 0,
                    anxiety: dist.ANXIETY ?? dist.anxiety ?? 0,
                    anger: dist.ANGER ?? dist.anger ?? 0,
                    sadness: dist.SADNESS ?? dist.sadness ?? 0,
                    surprise: dist.SURPRISE ?? dist.surprise ?? 0,
                    peace: dist.PEACE ?? dist.peace ?? 0,
                },
                weeklyStats: (emotionData.dailyData || []).map((d: any) => ({
                    date: d.date,
                    dreamId: d.dreamId || '',
                    primaryEmotion: (d.primaryEmotion || 'peace').toLowerCase() as EmotionType,
                    sleepScore: d.sleepScore || 3,
                })),
                currentInsight: healthData.insights?.[0]
                    ? { message: healthData.insights[0], recommendation: healthData.insights[1] || '' }
                    : undefined,
            }

            set({ analysis, isLoading: false })
        } catch (error) {
            console.error('Failed to fetch health analysis:', error)
            set({ isLoading: false })
        }
    },
}))
