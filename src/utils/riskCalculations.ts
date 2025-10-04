import {
  ImpactAssessment,
  LikelihoodAssessment,
  RiskCalculation,
  Countermeasure,
  WeightImpact,
  RiskLevel,
  Impact_Weights,
} from "@/types";

// This page is for calculations done for the overall risk analysis system

export function weightedImpactScoreCalculation(
  impact: Omit<ImpactAssessment, "weightedImpactScore">,
  weights: WeightImpact = Impact_Weights
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

export function RiskLevelTiers(totalRiskScore: number): RiskLevel {
  if (totalRiskScore >= 25) return "Critical";
  if (totalRiskScore >= 19) return "High";
  if (totalRiskScore >= 6) return "Medium";
  return "Low";
}

export function calculateResidualRiskScore(
  totalRiskScore: number,
  effectivenessPercentage: number
): number {
  return totalRiskScore * (1 - effectivenessPercentage / 100);
}

export function RiskLevelColor(riskLevel: RiskLevel): string {
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

// this is for the score labels
export function ScoreLabel(score: number): string {
  if (score <= 1.5) return "Very Low";
  if (score <= 2.5) return "Low";
  if (score <= 3.5) return "Medium";
  if (score <= 4.5) return "High";
  return "Very High";
}

export function ThreatIdGenerator(index: number): string {
  return `T${String(index + 1).padStart(3, "0")}`;
}

export function ScoreValidator(score: number): boolean {
  return score >= 1 && score <= 5 && Number.isInteger(score);
}

export function validateEffectiveness(effectiveness: number): boolean {
  return effectiveness >= 20 && effectiveness <= 95;
}
