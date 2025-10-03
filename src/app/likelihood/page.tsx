"use client";

import { useState, useEffect } from "react";
import {
  LikelihoodAssessment as LikelihoodAssessmentType,
  Threat,
} from "@/types";
import {
  calculateLikelihoodScore,
  getScoreLabel,
} from "@/utils/riskCalculations";
import {
  saveLikelihoodAssessments,
  loadLikelihoodAssessments,
  loadThreats,
} from "@/utils/localStorage";
import { User, Target, History, Calculator } from "lucide-react";

const sampleThreats: Threat[] = [
  {
    id: "T001",
    name: "Misconfigured Web Application Firewall",
    description: "WAF misconfiguration enabling SSRF attacks",
    category: "Cloud Infrastructure",
    owner: "Cloud Security Team",
    dateIdentified: "2024-07-16",
    status: "Open",
  },
  {
    id: "T002",
    name: "Inadequate Privileged Access Management",
    description: "Insufficient controls over privileged access",
    category: "Access Control",
    owner: "Identity & Access Management",
    dateIdentified: "2024-07-16",
    status: "Open",
  },
];

export default function LikelihoodAssessment() {
  const [assessments, setAssessments] = useState<LikelihoodAssessmentType[]>(
    []
  );
  const [threats, setThreats] = useState<Threat[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<string>("");
  const [formData, setFormData] = useState({
    threatActorCapability: 1,
    opportunity: 1,
    historicalPrecedent: 1,
  });

  // this function loads the data from localStorage on component mount
  useEffect(() => {
    const defaultAssessments: LikelihoodAssessmentType[] = [
      {
        threatId: "T001",
        threatActorCapability: 4,
        opportunity: 4,
        historicalPrecedent: 4,
        likelihoodScore: 4.0,
      },
    ];

    const savedAssessments = loadLikelihoodAssessments(defaultAssessments);
    const savedThreats = loadThreats();
    setAssessments(savedAssessments);
    setThreats(savedThreats);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThreat) return;

    const likelihoodScore = calculateLikelihoodScore({
      ...formData,
      threatId: selectedThreat,
    });
    const newAssessment: LikelihoodAssessmentType = {
      threatId: selectedThreat,
      threatActorCapability: formData.threatActorCapability,
      opportunity: formData.opportunity,
      historicalPrecedent: formData.historicalPrecedent,
      likelihoodScore: likelihoodScore,
    };

    let updatedAssessments: LikelihoodAssessmentType[];
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
    saveLikelihoodAssessments(updatedAssessments);

    setFormData({
      threatActorCapability: 1,
      opportunity: 1,
      historicalPrecedent: 1,
    });
    setSelectedThreat("");
  };

  const getLikelihoodColor = (score: number) => {
    if (score >= 4.5) return "text-red-600 bg-red-100";
    if (score >= 3.5) return "text-orange-600 bg-orange-100";
    if (score >= 2.5) return "text-yellow-600 bg-yellow-100";
    if (score >= 1.5) return "text-blue-600 bg-blue-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Likelihood Assessment
        </h1>
        <p className="text-gray-600 mt-2">
          Estimate the probability of threats occurring based on three key
          factors
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Assess Threat Likelihood
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
              {threats.map((threat) => (
                <option key={threat.id} value={threat.id}>
                  {threat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-5 w-5 text-red-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Threat Actor Capability
                </label>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="threatActorCapability"
                      value={score}
                      checked={formData.threatActorCapability === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          threatActorCapability: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "Script kiddies"
                        : score === 5
                        ? "Advanced persistent threats"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Opportunity
                </label>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="opportunity"
                      value={score}
                      checked={formData.opportunity === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opportunity: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "Highly secured"
                        : score === 5
                        ? "Wide open"
                        : ""}
                      )
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <History className="h-5 w-5 text-blue-600 mr-2" />
                <label className="text-sm font-medium text-gray-700">
                  Historical Precedent
                </label>
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label
                    key={score}
                    className="flex items-center text-gray-500"
                  >
                    <input
                      type="radio"
                      name="historicalPrecedent"
                      value={score}
                      checked={formData.historicalPrecedent === score}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          historicalPrecedent: parseInt(e.target.value),
                        })
                      }
                      className="mr-3"
                    />
                    <span className="text-sm">
                      {score} - {getScoreLabel(score)} (
                      {score === 1
                        ? "Never occurred"
                        : score === 5
                        ? "Frequent occurrence"
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
                  Likelihood Score:
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getLikelihoodColor(
                  calculateLikelihoodScore({
                    ...formData,
                    threatId: selectedThreat,
                  })
                )}`}
              >
                {calculateLikelihoodScore({
                  ...formData,
                  threatId: selectedThreat,
                }).toFixed(1)}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Formula: (Threat Actor Capability + Opportunity + Historical
              Precedent) ÷ 3
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

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Likelihood Assessment Factors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-red-600 mr-2" />
              <span className="font-medium text-gray-700">
                Threat Actor Capability
              </span>
            </div>
            <p className="text-gray-600">
              Various skills, resources, and motivation of potential threat
              actors
            </p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Target className="h-4 w-4 text-orange-600 mr-2" />
              <span className="font-medium text-gray-700">Opportunity</span>
            </div>
            <p className="text-gray-600">
              Availability of vulnerabilities and exposure of attack surfaces to
              the threat actor
            </p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <History className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium text-gray-700">
                Historical Precedent
              </span>
            </div>
            <p className="text-gray-600">
              Past incidents in the organization or any similar institutions
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Likelihood Assessment Results
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
                  Actor Capability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Historical Precedent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likelihood Score
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
                      {assessment.threatActorCapability}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.opportunity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.historicalPrecedent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getLikelihoodColor(
                          assessment.likelihoodScore
                        )}`}
                      >
                        {assessment.likelihoodScore.toFixed(1)}
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
