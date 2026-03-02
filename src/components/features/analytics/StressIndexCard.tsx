import { memo } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface StressIndexCardProps {
  score: number;
}

export const StressIndexCard = memo(({ score }: StressIndexCardProps) => {
  const data = [
    {
      name: "Stress",
      value: score,
      fill: score >= 70 ? "#8B5CF6" : "#2DD4BF", // Purple or Teal
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 h-64 flex flex-col items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-gray-300 font-medium mb-2 z-10">Stress Index</h3>
      <div className="h-40 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            barSize={10}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar background dataKey="value" cornerRadius={30 / 2} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 z-10 text-center">
        {score >= 70 ? "높은 스트레스 상태입니다." : "안정적인 상태입니다."}
      </p>
    </div>
  );
});

StressIndexCard.displayName = "StressIndexCard";

export default StressIndexCard;
