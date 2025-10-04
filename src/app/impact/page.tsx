"use client";

import { useState, useEffect } from "react";
import { ImpactAssessment as ImpactAssessmentType, Threat } from "@/types";
import {
  weightedImpactScoreCalculation,
  ScoreLabel,
} from "@/utils/riskCalculations";
import {
  saveImpactAssessments,
  loadImpactAssessments,
  loadThreats,
} from "@/utils/localStorage";
import { DollarSign, Users, Settings, Shield, Calculator } from "lucide-react";

export default function ImpactAssessment() {
  const [assessments, setAssessments] = useState<ImpactAssessmentType[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<string>("");
  const [formData, setFormData] = useState({
    financial: 1,
    reputational: 1,
    operational: 1,
    regulatory: 1,
  });

  // this function loads the impact assessments and threats from localStorage on component mount
  useEffect(() => {
    const defaultAssessments: ImpactAssessmentType[] = [
      {
        threatId: "T001",
        financial: 5,
        reputational: 5,
        operational: 4,
        regulatory: 5,
        weightedImpactScore: 4.8,
      },
    ];

    const savedAssessments = loadImpactAssessments(defaultAssessments);
    const savedThreats = loadThreats();
    setAssessments(savedAssessments);
    setThreats(savedThreats);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThreat) return;

    // this calculates the wighted score for impact assessments
    const weightedScore = weightedImpactScoreCalculation({
      threatId: selectedThreat,
      financial: formData.financial,
      reputational: formData.reputational,
      operational: formData.operational,
      regulatory: formData.regulatory,
    });

    // this then creates new impact assessments and add them to the esisiting arrays
    const newAssessment: ImpactAssessmentType = {
      threatId: selectedThreat,
      financial: formData.financial,
      reputational: formData.reputational,
      operational: formData.operational,
      regulatory: formData.regulatory,
      weightedImpactScore: weightedScore,
    };

    let updatedAssessments: ImpactAssessmentType[];
    const existingIndex = assessments.findIndex(
      (a) => a.threatId === selectedThreat
    );
    if (existingIndex >= 0) {
      updatedAssessments = assessments.map((a, i) =>
        i === existingIndex ? newAssessment : a
      );
    } else {
      updatedAssessments = [...assessments, newAssessment];
    }

    setAssessments(updatedAssessments);
    saveImpactAssessments(updatedAssessments);

    setFormData({
      financial: 1,
      reputational: 1,
      operational: 1,
      regulatory: 1,
    });
    setSelectedThreat("");
  };

  // color for design ui
  const ImpactColor = (score: number) => {
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
          areas: financial, reputational, operational, and regulatory.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Assess Threat Impact
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Threat
            </label>
            <select
              required
              value={selectedThreat}
              onChange={(e) => setSelectedThreat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="">Choose a threat to assess</option>
              {threats.map((threat) => (
                <option key={threat.id} value={threat.id}>
                  {threat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      {score} - {ScoreLabel(score)} (
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
                      {score} - {ScoreLabel(score)} (
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
                      {score} - {ScoreLabel(score)} (
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
                      {score} - {ScoreLabel(score)} (
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-700">
                  Weighted Impact Score:
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${ImpactColor(
                  weightedImpactScoreCalculation({
                    threatId: selectedThreat,
                    financial: formData.financial,
                    reputational: formData.reputational,
                    operational: formData.operational,
                    regulatory: formData.regulatory,
                  })
                )}`}
              >
                {weightedImpactScoreCalculation({
                  threatId: selectedThreat,
                  financial: formData.financial,
                  reputational: formData.reputational,
                  operational: formData.operational,
                  regulatory: formData.regulatory,
                }).toFixed(1)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Formula: (Financial x 0.30) + (Reputational x 0.30) + (Operational
              x 0.20) + (Regulatory x 0.20)
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
                const threat = threats.find(
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
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${ImpactColor(
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
