"use client";

import { useState } from "react";
import { ImpactAssessment as ImpactAssessmentType, Threat } from "@/types";
import {
  calculateWeightedImpactScore,
  getScoreLabel,
} from "@/utils/riskCalculations";
import { DollarSign, Users, Settings, Shield, Calculator } from "lucide-react";

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

export default function ImpactAssessment() {
  const [assessments, setAssessments] = useState<ImpactAssessmentType[]>([
    {
      threatId: "T001",
      financial: 5,
      reputational: 5,
      operational: 4,
      regulatory: 5,
      weightedImpactScore: 91.0,
    },
  ]);

  const [selectedThreat, setSelectedThreat] = useState<string>("");
  const [formData, setFormData] = useState({
    financial: 1,
    reputational: 1,
    operational: 1,
    regulatory: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThreat) return;

    const weightedScore = calculateWeightedImpactScore(
      { ...formData, threatId: selectedThreat },
      {
        financial: formData.financial,
        reputational: formData.reputational,
        operational: formData.operational,
        regulatory: formData.regulatory,
      }
    );
    const newAssessment: ImpactAssessmentType = {
      threatId: selectedThreat,
      financial: formData.financial,
      reputational: formData.reputational,
      operational: formData.operational,
      regulatory: formData.regulatory,
      weightedImpactScore: weightedScore,
    };

    const existingIndex = assessments.findIndex(
      (a) => a.threatId === selectedThreat
    );
    if (existingIndex >= 0) {
      setAssessments(
        assessments.map((a, i) => (i === existingIndex ? newAssessment : a))
      );
    } else {
      setAssessments([...assessments, newAssessment]);
    }

    setFormData({
      financial: 1,
      reputational: 1,
      operational: 1,
      regulatory: 1,
    });
    setSelectedThreat("");
  };

  const getImpactColor = (score: number) => {
    if (score >= 4.5) return "text-red-600 bg-red-100";
    if (score >= 3.5) return "text-orange-600 bg-orange-100";
    if (score >= 2.5) return "text-yellow-600 bg-yellow-100";
    if (score >= 1.5) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Impact Assessment</h1>
        <p className="text-gray-600 mt-2">
          Evaluate the potential impact of identified threats across four key
          dimensions
        </p>
      </div>

      {/* Assessment Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Assess Threat Impact
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Threat *
            </label>
            <select
              required
              value={selectedThreat}
              onChange={(e) => setSelectedThreat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Choose a threat to assess</option>
              {sampleThreats.map((threat) => (
                <option key={threat.id} value={threat.id}>
                  {threat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financial Impact */}
            <div className="space-y-3">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Financial Impact
                </label>
                <span className="ml-2 text-xs text-gray-500">(30% weight)</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="financial"
                      value={score}
                      checked={formData.financial === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financial: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "Minimal cost"
                        : score === 5
                        ? "Catastrophic financial loss"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reputational Impact */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Reputational Impact
                </label>
                <span className="ml-2 text-xs text-gray-500">(30% weight)</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="reputational"
                      value={score}
                      checked={formData.reputational === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reputational: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "No reputation damage"
                        : score === 5
                        ? "Severe brand damage"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Operational Impact */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-orange-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Operational Impact
                </label>
                <span className="ml-2 text-xs text-gray-500">(20% weight)</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="operational"
                      value={score}
                      checked={formData.operational === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          operational: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "No operational impact"
                        : score === 5
                        ? "Complete service disruption"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Regulatory Impact */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-purple-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Regulatory Impact
                </label>
                <span className="ml-2 text-xs text-gray-500">(20% weight)</span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="regulatory"
                      value={score}
                      checked={formData.regulatory === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regulatory: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "No regulatory issues"
                        : score === 5
                        ? "Major compliance violations"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Weighted Impact Score Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">
                  Weighted Impact Score:
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getImpactColor(
                  calculateWeightedImpactScore(
                    { ...formData, threatId: selectedThreat },
                    {
                      financial: formData.financial,
                      reputational: formData.reputational,
                      operational: formData.operational,
                      regulatory: formData.regulatory,
                    }
                  )
                )}`}
              >
                {calculateWeightedImpactScore(
                  { ...formData, threatId: selectedThreat },
                  {
                    financial: formData.financial,
                    reputational: formData.reputational,
                    operational: formData.operational,
                    regulatory: formData.regulatory,
                  }
                ).toFixed(1)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Formula: (Financial × 0.30) + (Reputational × 0.30) + (Operational
              × 0.20) + (Regulatory × 0.20)
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedThreat}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Save Assessment
            </button>
          </div>
        </form>
      </div>

      {/* Impact Weights Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Impact Assessment Weights
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-gray-500">Financial: 30%</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-gray-500">Reputational: 30%</span>
          </div>
          <div className="flex items-center">
            <Settings className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-gray-500">Operational: 20%</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-gray-500">Regulatory: 20%</span>
          </div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Impact Assessment Results
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
                  Financial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reputational
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operational
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Regulatory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weighted Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assessments.map((assessment) => {
                const threat = sampleThreats.find(
                  (t) => t.id === assessment.threatId
                );
                return (
                  <tr key={assessment.threatId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {threat?.name || "Unknown Threat"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.financial}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.reputational}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.operational}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.regulatory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(
                          assessment.weightedImpactScore
                        )}`}
                      >
                        {assessment.weightedImpactScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
