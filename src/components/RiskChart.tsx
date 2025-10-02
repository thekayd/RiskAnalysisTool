"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { RiskCalculation } from "@/types";

interface RiskChartProps {
  data: RiskCalculation[];
}

const COLORS = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#F97316",
  Critical: "#EF4444",
};

export default function RiskChart({ data }: RiskChartProps) {
  const riskDistribution = data.reduce((acc, risk) => {
    acc[risk.riskLevel] = (acc[risk.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(riskDistribution).map(([level, count]) => ({
    name: level,
    value: count,
    color: COLORS[level as keyof typeof COLORS],
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

