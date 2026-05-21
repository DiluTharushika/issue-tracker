import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
    ].join(" ");

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
      <div className="p-5">
        <div className="text-xs font-semibold text-blue-600">
          Nexus SaaS
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Issue Tracker
        </div>
      </div>

      <nav className="px-3 space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/issues" className={linkClass}>
          Issues
        </NavLink>

        <NavLink to="/issues/new" className={linkClass}>
          + Create Issue
        </NavLink>
      </nav>

      <div className="absolute bottom-0 w-64 p-4">
        <Button variant="secondary" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
}