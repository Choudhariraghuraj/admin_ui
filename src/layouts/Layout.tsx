// src/components/Layout.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Users", path: "/users" },
  { label: "Settings", path: "/settings" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-700 text-white justify-between">
        <div>
          <div className="p-6 text-xl font-bold border-b border-blue-500">
            Admin Panel
          </div>
          <nav className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-left px-4 py-2 rounded-md hover:bg-blue-600 ${
                  location.pathname === item.path ? "bg-blue-900" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Logout */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Topbar - Mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-blue-700 text-white flex items-center justify-between px-4 py-3 z-50">
        <FaBars onClick={() => setMobileOpen(!mobileOpen)} />
        <span className="text-lg font-bold">Admin</span>
        <FaSignOutAlt onClick={handleLogout} className="text-lg cursor-pointer" />
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden fixed top-12 left-0 w-full bg-blue-700 text-white z-40 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md hover:bg-blue-600 ${
                location.pathname === item.path ? "bg-blue-900" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md mt-2"
          >
            🚪 Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto mt-12 md:mt-0 p-6">{children}</main>
    </div>
  );
};

export default Layout;
