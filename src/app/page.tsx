"use client";

import { useState, useEffect } from "react";
import { sampleRiskAnalysisData } from "@/data/sampleData";
import { RiskAnalysisData, RiskLevel } from "@/types";
import { getRiskLevelColor } from "@/utils/riskCalculations";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  FileText,
  BarChart3,
  Download,
} from "lucide-react";
import RiskMatrix from "@/components/RiskMatrix";
import RiskChart from "@/components/RiskChart";
import { exportToExcel } from "@/utils/excelExport";

export default function Dashboard() {
  const [data, setData] = useState<RiskAnalysisData>(sampleRiskAnalysisData);

  const riskStats = {
    total: data.riskCalculations.length,
    critical: data.riskCalculations.filter((r) => r.riskLevel === "Critical")
      .length,
    high: data.riskCalculations.filter((r) => r.riskLevel === "High").length,
    medium: data.riskCalculations.filter((r) => r.riskLevel === "Medium")
      .length,
    low: data.riskCalculations.filter((r) => r.riskLevel === "Low").length,
  };

  const topRisks = data.riskCalculations
    .sort((a, b) => b.totalRiskScore - a.totalRiskScore)
    .slice(0, 5);

  const handleExportExcel = () => {
    exportToExcel(data, "RiskAnalysisTool.xlsx");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Risk Analysis Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive cybersecurity risk assessment based on NIST
            Cybersecurity Framework
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
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

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Distribution
          </h3>
          <RiskChart data={data.riskCalculations} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Matrix
          </h3>
          <RiskMatrix data={data.riskCalculations} />
        </div>
      </div>

      {/* Top Risks Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Top 5 Highest Risks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likelihood Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topRisks.map((risk) => (
                <tr key={risk.threatId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {risk.threatName}
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
                    {risk.totalRiskScore.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {risk.weightedImpactScore.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {risk.likelihoodScore.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
