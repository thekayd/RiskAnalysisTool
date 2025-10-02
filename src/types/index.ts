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
  financial: number; // 1-5 scale
  reputational: number; // 1-5 scale
  operational: number; // 1-5 scale
  regulatory: number; // 1-5 scale
  weightedImpactScore: number;
}

export interface LikelihoodAssessment {
  threatId: string;
  threatActorCapability: number; // 1-5 scale
  opportunity: number; // 1-5 scale
  historicalPrecedent: number; // 1-5 scale
  likelihoodScore: number; // average of the three factors
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
  effectivenessPercentage: number; // 20-95%
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

export interface ImpactWeights {
  financial: number;
  reputational: number;
  operational: number;
  regulatory: number;
}

export const DEFAULT_IMPACT_WEIGHTS: ImpactWeights = {
  financial: 0.3,
  reputational: 0.3,
  operational: 0.2,
  regulatory: 0.2,
};

export const RISK_LEVEL_THRESHOLDS = {
  Low: 5,
  Medium: 12,
  High: 19,
  Critical: 25,
};

export const SCORE_LABELS = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
} as const;

