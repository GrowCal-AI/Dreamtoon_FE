import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useDreamStore } from '@/store/useDreamStore'
import { Brain, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const { dreams } = useDreamStore()

  // 감정 데이터 집계 (useMemo로 최적화)
  const emotionData = useMemo(() => {
    const emotions = {
      joy: 0,
      anxiety: 0,
      anger: 0,
      sadness: 0,
      surprise: 0,
      peace: 0,
    }

    dreams.forEach((dream) => {
      Object.entries(dream.analysis.emotions).forEach(([key, value]) => {
        emotions[key as keyof typeof emotions] += value
      })
    })

    return [
      { emotion: '기쁨', value: emotions.joy || 15, fullMark: 100 },
      { emotion: '불안', value: emotions.anxiety || 35, fullMark: 100 },
      { emotion: '분노', value: emotions.anger || 10, fullMark: 100 },
      { emotion: '슬픔', value: emotions.sadness || 20, fullMark: 100 },
      { emotion: '놀람', value: emotions.surprise || 25, fullMark: 100 },
      { emotion: '평온', value: emotions.peace || 40, fullMark: 100 },
    ]
  }, [dreams])

  // 시간대별 꿈 기록 (Mock data)
  const timelineData = useMemo(() => [
    { date: '1주전', dreams: 3, nightmares: 1, lucid: 0 },
    { date: '6일전', dreams: 2, nightmares: 0, lucid: 1 },
    { date: '5일전', dreams: 4, nightmares: 2, lucid: 0 },
    { date: '4일전', dreams: 3, nightmares: 0, lucid: 1 },
    { date: '3일전', dreams: 5, nightmares: 1, lucid: 2 },
    { date: '2일전', dreams: 2, nightmares: 0, lucid: 0 },
    { date: '어제', dreams: 3, nightmares: 1, lucid: 1 },
  ], [])

  // Dream Health Index (Mock data)
  const healthIndex = useMemo(() => ({
    stressLevel: 35,
    anxietyLevel: 40,
    emotionalResilience: 75,
    relationshipStress: 25,
    sleepQuality: 70,
    nightmareRatio: 0.2,
  }), [])

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="dream-text-gradient">꿈 분석 대시보드</span>
          </h1>
          <p className="text-gray-600">
            당신의 꿈 패턴을 분석하여 마음 건강을 체크해보세요
          </p>
        </motion.div>

        {/* Health Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
              <TrendingDown className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold mb-1">{healthIndex.stressLevel}%</div>
            <div className="text-gray-600">스트레스 지수</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full"
                style={{ width: `${healthIndex.stressLevel}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-pink-600" />
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold mb-1">{healthIndex.anxietyLevel}%</div>
            <div className="text-gray-600">불안 지수</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-red-400 h-2 rounded-full"
                style={{ width: `${healthIndex.anxietyLevel}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {healthIndex.emotionalResilience}%
            </div>
            <div className="text-gray-600">정서 회복력</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                style={{ width: `${healthIndex.emotionalResilience}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Brain className="w-8 h-8 text-indigo-600" />
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold mb-1">{healthIndex.sleepQuality}%</div>
            <div className="text-gray-600">수면의 질</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                style={{ width: `${healthIndex.sleepQuality}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotion Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">감정 분포도</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={emotionData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="emotion" tick={{ fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="감정 점수"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Timeline Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect p-6 rounded-2xl"
          >
            <h2 className="text-xl font-semibold mb-6">주간 꿈 기록</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="dreams"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  name="전체 꿈"
                />
                <Line
                  type="monotone"
                  dataKey="nightmares"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="악몽"
                />
                <Line
                  type="monotone"
                  dataKey="lucid"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="루시드 드림"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Emotion Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-effect p-6 rounded-2xl lg:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-6">감정별 출현 빈도</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="emotion" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect p-8 rounded-2xl mt-8"
        >
          <h2 className="text-2xl font-semibold mb-6">AI 인사이트</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-green-900 mb-1">
                    긍정적 변화
                  </div>
                  <p className="text-green-800 text-sm">
                    최근 2주간 악몽 비율이 15% 감소했습니다. 정서 회복력도 향상되고
                    있어요!
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">
                    패턴 발견
                  </div>
                  <p className="text-blue-800 text-sm">
                    평온한 감정의 꿈이 증가하고 있습니다. 수면의 질이 개선되고
                    있다는 신호입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-purple-900 mb-1">
                    오늘의 추천
                  </div>
                  <p className="text-purple-800 text-sm">
                    오늘은 가벼운 스트레칭과 명상으로 하루를 시작해보세요. 불안
                    지수를 낮추는 데 도움이 될 거예요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
