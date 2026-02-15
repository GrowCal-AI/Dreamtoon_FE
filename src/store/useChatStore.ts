import { create } from 'zustand'
import { EmotionType, DreamStyle, DreamAnalysis } from '@/types'

export type ChatStep = 0 | 1 | 2 | 3 | 4 | 5

export interface Message {
    id: string
    role: 'ai' | 'user'
    content: string
    type?: 'text' | 'emotion' | 'style' | 'analysis'
    timestamp: Date
}

interface ChatStore {
    step: ChatStep
    messages: Message[]
    selectedEmotion: EmotionType | null
    dreamContent: string
    analysisResult: DreamAnalysis | null
    selectedStyle: DreamStyle | null
    isAnalyzing: boolean
    isGenerating: boolean
    isSaved: boolean
    isPremium: boolean
    showPremiumModal: boolean

    // Actions
    setStep: (step: ChatStep) => void
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
    selectEmotion: (emotion: EmotionType) => void
    setDreamContent: (content: string) => void
    setAnalysisResult: (result: DreamAnalysis) => void
    selectStyle: (style: DreamStyle) => void
    setIsAnalyzing: (isAnalyzing: boolean) => void
    setIsGenerating: (isGenerating: boolean) => void
    setIsSaved: (isSaved: boolean) => void
    setIsPremium: (isPremium: boolean) => void
    setShowPremiumModal: (show: boolean) => void
    reset: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
    step: 0,
    messages: [],
    selectedEmotion: null,
    dreamContent: '',
    analysisResult: null,
    selectedStyle: null,
    isAnalyzing: false,
    isGenerating: false,
    isSaved: false,
    isPremium: false,
    showPremiumModal: false,

    setStep: (step) => set({ step }),

    addMessage: (message) => set((state) => ({
        messages: [
            ...state.messages,
            {
                ...message,
                id: Math.random().toString(36).substring(7),
                timestamp: new Date(),
            },
        ],
    })),

    selectEmotion: (emotion) => set({ selectedEmotion: emotion }),
    setDreamContent: (content) => set({ dreamContent: content }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    selectStyle: (style) => set({ selectedStyle: style }),
    setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

    // New Actions
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setIsSaved: (isSaved) => set({ isSaved }),
    setIsPremium: (isPremium) => set({ isPremium }),
    setShowPremiumModal: (show) => set({ showPremiumModal: show }),

    reset: () => set({
        step: 0,
        messages: [],
        selectedEmotion: null,
        dreamContent: '',
        analysisResult: null,
        selectedStyle: null,
        isAnalyzing: false,
        isGenerating: false,
        isSaved: false,
        showPremiumModal: false,
        // Do not reset isPremium to simulate persistence if desired,
        // but usually reset clears session. Let's keep isPremium if already set?
        // Prompt implies session-based but let's clear for "New Chat" logic unless user stays logged in.
        // For now, reset everything for a clean new chat start as per "New Chat" requirement.
        isPremium: false,
    }),
}))
