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

  const inputStyle =
    "border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500";

  if (loading) return <p className="p-6">Loading symptoms...</p>;

  return (
    <div>
      <Navbar />
      <div className="px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Symptom Management
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Symptom" : "Add New Symptom"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Symptom Name"
              value={symptomName}
              onChange={(e) => setSymptomName(e.target.value)}
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
            </select>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputStyle} md:col-span-2`}
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition"
              >
                {editingId ? "Update Symptom" : "Add Symptom"}
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
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Affected Area</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.map((symptom, i) => (
                <tr
                  key={symptom._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-green-50"}
                >
                  <td className="px-4 py-3 font-medium">
                    {symptom.symptomName}
                  </td>
                  <td className="px-4 py-3">{symptom.description}</td>
                  <td className="px-4 py-3">{symptom.affectedArea}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(symptom)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(symptom._id)}
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

export default Symptoms;
