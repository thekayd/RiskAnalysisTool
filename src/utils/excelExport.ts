import * as XLSX from "xlsx";
import { RiskAnalysisData } from "@/types";

export function exportToExcel(
  data: RiskAnalysisData,
  filename: string = "RiskAnalysisTool.xlsx"
) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Threat Register
  const threatSheet = XLSX.utils.json_to_sheet(data.threats);
  XLSX.utils.book_append_sheet(workbook, threatSheet, "Threat Register");

  // Sheet 2: Impact Assessment
  const impactSheet = XLSX.utils.json_to_sheet(data.impactAssessments);
  XLSX.utils.book_append_sheet(workbook, impactSheet, "Impact Assessment");

  // Sheet 3: Likelihood Assessment
  const likelihoodSheet = XLSX.utils.json_to_sheet(data.likelihoodAssessments);
  XLSX.utils.book_append_sheet(
    workbook,
    likelihoodSheet,
    "Likelihood Assessment"
  );

  // Sheet 4: Risk Calculation
  const riskSheet = XLSX.utils.json_to_sheet(data.riskCalculations);
  XLSX.utils.book_append_sheet(workbook, riskSheet, "Risk Calculation");

  // Sheet 5: Countermeasures
  const countermeasuresSheet = XLSX.utils.json_to_sheet(data.countermeasures);
  XLSX.utils.book_append_sheet(
    workbook,
    countermeasuresSheet,
    "Countermeasures"
  );

  // Sheet 6: Summary Dashboard
  const summaryData = [
    ["Risk Analysis Tool - Summary Dashboard"],
    ["Generated on:", new Date().toLocaleDateString()],
    [""],
    ["Risk Statistics"],
    ["Total Risks:", data.riskCalculations.length],
    [
      "Critical Risks:",
      data.riskCalculations.filter((r) => r.riskLevel === "Critical").length,
    ],
    [
      "High Risks:",
      data.riskCalculations.filter((r) => r.riskLevel === "High").length,
    ],
    [
      "Medium Risks:",
      data.riskCalculations.filter((r) => r.riskLevel === "Medium").length,
    ],
    [
      "Low Risks:",
      data.riskCalculations.filter((r) => r.riskLevel === "Low").length,
    ],
    [""],
    ["Top 5 Highest Risks"],
    ...data.riskCalculations
      .sort((a, b) => b.totalRiskScore - a.totalRiskScore)
      .slice(0, 5)
      .map((risk) => [risk.threatName, risk.totalRiskScore, risk.riskLevel]),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Download the file
  XLSX.writeFile(workbook, filename);
}

export function exportRiskMatrix(data: RiskAnalysisData) {
  const workbook = XLSX.utils.book_new();

  // Create risk matrix data
  const matrixData = [];
  for (let likelihood = 1; likelihood <= 5; likelihood++) {
    const row = [];
    for (let impact = 1; impact <= 5; impact++) {
      const risks = data.riskCalculations.filter(
        (risk) =>
          Math.round(risk.likelihoodScore) === likelihood &&
          Math.round(risk.weightedImpactScore) === impact
      );
      row.push(risks.length);
    }
    matrixData.push(row);
  }

  const matrixSheet = XLSX.utils.aoa_to_sheet(matrixData);
  XLSX.utils.book_append_sheet(workbook, matrixSheet, "Risk Matrix");

  XLSX.writeFile(workbook, "RiskMatrix.xlsx");
}

