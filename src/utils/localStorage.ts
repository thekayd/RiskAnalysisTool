import {
  RiskAnalysisData,
  Threat,
  ImpactAssessment,
  LikelihoodAssessment,
  RiskCalculation,
  Countermeasure,
} from "@/types";

const STORAGE_KEYS = {
  THREATS: "risk-analysis-threats",
  IMPACT_ASSESSMENTS: "risk-analysis-impact-assessments",
  LIKELIHOOD_ASSESSMENTS: "risk-analysis-likelihood-assessments",
  RISK_CALCULATIONS: "risk-analysis-risk-calculations",
  COUNTERMEASURES: "risk-analysis-countermeasures",
};

//
export function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function loadFromStorage<T>(key: string, fallback: T[] = []): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return fallback;
  }
}

// Specific functions for each data type
export function saveThreats(threats: Threat[]): void {
  saveToStorage(STORAGE_KEYS.THREATS, threats);
}

export function loadThreats(fallback: Threat[] = []): Threat[] {
  return loadFromStorage(STORAGE_KEYS.THREATS, fallback);
}

export function saveImpactAssessments(assessments: ImpactAssessment[]): void {
  saveToStorage(STORAGE_KEYS.IMPACT_ASSESSMENTS, assessments);
}

export function loadImpactAssessments(
  fallback: ImpactAssessment[] = []
): ImpactAssessment[] {
  return loadFromStorage(STORAGE_KEYS.IMPACT_ASSESSMENTS, fallback);
}

export function saveLikelihoodAssessments(
  assessments: LikelihoodAssessment[]
): void {
  saveToStorage(STORAGE_KEYS.LIKELIHOOD_ASSESSMENTS, assessments);
}

export function loadLikelihoodAssessments(
  fallback: LikelihoodAssessment[] = []
): LikelihoodAssessment[] {
  return loadFromStorage(STORAGE_KEYS.LIKELIHOOD_ASSESSMENTS, fallback);
}

export function saveRiskCalculations(calculations: RiskCalculation[]): void {
  saveToStorage(STORAGE_KEYS.RISK_CALCULATIONS, calculations);
}

export function loadRiskCalculations(
  fallback: RiskCalculation[] = []
): RiskCalculation[] {
  return loadFromStorage(STORAGE_KEYS.RISK_CALCULATIONS, fallback);
}

export function saveCountermeasures(countermeasures: Countermeasure[]): void {
  saveToStorage(STORAGE_KEYS.COUNTERMEASURES, countermeasures);
}

export function loadCountermeasures(
  fallback: Countermeasure[] = []
): Countermeasure[] {
  return loadFromStorage(STORAGE_KEYS.COUNTERMEASURES, fallback);
}

// function to clear all data from local storage
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

// loads the dataset from local storage
export function loadCompleteDataset(
  fallback: RiskAnalysisData
): RiskAnalysisData {
  return {
    threats: loadThreats(fallback.threats),
    impactAssessments: loadImpactAssessments(fallback.impactAssessments),
    likelihoodAssessments: loadLikelihoodAssessments(
      fallback.likelihoodAssessments
    ),
    riskCalculations: loadRiskCalculations(fallback.riskCalculations),
    countermeasures: loadCountermeasures(fallback.countermeasures),
  };
}

// this saves the dataset
export function saveCompleteDataset(data: RiskAnalysisData): void {
  saveThreats(data.threats);
  saveImpactAssessments(data.impactAssessments);
  saveLikelihoodAssessments(data.likelihoodAssessments);
  saveRiskCalculations(data.riskCalculations);
  saveCountermeasures(data.countermeasures);
}
