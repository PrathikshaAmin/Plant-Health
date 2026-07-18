import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [diseaseName, setDiseaseName] = useState("");
  const [category, setCategory] = useState("");
  const [affectedArea, setAffectedArea] = useState("Leaf");
  const [description, setDescription] = useState("");

  // Tracks which disease is being edited (null = adding a new one instead)
  const [editingId, setEditingId] = useState(null);

  const fetchDiseases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/diseases");
      setDiseases(response.data);
    } catch (err) {
      setError("Failed to load diseases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const resetForm = () => {
    setDiseaseName("");
    setCategory("");
    setAffectedArea("Leaf");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      diseaseName,
      category,
      affectedArea: [affectedArea],
      description,
    };

    try {
      if (editingId) {
        // Update existing disease
        await axios.put(
          `http://localhost:5000/api/diseases/${editingId}`,
          payload,
        );
      } else {
        // Create new disease
        await axios.post("http://localhost:5000/api/diseases", payload);
      }
      resetForm();
      fetchDiseases();
    } catch (err) {
      setError(
        editingId ? "Failed to update disease" : "Failed to add disease",
      );
    }
  };

  const handleEditClick = (disease) => {
    setEditingId(disease._id);
    setDiseaseName(disease.diseaseName);
    setCategory(disease.category);
    setAffectedArea(disease.affectedArea[0] || "Leaf");
    setDescription(disease.description);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this disease?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/diseases/${id}`);
      fetchDiseases();
    } catch (err) {
      setError("Failed to delete disease");
    }
  };

  if (loading) return <p>Loading diseases...</p>;

  return (
    <div>
      <Navbar />
      <h2>Disease Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>{editingId ? "Edit Disease" : "Add New Disease"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Disease Name"
          value={diseaseName}
          onChange={(e) => setDiseaseName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category (e.g. Fungal)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
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
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Update Disease" : "Add Disease"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Diseases</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Affected Area</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {diseases.map((disease) => (
            <tr key={disease._id}>
              <td>{disease.diseaseName}</td>
              <td>{disease.category}</td>
              <td>{disease.affectedArea.join(", ")}</td>
              <td>{disease.description}</td>
              <td>
                <button onClick={() => handleEditClick(disease)}>Edit</button>
                <button onClick={() => handleDelete(disease._id)}>
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

export default Diseases;
