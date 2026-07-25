import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Treatments() {
  const [treatments, setTreatments] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [treatmentName, setTreatmentName] = useState("");
  const [category, setCategory] = useState("Chemical");
  const [description, setDescription] = useState("");
  const [dosage, setDosage] = useState("");
  const [applicationMethod, setApplicationMethod] = useState("");
  const [disease, setDisease] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchTreatments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/treatments");
      setTreatments(response.data);
    } catch (err) {
      setError("Failed to load treatments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDiseases = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/diseases");
      setDiseases(response.data);
      if (response.data.length > 0) setDisease(response.data[0]._id);
    } catch (err) {
      setError("Failed to load diseases for dropdown");
    }
  };

  useEffect(() => {
    fetchTreatments();
    fetchDiseases();
  }, []);

  const resetForm = () => {
    setTreatmentName("");
    setCategory("Chemical");
    setDescription("");
    setDosage("");
    setApplicationMethod("");
    setDisease(diseases[0]?._id || "");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      treatmentName,
      category,
      description,
      dosage,
      applicationMethod,
      disease,
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/treatments/${editingId}`,
          payload,
        );
      } else {
        await axios.post("http://localhost:5000/api/treatments", payload);
      }
      resetForm();
      fetchTreatments();
    } catch (err) {
      setError(
        editingId ? "Failed to update treatment" : "Failed to add treatment",
      );
    }
  };

  const handleEditClick = (treatment) => {
    setEditingId(treatment._id);
    setTreatmentName(treatment.treatmentName);
    setCategory(treatment.category);
    setDescription(treatment.description || "");
    setDosage(treatment.dosage || "");
    setApplicationMethod(treatment.applicationMethod || "");
    setDisease(treatment.disease?._id || treatment.disease);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this treatment?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/treatments/${id}`);
      fetchTreatments();
    } catch (err) {
      setError("Failed to delete treatment");
    }
  };

  if (loading) return <p>Loading treatments...</p>;

  return (
    <div>
      <Navbar />
      <h2>Treatment Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>{editingId ? "Edit Treatment" : "Add New Treatment"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Treatment Name"
          value={treatmentName}
          onChange={(e) => setTreatmentName(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Chemical">Chemical</option>
          <option value="Organic">Organic</option>
          <option value="Biological">Biological</option>
        </select>
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
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Application Method"
          value={applicationMethod}
          onChange={(e) => setApplicationMethod(e.target.value)}
        />
        <button type="submit">
          {editingId ? "Update Treatment" : "Add Treatment"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Treatments</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Disease</th>
            <th>Dosage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((treatment) => (
            <tr key={treatment._id}>
              <td>{treatment.treatmentName}</td>
              <td>{treatment.category}</td>
              <td>{treatment.disease?.diseaseName || "N/A"}</td>
              <td>{treatment.dosage}</td>
              <td>
                <button onClick={() => handleEditClick(treatment)}>Edit</button>
                <button onClick={() => handleDelete(treatment._id)}>
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

export default Treatments;
