import { useState, useEffect } from "react";
import axios from "axios";
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
      const response = await axios.get(
        "http://localhost:5000/api/diagnosis-rules",
      );
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
        axios.get("http://localhost:5000/api/symptoms"),
        axios.get("http://localhost:5000/api/diseases"),
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

  // Toggles a symptom checkbox on/off in the selectedSymptoms array
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
        await axios.put(
          `http://localhost:5000/api/diagnosis-rules/${editingId}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:5000/api/diagnosis-rules", payload);
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
      await axios.delete(`http://localhost:5000/api/diagnosis-rules/${id}`);
      fetchRules();
    } catch (err) {
      setError("Failed to delete rule");
    }
  };

  if (loading) return <p>Loading rules...</p>;

  return (
    <div>
      <Navbar />
      <h2>Diagnosis Rule Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>{editingId ? "Edit Rule" : "Add New Rule"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Affected Area: </label>
          <select
            value={affectedArea}
            onChange={(e) => setAffectedArea(e.target.value)}
          >
            <option value="Leaf">Leaf</option>
            <option value="Stem">Stem</option>
            <option value="Root">Root</option>
            <option value="Fruit">Fruit</option>
            <option value="Whole Plant">Whole Plant</option>
          </select>
        </div>

        <div>
          <label>Symptoms (select all that apply):</label>
          <br />
          {symptoms.map((symptom) => (
            <label key={symptom._id} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom._id)}
                onChange={() => toggleSymptom(symptom._id)}
              />
              {symptom.symptomName}
            </label>
          ))}
        </div>

        <div>
          <label>Severity: </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label>Disease: </label>
          <select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            required
          >
            {diseases.map((d) => (
              <option key={d._id} value={d._id}>
                {d.diseaseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Match Score (0-100): </label>
          <input
            type="number"
            min="0"
            max="100"
            value={matchScore}
            onChange={(e) => setMatchScore(e.target.value)}
            required
          />
        </div>

        <button type="submit">{editingId ? "Update Rule" : "Add Rule"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Rules</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Affected Area</th>
            <th>Symptoms</th>
            <th>Severity</th>
            <th>Disease</th>
            <th>Match Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule._id}>
              <td>{rule.affectedArea}</td>
              <td>{rule.symptoms.map((s) => s.symptomName).join(", ")}</td>
              <td>{rule.severity}</td>
              <td>{rule.disease?.diseaseName || "N/A"}</td>
              <td>{rule.matchScore}%</td>
              <td>
                <button onClick={() => handleEditClick(rule)}>Edit</button>
                <button onClick={() => handleDelete(rule._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rules;
