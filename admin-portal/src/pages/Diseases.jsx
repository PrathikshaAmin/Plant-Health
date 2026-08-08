import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [diseaseName, setDiseaseName] = useState("");
  const [category, setCategory] = useState("");
  const [affectedArea, setAffectedArea] = useState("Leaf");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchDiseases = async () => {
    try {
      const response = await api.get("/diseases");
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
        await api.put(`/diseases/${editingId}`, payload);
      } else {
        await api.post("/diseases", payload);
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
      await api.delete(`/diseases/${id}`);
      fetchDiseases();
    } catch (err) {
      setError("Failed to delete disease");
    }
  };

  const inputStyle =
    "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";

  if (loading) return <p className="p-6">Loading diseases...</p>;

  return (
    <div>
      <Navbar />
      <div className="px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Disease Management
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Disease" : "Add New Disease"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Disease Name"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
              required
              className={inputStyle}
            />
            <input
              type="text"
              placeholder="Category (e.g. Fungal)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={inputStyle}
            />
            <select
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              className={inputStyle}
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
              className={inputStyle}
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition"
              >
                {editingId ? "Update Disease" : "Add Disease"}
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
                <th className="px-4 py-3">Affected Area</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease, i) => (
                <tr
                  key={disease._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-4 py-3 font-medium">
                    {disease.diseaseName}
                  </td>
                  <td className="px-4 py-3">{disease.category}</td>
                  <td className="px-4 py-3">
                    {disease.affectedArea.join(", ")}
                  </td>
                  <td className="px-4 py-3">{disease.description}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(disease)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(disease._id)}
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

export default Diseases;
