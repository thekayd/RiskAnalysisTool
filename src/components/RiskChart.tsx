"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { RiskCalculation, RiskLevel } from "@/types";

interface RiskChartProps {
  data: RiskCalculation[];
}

// pie chart for visulaizations form the amount of risk levels there are.
const variouscolors = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#F97316",
  Critical: "#EF4444",
};

export default function RiskAnalysisChart({ data }: RiskChartProps) {
  const counts = {} as Record<RiskLevel, number>;
  data.forEach((risk) => {
    counts[risk.riskLevel] = (counts[risk.riskLevel] || 0) + 1;
  });

  const chartData = Object.entries(counts).map(([level, count]) => ({
    name: level,
    value: count,
    color: variouscolors[level as keyof typeof variouscolors],
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
