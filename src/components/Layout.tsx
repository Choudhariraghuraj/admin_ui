import { ReactNode, useState } from "react";
import  Sidebar from "./Sidebar";
import { Topbar } from "./Topbar";

export const Layout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:ml-64">{children}</main>
      </div>
    </div>
  );
};
