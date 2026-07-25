import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Diseases from "./pages/Diseases";
import Symptoms from "./pages/Symptoms";
import Treatments from "./pages/Treatments";
import Rules from "./pages/Rules";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/diseases" element={<Diseases />} />
      <Route path="/symptoms" element={<Symptoms />} />
      <Route path="/treatments" element={<Treatments />} />
      <Route path="/rules" element={<Rules />} />
    </Routes>
  );
}

export default App;
