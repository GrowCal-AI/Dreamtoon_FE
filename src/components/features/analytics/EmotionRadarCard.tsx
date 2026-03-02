import { memo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface EmotionRadarCardProps {
  data: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

export const EmotionRadarCard = memo(({ data }: EmotionRadarCardProps) => (
  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-80 relative overflow-hidden">
    <h3 className="text-gray-300 font-medium mb-2 text-center">
      Emotion Balance
    </h3>
    <ResponsiveContainer width="100%" height="90%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#ffffff20" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#9CA3AF", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="Emotion"
          dataKey="A"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#colorPv)"
          fillOpacity={0.6}
        />
        <defs>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            borderColor: "#374151",
            color: "#F3F4F6",
          }}
          itemStyle={{ color: "#F3F4F6" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
));

EmotionRadarCard.displayName = "EmotionRadarCard";

export default EmotionRadarCard;
