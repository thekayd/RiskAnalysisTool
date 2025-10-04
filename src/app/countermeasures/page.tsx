"use client";

import { useState, useEffect } from "react";
import { Countermeasure, NISTFunction, Threat, RiskCalculation } from "@/types";
import {
  calculateResidualRiskScore,
  validateEffectiveness,
} from "@/utils/riskCalculations";
import {
  saveCountermeasures,
  loadCountermeasures,
  loadThreats,
  loadRiskCalculations,
} from "@/utils/localStorage";
import { Plus, Edit, Trash2, Clock, DollarSign, Target } from "lucide-react";

const nistFunctions: NISTFunction[] = [
  "Identify",
  "Protect",
  "Detect",
  "Respond",
  "Recover",
];

export default function Countermeasures() {
  const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [riskCalculations, setRiskCalculations] = useState<RiskCalculation[]>(
    []
  );

  // this function loads the data from localStorage on component mount
  useEffect(() => {
    const CountermeasuresData: Countermeasure[] = [
      {
        threatId: "T001",
        description:
          "Implement Cloud Security Posture Management tools with Infrastructural security reviews",
        nistFunction: "Protect",
        implementationTimeline: "3-6 months",
        estimatedCost: "R150,000 - R300,000",
        effectivenessPercentage: 75,
        totalRiskScore: 19.2,
        residualRiskScore: 4.8,
      },
    ];

    const savedCountermeasures = loadCountermeasures(CountermeasuresData);
    const savedThreats = loadThreats();
    const savedRiskCalculations = loadRiskCalculations();
    setCountermeasures(savedCountermeasures);
    setThreats(savedThreats);
    setRiskCalculations(savedRiskCalculations);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingCountermeasure, setEditingCountermeasure] =
    useState<Countermeasure | null>(null);
  const [formData, setFormData] = useState({
    threatId: "",
    description: "",
    nistFunction: "Protect" as NISTFunction,
    implementationTimeline: "",
    estimatedCost: "",
    effectivenessPercentage: 50,
  });

  // handles the submission of the countermeasure form as well as to edit it
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.threatId ||
      !validateEffectiveness(formData.effectivenessPercentage)
    )
      return;

    // this then gets the total risk score for the selected threat
    const riskCalculation = riskCalculations.find(
      (r) => r.threatId === formData.threatId
    );
    const totalRiskScore = riskCalculation ? riskCalculation.totalRiskScore : 0;
    const residualRiskScore = calculateResidualRiskScore(
      totalRiskScore,
      formData.effectivenessPercentage
    );

    // this then creates a new countermeasure and adds it to the array with the total risk and residual scores
    const newCountermeasure: Countermeasure = {
      ...formData,
      totalRiskScore,
      residualRiskScore,
    };

    // this then updates the countermeaseures array with new ones
    let updatedCountermeasures: Countermeasure[];
    if (editingCountermeasure) {
      updatedCountermeasures = countermeasures.map((c) =>
        c.threatId === editingCountermeasure.threatId ? newCountermeasure : c
      );
      setEditingCountermeasure(null);
    } else {
      updatedCountermeasures = [...countermeasures, newCountermeasure];
    }

    setCountermeasures(updatedCountermeasures);
    saveCountermeasures(updatedCountermeasures);

    setFormData({
      threatId: "",
      description: "",
      nistFunction: "Protect",
      implementationTimeline: "",
      estimatedCost: "",
      effectivenessPercentage: 50,
    });
    setShowForm(false);
  };

  // this then edits the countermeasure
  const handleEdit = (countermeasure: Countermeasure) => {
    setEditingCountermeasure(countermeasure);
    setFormData({
      threatId: countermeasure.threatId,
      description: countermeasure.description,
      nistFunction: countermeasure.nistFunction,
      implementationTimeline: countermeasure.implementationTimeline,
      estimatedCost: countermeasure.estimatedCost,
      effectivenessPercentage: countermeasure.effectivenessPercentage,
    });
    setShowForm(true);
  };

  // this then handles the deletion of the countermeasure
  const handleDelete = (threatId: string) => {
    const updatedCountermeasures = countermeasures.filter(
      (c) => c.threatId !== threatId
    );
    setCountermeasures(updatedCountermeasures);
    saveCountermeasures(updatedCountermeasures);
  };

  //color handling for residual risks
  const ResidualRiskColors = (score: number) => {
    if (score >= 20) return "text-red-600 bg-red-100";
    if (score >= 13) return "text-orange-600 bg-orange-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  // this is for the information of the nist functions, just giving them different colors
  const NISTColor = (NISTFunction: NISTFunction) => {
    switch (NISTFunction) {
      case "Identify":
        return "bg-blue-100 text-blue-800";
      case "Protect":
        return "bg-green-100 text-green-800";
      case "Detect":
        return "bg-yellow-100 text-yellow-800";
      case "Respond":
        return "bg-orange-100 text-orange-800";
      case "Recover":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Countermeasures & Residual Risk
          </h1>
          <p className="text-gray-600 mt-2">
            Define security controls to mitigate identified risks and calculate
            residual risk
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Countermeasure
        </button>
      </div>

      {/*shows the form when editing or adding a new countermeasure*/}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCountermeasure
              ? "Edit Countermeasure"
              : "Add New Countermeasure"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threat
                </label>
                <select
                  required
                  value={formData.threatId}
                  onChange={(e) =>
                    setFormData({ ...formData, threatId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">Select a threat</option>
                  {threats.map((threat) => (
                    <option key={threat.id} value={threat.id}>
                      {threat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIST Function
                </label>
                <select
                  required
                  value={formData.nistFunction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nistFunction: e.target.value as NISTFunction,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                >
                  {nistFunctions.map((func) => (
                    <option key={func} value={func}>
                      {func}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Countermeasure Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                placeholder="Describe the security control or countermeasure"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Implementation Timeline
                </label>
                <input
                  type="text"
                  required
                  value={formData.implementationTimeline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      implementationTimeline: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="e.g., 3-6 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Cost
                </label>
                <input
                  type="text"
                  required
                  value={formData.estimatedCost}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedCost: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="e.g., R100,000 - R200,000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effectiveness %
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  max="95"
                  value={formData.effectivenessPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      effectivenessPercentage: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="20-95"
                />
              </div>
            </div>

            {formData.threatId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-700">
                      Residual Risk Score:
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${ResidualRiskColors(
                      calculateResidualRiskScore(
                        (() => {
                          const currentRiskCalculation = riskCalculations.find(
                            (r) => r.threatId === formData.threatId
                          );
                          return currentRiskCalculation
                            ? currentRiskCalculation.totalRiskScore
                            : 0;
                        })(),
                        formData.effectivenessPercentage
                      )
                    )}`}
                  >
                    {calculateResidualRiskScore(
                      (() => {
                        const currentRiskCalculation = riskCalculations.find(
                          (r) => r.threatId === formData.threatId
                        );
                        return currentRiskCalculation
                          ? currentRiskCalculation.totalRiskScore
                          : 0;
                      })(),
                      formData.effectivenessPercentage
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Formula: Total Risk Score x (1 - Effectiveness%)
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCountermeasure(null);
                  setFormData({
                    threatId: "",
                    description: "",
                    nistFunction: "Protect",
                    implementationTimeline: "",
                    estimatedCost: "",
                    effectivenessPercentage: 50,
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingCountermeasure
                  ? "Update Countermeasure"
                  : "Add Countermeasure"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          NIST Cybersecurity Framework Functions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-2">
              Identify
            </span>
            <span className="text-gray-600">Risk assessment</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-2">
              Protect
            </span>
            <span className="text-gray-600">Security controls</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-2">
              Detect
            </span>
            <span className="text-gray-600">Threat detection</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 mr-2">
              Respond
            </span>
            <span className="text-gray-600">Incident response</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mr-2">
              Recover
            </span>
            <span className="text-gray-600">Mitigation planning</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Countermeasures ({countermeasures.length})
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
                  Countermeasure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIST Function
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effectiveness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Residual Risk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {countermeasures.map((countermeasure) => {
                const threat = threats.find(
                  (t) => t.id === countermeasure.threatId
                );
                return (
                  <tr
                    key={countermeasure.threatId}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {threat?.name || "Unknown Threat"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {countermeasure.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${NISTColor(
                          countermeasure.nistFunction
                        )}`}
                      >
                        {countermeasure.nistFunction}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {countermeasure.implementationTimeline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {countermeasure.estimatedCost}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {countermeasure.effectivenessPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${ResidualRiskColors(
                          countermeasure.residualRiskScore
                        )}`}
                      >
                        {countermeasure.residualRiskScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(countermeasure)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(countermeasure.threatId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">
          Effectiveness Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mr-3">
              20-40%
            </span>
            <span className="text-gray-600">Low effectiveness</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mr-3">
              40-60%
            </span>
            <span className="text-gray-600">Medium effectiveness</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-3">
              60-80%
            </span>
            <span className="text-gray-600">High effectiveness</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-3">
              80-95%
            </span>
            <span className="text-gray-600">Very high effectiveness</span>
          </div>
        </div>
      </div>
    </div>
  );
}
