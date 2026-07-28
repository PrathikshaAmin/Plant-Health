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

  const inputStyle =
    "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";

  if (loading) return <p className="p-6">Loading treatments...</p>;

  return (
    <div>
      <Navbar />
      <div className="px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Treatment Management
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Treatment" : "Add New Treatment"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Treatment Name"
              value={treatmentName}
              onChange={(e) => setTreatmentName(e.target.value)}
              required
              className={inputStyle}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputStyle}
            >
              <option value="Chemical">Chemical</option>
              <option value="Organic">Organic</option>
              <option value="Biological">Biological</option>
            </select>
            <select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              required
              className={inputStyle}
            >
              {diseases.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.diseaseName}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className={inputStyle}
            />
            <input
              type="text"
              placeholder="Application Method"
              value={applicationMethod}
              onChange={(e) => setApplicationMethod(e.target.value)}
              className={inputStyle}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition"
              >
                {editingId ? "Update Treatment" : "Add Treatment"}
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Disease</th>
                <th className="px-4 py-3">Dosage</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treatment, i) => (
                <tr
                  key={treatment._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-4 py-3 font-medium">
                    {treatment.treatmentName}
                  </td>
                  <td className="px-4 py-3">{treatment.category}</td>
                  <td className="px-4 py-3">
                    {treatment.disease?.diseaseName || "N/A"}
                  </td>
                  <td className="px-4 py-3">{treatment.dosage}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(treatment)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(treatment._id)}
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

export default Treatments;
