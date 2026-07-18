import { useState, useEffect } from "react";
import axios from "axios";

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchDiseases();
  }, []); // empty array = run this once, when the page first loads

  if (loading) return <p>Loading diseases...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Disease Management</h2>
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
