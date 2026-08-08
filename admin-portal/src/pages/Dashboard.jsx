import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [counts, setCounts] = useState({
    diseases: 0,
    symptoms: 0,
    treatments: 0,
    rules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [diseasesRes, symptomsRes, treatmentsRes, rulesRes] =
          await Promise.all([
            api.get("/diseases"),
            api.get("/symptoms"),
            api.get("/treatments"),
            api.get("/diagnosis-rules"),
          ]);
        setCounts({
          diseases: diseasesRes.data.length,
          symptoms: symptomsRes.data.length,
          treatments: treatmentsRes.data.length,
          rules: rulesRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard counts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const cards = [
    {
      label: "Diseases",
      count: counts.diseases,
      path: "/diseases",
      icon: "🦠",
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Symptoms",
      count: counts.symptoms,
      path: "/symptoms",
      icon: "🍃",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Treatments",
      count: counts.treatments,
      path: "/treatments",
      icon: "💊",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Diagnosis Rules",
      count: counts.rules,
      path: "/rules",
      icon: "🧩",
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-1">
          Admin Dashboard
        </h2>
        <p className="text-gray-600 mb-6">
          Overview of your Plant Health knowledge base.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.path}
              className={`${card.color} rounded-lg p-5 shadow-sm hover:shadow-md transition block`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="text-2xl font-bold">
                {loading ? "..." : card.count}
              </div>
              <div className="text-sm font-medium mt-1">{card.label}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>
              Add Diseases and Symptoms first before creating Diagnosis Rules
            </li>
            <li>
              Each Diagnosis Rule links symptoms + severity to a disease with a
              match score
            </li>
            <li>Treatments should be linked to an existing Disease</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
