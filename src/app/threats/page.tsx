"use client";

import { useState } from "react";
import { Threat, ThreatCategory } from "@/types";
import { generateThreatId } from "@/utils/riskCalculations";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

const threatCategories: ThreatCategory[] = [
  "Cloud Infrastructure",
  "Access Control",
  "Insider Threat",
  "Third-Party",
  "Malware",
  "Phishing",
  "Data Exposure",
  "Regulatory Compliance",
  "Other",
];

export default function ThreatRegister() {
  const [threats, setThreats] = useState<Threat[]>([
    {
      id: "T001",
      name: "Misconfigured Web Application Firewall",
      description:
        "WAF misconfiguration enabling SSRF attacks and unauthorized access to cloud infrastructure",
      category: "Cloud Infrastructure",
      owner: "Cloud Security Team",
      dateIdentified: "2024-01-15",
      status: "Open",
    },
    {
      id: "T002",
      name: "Inadequate Privileged Access Management",
      description:
        "Insufficient controls over privileged access leading to unauthorized escalation and data access",
      category: "Access Control",
      owner: "Identity & Access Management",
      dateIdentified: "2024-01-15",
      status: "Open",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingThreat, setEditingThreat] = useState<Threat | null>(null);
  const [formData, setFormData] = useState<Omit<Threat, "id">>({
    name: "",
    description: "",
    category: "Cloud Infrastructure",
    owner: "",
    dateIdentified: new Date().toISOString().split("T")[0],
    status: "Open",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingThreat) {
      setThreats(
        threats.map((t) =>
          t.id === editingThreat.id ? { ...formData, id: editingThreat.id } : t
        )
      );
      setEditingThreat(null);
    } else {
      const newThreat: Threat = {
        ...formData,
        id: generateThreatId(threats.length),
      };
      setThreats([...threats, newThreat]);
    }

    setFormData({
      name: "",
      description: "",
      category: "Cloud Infrastructure",
      owner: "",
      dateIdentified: new Date().toISOString().split("T")[0],
      status: "Open",
    });
    setShowForm(false);
  };

  const handleEdit = (threat: Threat) => {
    setEditingThreat(threat);
    setFormData({
      name: threat.name,
      description: threat.description,
      category: threat.category,
      owner: threat.owner,
      dateIdentified: threat.dateIdentified,
      status: threat.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setThreats(threats.filter((t) => t.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      case "Mitigated":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Threat Register</h1>
          <p className="text-gray-600 mt-2">
            Identify and document potential cybersecurity threats to your
            organization
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Threat
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingThreat ? "Edit Threat" : "Add New Threat"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threat Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Enter threat name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ThreatCategory,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  {threatCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                placeholder="Describe the threat in detail"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner *
                </label>
                <input
                  type="text"
                  required
                  value={formData.owner}
                  onChange={(e) =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Responsible team/person"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Identified *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateIdentified}
                  onChange={(e) =>
                    setFormData({ ...formData, dateIdentified: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Threat["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Mitigated">Mitigated</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingThreat(null);
                  setFormData({
                    name: "",
                    description: "",
                    category: "Cloud Infrastructure",
                    owner: "",
                    dateIdentified: new Date().toISOString().split("T")[0],
                    status: "Open",
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
                {editingThreat ? "Update Threat" : "Add Threat"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Threats Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Registered Threats ({threats.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threat ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {threats.map((threat) => (
                <tr key={threat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {threat.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {threat.name}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {threat.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {threat.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {threat.owner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        threat.status
                      )}`}
                    >
                      {threat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {threat.dateIdentified}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(threat)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(threat.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
