import { Menu } from "lucide-react";

interface TopbarProps {
  toggleSidebar: () => void;
}

export const Topbar = ({ toggleSidebar }: TopbarProps) => {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-4 md:ml-64">
      <button className="md:hidden" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
};
