import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Symptoms() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [symptomName, setSymptomName] = useState("");
  const [description, setDescription] = useState("");
  const [affectedArea, setAffectedArea] = useState("Leaf");

  const [editingId, setEditingId] = useState(null);

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/symptoms");
      setSymptoms(response.data);
    } catch (err) {
      setError("Failed to load symptoms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const resetForm = () => {
    setSymptomName("");
    setDescription("");
    setAffectedArea("Leaf");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { symptomName, description, affectedArea };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/symptoms/${editingId}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:5000/api/symptoms", payload);
      }
      resetForm();
      fetchSymptoms();
    } catch (err) {
      setError(
        editingId ? "Failed to update symptom" : "Failed to add symptom",
      );
    }
  };

  const handleEditClick = (symptom) => {
    setEditingId(symptom._id);
    setSymptomName(symptom.symptomName);
    setDescription(symptom.description || "");
    setAffectedArea(symptom.affectedArea);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this symptom?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/symptoms/${id}`);
      fetchSymptoms();
    } catch (err) {
      setError("Failed to delete symptom");
    }
  };

  if (loading) return <p>Loading symptoms...</p>;

  return (
    <div>
      <Navbar />
      <h2>Symptom Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>{editingId ? "Edit Symptom" : "Add New Symptom"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Symptom Name"
          value={symptomName}
          onChange={(e) => setSymptomName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={affectedArea}
          onChange={(e) => setAffectedArea(e.target.value)}
        >
          <option value="Leaf">Leaf</option>
          <option value="Stem">Stem</option>
          <option value="Root">Root</option>
          <option value="Fruit">Fruit</option>
        </select>
        <button type="submit">
          {editingId ? "Update Symptom" : "Add Symptom"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Symptoms</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Affected Area</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {symptoms.map((symptom) => (
            <tr key={symptom._id}>
              <td>{symptom.symptomName}</td>
              <td>{symptom.description}</td>
              <td>{symptom.affectedArea}</td>
              <td>
                <button onClick={() => handleEditClick(symptom)}>Edit</button>
                <button onClick={() => handleDelete(symptom._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Symptoms;
