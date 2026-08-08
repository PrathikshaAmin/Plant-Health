import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function Rules() {
  const [rules, setRules] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [affectedArea, setAffectedArea] = useState("Leaf");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState("Low");
  const [disease, setDisease] = useState("");
  const [matchScore, setMatchScore] = useState(50);

  const [editingId, setEditingId] = useState(null);

  const fetchRules = async () => {
    try {
      const response = await api.get("/diagnosis-rules");
      setRules(response.data);
    } catch (err) {
      setError("Failed to load rules");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [symptomsRes, diseasesRes] = await Promise.all([
        api.get("/symptoms"),
        api.get("/diseases"),
      ]);
      setSymptoms(symptomsRes.data);
      setDiseases(diseasesRes.data);
      if (diseasesRes.data.length > 0) setDisease(diseasesRes.data[0]._id);
    } catch (err) {
      setError("Failed to load symptoms/diseases for form");
    }
  };

  useEffect(() => {
    fetchRules();
    fetchDropdownData();
  }, []);

  const resetForm = () => {
    setAffectedArea("Leaf");
    setSelectedSymptoms([]);
    setSeverity("Low");
    setDisease(diseases[0]?._id || "");
    setMatchScore(50);
    setEditingId(null);
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }
    const payload = {
      affectedArea,
      symptoms: selectedSymptoms,
      severity,
      disease,
      matchScore: Number(matchScore),
    };

    try {
      if (editingId) {
        await api.put(`/diagnosis-rules/${editingId}`, payload);
      } else {
        await api.post("/diagnosis-rules", payload);
      }
      resetForm();
      fetchRules();
    } catch (err) {
      setError(editingId ? "Failed to update rule" : "Failed to add rule");
    }
  };

  const handleEditClick = (rule) => {
    setEditingId(rule._id);
    setAffectedArea(rule.affectedArea);
    setSelectedSymptoms(rule.symptoms.map((s) => s._id));
    setSeverity(rule.severity);
    setDisease(rule.disease?._id || rule.disease);
    setMatchScore(rule.matchScore);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this rule?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/diagnosis-rules/${id}`);
      fetchRules();
    } catch (err) {
      setError("Failed to delete rule");
    }
  };

  const inputStyle =
    "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";

  if (loading) return <p className="p-6">Loading rules...</p>;

  return (
    <div>
      <Navbar />
      <div className="px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Diagnosis Rule Management
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Rule" : "Add New Rule"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affected Area
                </label>
                <select
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                  className={`${inputStyle} w-full`}
                >
                  <option value="Leaf">Leaf</option>
                  <option value="Stem">Stem</option>
                  <option value="Root">Root</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Whole Plant">Whole Plant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className={`${inputStyle} w-full`}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Match Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={matchScore}
                  onChange={(e) => setMatchScore(e.target.value)}
                  required
                  className={`${inputStyle} w-full`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disease
              </label>
              <select
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                required
                className={`${inputStyle} w-full md:w-1/2`}
              >
                {diseases.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.diseaseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (select all that apply)
              </label>
              <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded border border-gray-200">
                {symptoms.map((symptom) => (
                  <label
                    key={symptom._id}
                    className="flex items-center gap-1.5 text-sm bg-white px-3 py-1.5 rounded border border-gray-300 cursor-pointer hover:bg-green-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom._id)}
                      onChange={() => toggleSymptom(symptom._id)}
                    />
                    {symptom.symptomName}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition"
              >
                {editingId ? "Update Rule" : "Add Rule"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3">Affected Area</th>
                <th className="px-4 py-3">Symptoms</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Disease</th>
                <th className="px-4 py-3">Match Score</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <tr
                  key={rule._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-4 py-3">{rule.affectedArea}</td>
                  <td className="px-4 py-3">
                    {rule.symptoms.map((s) => s.symptomName).join(", ")}
                  </td>
                  <td className="px-4 py-3">{rule.severity}</td>
                  <td className="px-4 py-3">
                    {rule.disease?.diseaseName || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-medium">{rule.matchScore}%</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(rule)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
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

export default Rules;
