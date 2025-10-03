"use client";

import { RiskCalculation } from "@/types";

interface RiskMatrixProps {
  data: RiskCalculation[];
}

export default function RiskMatrix({ data }: RiskMatrixProps) {
  // Create a 5x5 matrix for likelihood vs impact
  const matrix = Array(5)
    .fill(null)
    .map(() => Array(5).fill(0));

  // Populate matrix with risk counts
  data.forEach((risk) => {
    const impactIndex = Math.min(
      4,
      Math.max(0, Math.round(risk.weightedImpactScore) - 1)
    );
    const likelihoodIndex = Math.min(
      4,
      Math.max(0, Math.round(risk.likelihoodScore) - 1)
    );
    matrix[likelihoodIndex][impactIndex]++;
  });

  const getRiskLevel = (impact: number, likelihood: number) => {
    const score = (impact + 1) * (likelihood + 1);
    if (score >= 20) return "Critical";
    if (score >= 13) return "High";
    if (score >= 6) return "Medium";
    return "Low";
  };

  const getCellColor = (impact: number, likelihood: number) => {
    const riskLevel = getRiskLevel(impact, likelihood);
    switch (riskLevel) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-1 text-xs">
        <div></div>
        <div className="text-center font-medium">Very Low</div>
        <div className="text-center font-medium">Low</div>
        <div className="text-center font-medium">Medium</div>
        <div className="text-center font-medium">High</div>
        <div className="text-center font-medium">Very High</div>
      </div>

      {matrix.map((row, likelihoodIndex) => (
        <div key={likelihoodIndex} className="grid grid-cols-6 gap-1">
          <div className="text-xs font-medium flex items-center justify-center text-gray-700">
            {likelihoodIndex === 0
              ? "Very Low"
              : likelihoodIndex === 1
              ? "Low"
              : likelihoodIndex === 2
              ? "Medium"
              : likelihoodIndex === 3
              ? "High"
              : "Very High"}
          </div>
          {row.map((count, impactIndex) => (
            <div
              key={impactIndex}
              className={`h-12 flex items-center justify-center text-white font-bold text-sm rounded ${
                count > 0
                  ? getCellColor(impactIndex, likelihoodIndex)
                  : "bg-gray-200"
              }`}
            >
              {count > 0 ? count : ""}
            </div>
          ))}
        </div>
      ))}

      <div className="text-xs text-gray-600 mt-2">
        <p>
          Matrix shows risk distribution: Impact (columns) vs Likelihood (rows)
        </p>
        <p>Numbers indicate count of risks in each cell</p>
      </div>
    </div>
  );
}
