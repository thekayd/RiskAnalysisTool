import {
  ImpactAssessment,
  LikelihoodAssessment,
  RiskCalculation,
  Countermeasure,
  ImpactWeights,
  RiskLevel,
  DEFAULT_IMPACT_WEIGHTS,
  RISK_LEVEL_THRESHOLDS,
} from "@/types";

export function calculateWeightedImpactScore(
  impact: Omit<ImpactAssessment, "weightedImpactScore">,
  weights: ImpactWeights = DEFAULT_IMPACT_WEIGHTS
): number {
  return (
    impact.financial * weights.financial +
    impact.reputational * weights.reputational +
    impact.operational * weights.operational +
    impact.regulatory * weights.regulatory
  );
}

export function calculateLikelihoodScore(
  likelihood: Omit<LikelihoodAssessment, "likelihoodScore">
): number {
  return (
    (likelihood.threatActorCapability +
      likelihood.opportunity +
      likelihood.historicalPrecedent) /
    3
  );
}

export function calculateTotalRiskScore(
  weightedImpactScore: number,
  likelihoodScore: number
): number {
  return weightedImpactScore * likelihoodScore;
}

export function determineRiskLevel(totalRiskScore: number): RiskLevel {
  if (totalRiskScore >= RISK_LEVEL_THRESHOLDS.Critical) return "Critical";
  if (totalRiskScore >= RISK_LEVEL_THRESHOLDS.High) return "High";
  if (totalRiskScore >= RISK_LEVEL_THRESHOLDS.Medium) return "Medium";
  return "Low";
}

export function calculateResidualRiskScore(
  totalRiskScore: number,
  effectivenessPercentage: number
): number {
  return totalRiskScore * (1 - effectivenessPercentage / 100);
}

export function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Critical":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getScoreLabel(score: number): string {
  if (score <= 1.5) return "Very Low";
  if (score <= 2.5) return "Low";
  if (score <= 3.5) return "Medium";
  if (score <= 4.5) return "High";
  return "Very High";
}

export function generateThreatId(index: number): string {
  return `T${String(index + 1).padStart(3, "0")}`;
}

export function validateScore(score: number): boolean {
  return score >= 1 && score <= 5 && Number.isInteger(score);
}

export function validateEffectiveness(effectiveness: number): boolean {
  return effectiveness >= 20 && effectiveness <= 95;
}

