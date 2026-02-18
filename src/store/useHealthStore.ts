import { create } from 'zustand'
import { EmotionType } from '@/types'

// -- Interfaces --

export interface DailyDreamStat {
    date: string
    dreamId: string
    primaryEmotion: EmotionType
    sleepScore: number // 1-5
    webtoonData?: {
        id: string
        thumbnail: string
    }
}

export interface HealthAnalysis {
    userId: string
    lastUpdated: Date
    stressIndex: number // 0-100
    sleepQuality: number // 0-100
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

// -- Store --

export const useHealthStore = create<HealthStore>((set) => ({
    analysis: null,
    isLoading: false,

    fetchAnalysis: async (_userId: string) => {
        set({ isLoading: true })

        // Simulate API delay
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                // Dummy Data
                const dummyAnalysis: HealthAnalysis = {
                    userId: 'current-user',
                    lastUpdated: new Date(),
                    stressIndex: 75,
                    sleepQuality: 60,
                    emotionDistribution: {
                        joy: 10,
                        anxiety: 40,
                        anger: 30,
                        sadness: 10,
                        surprise: 5,
                        peace: 5,
                    },
                    weeklyStats: [
                        // Last 7 days dummy data
                        {
                            date: '2024-02-14',
                            dreamId: '1',
                            primaryEmotion: 'anxiety',
                            sleepScore: 2,
                            webtoonData: {
                                id: '1',
                                thumbnail: 'https://images.unsplash.com/photo-1633469924738-52101af51d87?q=80&w=1000&auto=format&fit=crop'
                            }
                        },
                        { date: '2024-02-13', dreamId: '2', primaryEmotion: 'anger', sleepScore: 3 },
                        {
                            date: '2024-02-12',
                            dreamId: '3',
                            primaryEmotion: 'joy',
                            sleepScore: 4,
                            webtoonData: {
                                id: '3',
                                thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
                            }
                        },
                        { date: '2024-02-11', dreamId: '4', primaryEmotion: 'sadness', sleepScore: 2 },
                        { date: '2024-02-10', dreamId: '5', primaryEmotion: 'peace', sleepScore: 5 },
                        { date: '2024-02-09', dreamId: '6', primaryEmotion: 'surprise', sleepScore: 3 },
                        { date: '2024-02-08', dreamId: '7', primaryEmotion: 'anxiety', sleepScore: 1 },
                    ],
                }

                set({ analysis: dummyAnalysis, isLoading: false })
                resolve()
            }, 1000)
        })
    },
}))
