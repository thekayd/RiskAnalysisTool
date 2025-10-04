"use client";

import { useState, useEffect } from "react";
import type {
  RiskCalculation,
  ImpactAssessment,
  LikelihoodAssessment,
  Threat,
} from "@/types";
import {
  calculateTotalRiskScore,
  RiskLevelTiers,
  RiskLevelColor,
} from "@/utils/riskCalculations";
import {
  saveRiskCalculations,
  loadRiskCalculations,
  loadThreats,
  loadImpactAssessments,
  loadLikelihoodAssessments,
} from "@/utils/localStorage";
import { AlertTriangle, TrendingUp } from "lucide-react";

export default function RiskCalculation() {
  const [riskCalculations, setRiskCalculations] = useState<RiskCalculation[]>(
    []
  );
  const [threats, setThreats] = useState<Threat[]>([]);
  const [impactAssessments, setImpactAssessments] = useState<
    ImpactAssessment[]
  >([]);
  const [likelihoodAssessments, setLikelihoodAssessments] = useState<
    LikelihoodAssessment[]
  >([]);

  // this function loads the data from localStorage on component mount
  useEffect(() => {
    const savedThreats = loadThreats();
    const savedImpactAssessments = loadImpactAssessments();
    const savedLikelihoodAssessments = loadLikelihoodAssessments();
    const savedRiskCalculations = loadRiskCalculations();

    setThreats(savedThreats);
    setImpactAssessments(savedImpactAssessments);
    setLikelihoodAssessments(savedLikelihoodAssessments);
    setRiskCalculations(savedRiskCalculations);
  }, []);

  useEffect(() => {
    // this then calculates the risks based on impact and likelihood assessments
    const calculations: RiskCalculation[] = [];

    threats.forEach((threat) => {
      const impact = impactAssessments.find((i) => i.threatId === threat.id);
      const likelihood = likelihoodAssessments.find(
        (l) => l.threatId === threat.id
      );

      if (impact && likelihood) {
        const totalRiskScore = calculateTotalRiskScore(
          impact.weightedImpactScore,
          likelihood.likelihoodScore
        );
        const riskLevel = RiskLevelTiers(totalRiskScore);

        calculations.push({
          threatId: threat.id,
          threatName: threat.name,
          weightedImpactScore: impact.weightedImpactScore,
          likelihoodScore: likelihood.likelihoodScore,
          totalRiskScore: totalRiskScore,
          riskLevel: riskLevel,
        });
      }
    });

    setRiskCalculations(calculations);
    saveRiskCalculations(calculations);
  }, [threats, impactAssessments, likelihoodAssessments]);

  // calcualtes the risk stats to associate it with the risk calculations
  const riskStats = {
    total: riskCalculations.length,
    critical: riskCalculations.filter((r) => r.riskLevel === "Critical").length,
    high: riskCalculations.filter((r) => r.riskLevel === "High").length,
    medium: riskCalculations.filter((r) => r.riskLevel === "Medium").length,
    low: riskCalculations.filter((r) => r.riskLevel === "Low").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Risk Calculation</h1>
        <p className="text-gray-600 mt-2">
          View calculated risk scores based on impact and likelihood
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Risks</p>
              <p className="text-2xl font-bold text-gray-900">
                {riskStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">
                {riskStats.critical}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High</p>
              <p className="text-2xl font-bold text-orange-600">
                {riskStats.high}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">
                {riskStats.medium}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low</p>
              <p className="text-2xl font-bold text-green-600">
                {riskStats.low}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Risk Calculation Formula
        </h3>
        <div className="text-sm text-blue-800">
          <p className="mb-2">
            <strong>
              Total Risk Score = Weighted Impact Score x Likelihood Score
            </strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Risk Level Thresholds:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Critical: 20-25 points</li>
                <li>High: 13-19 points</li>
                <li>Medium: 6-12 points</li>
                <li>Low: 1-5 points</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Score Ranges:</p>
              <ul className="list-disc list-inside ml-4">
                <li>Impact Score: 1.0-5.0</li>
                <li>Likelihood Score: 1.0-5.0</li>
                <li>Total Risk: 1.0-25.0</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Calculation Results ({riskCalculations.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threat Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likelihood Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riskCalculations.map((risk, index) => (
                <tr key={risk.threatId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {risk.threatName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {risk.weightedImpactScore.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {risk.likelihoodScore.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                      {risk.totalRiskScore.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${RiskLevelColor(
                        risk.riskLevel
                      )}`}
                    >
                      {risk.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{index + 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">
          Risk Level Summaries
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-red-100 text-red-800 border-red-200 mr-3">
              Critical
            </span>
            <span className="text-sm text-gray-600">
              Immediate action needed
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-800 border-orange-200 mr-3">
              High
            </span>
            <span className="text-sm text-gray-600">
              Priority mitigation needed with controls
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200 mr-3">
              Medium
            </span>
            <span className="text-sm text-gray-600">
              Manageable and not a high risk
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200 mr-3">
              Low
            </span>
            <span className="text-sm text-gray-600">
              Acceptable with monitoring
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
