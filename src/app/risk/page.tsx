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
  determineRiskLevel,
  getRiskLevelColor,
} from "@/utils/riskCalculations";
import { AlertTriangle, TrendingUp, BarChart3, Filter } from "lucide-react";

const sampleThreats: Threat[] = [
  {
    id: "T001",
    name: "Misconfigured Web Application Firewall",
    description: "WAF misconfiguration enabling SSRF attacks",
    category: "Cloud Infrastructure",
    owner: "Cloud Security Team",
    dateIdentified: "2024-01-15",
    status: "Open",
  },
  {
    id: "T002",
    name: "Inadequate Privileged Access Management",
    description: "Insufficient controls over privileged access",
    category: "Access Control",
    owner: "Identity & Access Management",
    dateIdentified: "2024-01-15",
    status: "Open",
  },
];

const sampleImpactAssessments: ImpactAssessment[] = [
  {
    threatId: "T001",
    financial: 5,
    reputational: 5,
    operational: 4,
    regulatory: 5,
    weightedImpactScore: 4.8,
  },
  {
    threatId: "T002",
    financial: 5,
    reputational: 5,
    operational: 3,
    regulatory: 5,
    weightedImpactScore: 4.6,
  },
];

const sampleLikelihoodAssessments: LikelihoodAssessment[] = [
  {
    threatId: "T001",
    threatActorCapability: 4,
    opportunity: 4,
    historicalPrecedent: 4,
    likelihoodScore: 4.0,
  },
  {
    threatId: "T002",
    threatActorCapability: 4,
    opportunity: 4,
    historicalPrecedent: 4,
    likelihoodScore: 4.0,
  },
];

export default function RiskCalculation() {
  const [riskCalculations, setRiskCalculations] = useState<RiskCalculation[]>(
    []
  );
  const [filterLevel, setFilterLevel] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("totalRiskScore");

  useEffect(() => {
    // Calculate risks based on impact and likelihood assessments
    const calculations: RiskCalculation[] = [];

    sampleThreats.forEach((threat) => {
      const impact = sampleImpactAssessments.find(
        (i) => i.threatId === threat.id
      );
      const likelihood = sampleLikelihoodAssessments.find(
        (l) => l.threatId === threat.id
      );

      if (impact && likelihood) {
        const totalRiskScore = calculateTotalRiskScore(
          impact.weightedImpactScore,
          likelihood.likelihoodScore
        );
        const riskLevel = determineRiskLevel(totalRiskScore);

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
  }, []);

  const filteredRisks = riskCalculations
    .filter((risk) => filterLevel === "All" || risk.riskLevel === filterLevel)
    .sort((a, b) => {
      if (sortBy === "totalRiskScore")
        return b.totalRiskScore - a.totalRiskScore;
      if (sortBy === "threatName")
        return a.threatName.localeCompare(b.threatName);
      if (sortBy === "riskLevel") {
        const levelOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return levelOrder[b.riskLevel] - levelOrder[a.riskLevel];
      }
      return 0;
    });

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
          View calculated risk scores based on impact and likelihood assessments
        </p>
      </div>

      {/* Risk Statistics */}
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
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">C</span>
            </div>
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
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">H</span>
            </div>
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
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">M</span>
            </div>
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
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">L</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low</p>
              <p className="text-2xl font-bold text-green-600">
                {riskStats.low}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Filter by Risk Level:
            </span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="totalRiskScore">Risk Score (High to Low)</option>
              <option value="threatName">Threat Name (A to Z)</option>
              <option value="riskLevel">Risk Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Calculation Formula */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Risk Calculation Formula
        </h3>
        <div className="text-sm text-blue-800">
          <p className="mb-2">
            <strong>
              Total Risk Score = Weighted Impact Score × Likelihood Score
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

      {/* Risk Results Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Calculation Results ({filteredRisks.length})
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
              {filteredRisks.map((risk, index) => (
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
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskLevelColor(
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

      {/* Risk Level Legend */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Risk Level Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-red-100 text-red-800 border-red-200 mr-3">
              Critical
            </span>
            <span className="text-sm text-gray-600">
              Immediate action required
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-800 border-orange-200 mr-3">
              High
            </span>
            <span className="text-sm text-gray-600">
              Priority mitigation needed
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200 mr-3">
              Medium
            </span>
            <span className="text-sm text-gray-600">
              Manageable with controls
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

