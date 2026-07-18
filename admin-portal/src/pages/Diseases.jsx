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

  const handleAddDisease = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/diseases", {
        diseaseName,
        category,
        affectedArea: [affectedArea],
        description,
      });

      setDiseaseName("");
      setCategory("");
      setDescription("");

      fetchDiseases();
    } catch (err) {
      setError("Failed to add disease");
    }
  };

  if (loading) return <p>Loading diseases...</p>;

  return (
    <div>
      <Navbar />
      <h2>Disease Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Add New Disease</h3>
      <form onSubmit={handleAddDisease}>
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
        <button type="submit">Add Disease</button>
      </form>

      <h3>Existing Diseases</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Affected Area</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {diseases.map((disease) => (
            <tr key={disease._id}>
              <td>{disease.diseaseName}</td>
              <td>{disease.category}</td>
              <td>{disease.affectedArea.join(", ")}</td>
              <td>{disease.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Diseases;
