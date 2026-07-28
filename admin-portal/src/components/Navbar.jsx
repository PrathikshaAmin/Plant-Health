import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = "text-gray-700 hover:text-green-700 font-medium";

  return (
    <nav className="bg-white shadow-sm px-6 py-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-green-800">
          🌿 Plant Health Admin
        </span>
        <Link to="/dashboard" className={linkStyle}>
          Dashboard
        </Link>
        <Link to="/diseases" className={linkStyle}>
          Diseases
        </Link>
        <Link to="/symptoms" className={linkStyle}>
          Symptoms
        </Link>
        <Link to="/treatments" className={linkStyle}>
          Treatments
        </Link>
        <Link to="/rules" className={linkStyle}>
          Rules
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
