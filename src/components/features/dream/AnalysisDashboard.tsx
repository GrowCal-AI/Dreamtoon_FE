import { memo } from "react";
import { Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface AnalysisDashboardProps {
  analysis: any;
}

export const AnalysisDashboard = memo(({ analysis }: AnalysisDashboardProps) => {
  // BE emotionScores는 한글 키(기쁨, 분노 등) 또는 영문 키(JOY, ANGER 등)로 반환됨
  const scores = analysis?.emotionScores || {};
  const get = (ko: string, en: string) =>
    scores[ko] ?? scores[en] ?? scores[en.toLowerCase()] ?? 0;

  const data = [
    { subject: "기쁨", A: get("기쁨", "JOY"), fullMark: 100 },
    { subject: "불안", A: get("불안", "ANXIETY"), fullMark: 100 },
    { subject: "분노", A: get("분노", "ANGER"), fullMark: 100 },
    { subject: "슬픔", A: get("슬픔", "SADNESS"), fullMark: 100 },
    {
      subject: "놀람",
      A: get("놀람", "SURPRISE") || get("불편", "DISCOMFORT"),
      fullMark: 100,
    },
    { subject: "평온", A: get("평온", "PEACE"), fullMark: 100 },
  ];

  const insight = analysis?.aiInsight;

  return (
    <div className="w-full max-w-md glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 text-center">
        꿈 감정 분석
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="My Dream"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {insight && (
        <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-200 leading-relaxed">{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
});

AnalysisDashboard.displayName = "AnalysisDashboard";

export default AnalysisDashboard;
