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

//this saves the data onto the local storage
export function saveToLocalStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

// this then loads the data from the local storage onto the page
export function loadFromLocalStorage<T>(key: string, fallback: T[] = []): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return fallback;
  }
}

// these are the functions for each data type to save and load the data from the local storage
// this saves and loads the threats
export function saveThreats(threats: Threat[]): void {
  saveToLocalStorage(STORAGE_KEYS.THREATS, threats);
}

export function loadThreats(fallback: Threat[] = []): Threat[] {
  return loadFromLocalStorage(STORAGE_KEYS.THREATS, fallback);
}

// this saves and loads the impact assessments data
export function saveImpactAssessments(assessments: ImpactAssessment[]): void {
  saveToLocalStorage(STORAGE_KEYS.IMPACT_ASSESSMENTS, assessments);
}

export function loadImpactAssessments(
  fallback: ImpactAssessment[] = []
): ImpactAssessment[] {
  return loadFromLocalStorage(STORAGE_KEYS.IMPACT_ASSESSMENTS, fallback);
}

// this saves and loads the ;likelihood assessments dat
export function saveLikelihoodAssessments(
  assessments: LikelihoodAssessment[]
): void {
  saveToLocalStorage(STORAGE_KEYS.LIKELIHOOD_ASSESSMENTS, assessments);
}

export function loadLikelihoodAssessments(
  fallback: LikelihoodAssessment[] = []
): LikelihoodAssessment[] {
  return loadFromLocalStorage(STORAGE_KEYS.LIKELIHOOD_ASSESSMENTS, fallback);
}

// this then saves and loads the calculations for the risks
export function saveRiskCalculations(calculations: RiskCalculation[]): void {
  saveToLocalStorage(STORAGE_KEYS.RISK_CALCULATIONS, calculations);
}

export function loadRiskCalculations(
  fallback: RiskCalculation[] = []
): RiskCalculation[] {
  return loadFromLocalStorage(STORAGE_KEYS.RISK_CALCULATIONS, fallback);
}

// this then also saves and loads the countermeasures data for the countermeasures page
export function saveCountermeasures(countermeasures: Countermeasure[]): void {
  saveToLocalStorage(STORAGE_KEYS.COUNTERMEASURES, countermeasures);
}

export function loadCountermeasures(
  fallback: Countermeasure[] = []
): Countermeasure[] {
  return loadFromLocalStorage(STORAGE_KEYS.COUNTERMEASURES, fallback);
}

// this then loads the dataset for the page from local storage
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

// this saves the dataset for the page to local storage for risk analysis
export function saveCompleteDataset(data: RiskAnalysisData): void {
  saveThreats(data.threats);
  saveImpactAssessments(data.impactAssessments);
  saveLikelihoodAssessments(data.likelihoodAssessments);
  saveRiskCalculations(data.riskCalculations);
  saveCountermeasures(data.countermeasures);
}
