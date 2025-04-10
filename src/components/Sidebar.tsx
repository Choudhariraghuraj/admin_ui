import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle =
    "block px-4 py-3 text-gray-700 hover:bg-gray-200 rounded transition";

  return (
    <aside className="w-full max-w-[220px] min-h-screen bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkStyle}>🏠 Home</Link>
        <Link to="/users" className={linkStyle}>👥 Users</Link>
        <Link to="/settings" className={linkStyle}>⚙️ Settings</Link>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
