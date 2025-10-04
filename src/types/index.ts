export interface Threat {
  id: string;
  name: string;
  description: string;
  category: ThreatCategory;
  owner: string;
  dateIdentified: string;
  status: "Open" | "In Progress" | "Closed" | "Mitigated";
}

export type ThreatCategory =
  | "Cloud Infrastructure"
  | "Access Control"
  | "Insider Threat"
  | "Third-Party"
  | "Malware"
  | "Phishing"
  | "Data Exposure"
  | "Regulatory Compliance"
  | "Other";

export interface ImpactAssessment {
  threatId: string;
  financial: number;
  reputational: number;
  operational: number;
  regulatory: number;
  weightedImpactScore: number;
}

export interface LikelihoodAssessment {
  threatId: string;
  threatActorCapability: number;
  opportunity: number;
  historicalPrecedent: number;
  likelihoodScore: number;
}

export interface RiskCalculation {
  threatId: string;
  threatName: string;
  weightedImpactScore: number;
  likelihoodScore: number;
  totalRiskScore: number;
  riskLevel: RiskLevel;
}

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface Countermeasure {
  threatId: string;
  description: string;
  nistFunction: NISTFunction;
  implementationTimeline: string;
  estimatedCost: string;
  effectivenessPercentage: number;
  totalRiskScore: number;
  residualRiskScore: number;
}

export type NISTFunction =
  | "Identify"
  | "Protect"
  | "Detect"
  | "Respond"
  | "Recover";

export interface RiskAnalysisData {
  threats: Threat[];
  impactAssessments: ImpactAssessment[];
  likelihoodAssessments: LikelihoodAssessment[];
  riskCalculations: RiskCalculation[];
  countermeasures: Countermeasure[];
}

export interface WeightImpact {
  financial: number;
  reputational: number;
  operational: number;
  regulatory: number;
}

export const Impact_Weights = {
  financial: 0.3,
  reputational: 0.3,
  operational: 0.2,
  regulatory: 0.2,
};

export const Score_Labels = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
} as const;
