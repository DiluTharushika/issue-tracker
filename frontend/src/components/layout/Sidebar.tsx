import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import {
  FiHome,
  FiTag,
  FiPlusCircle,
  FiSettings,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

/**
 * Sidebar (SaaS style)
 * - Icons
 * - Active indicator bar
 * - Section grouping
 */
export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
      "text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-700/60 hover:text-blue-700 dark:hover:text-slate-100",
      isActive ? "bg-blue-100/80 dark:bg-slate-700/80 text-blue-700 dark:text-slate-100" : "",
    ].join(" ");

  const activeBarClass = (isActive: boolean) =>
    [
      "absolute left-0 top-2 h-6 w-1 rounded-r",
      isActive ? "bg-blue-600" : "bg-transparent",
    ].join(" ");

  return (
    <aside className="h-full w-64 border-r border-white/60 dark:border-slate-700 bg-white/50 dark:bg-slate-800 backdrop-blur-2xl transition-colors duration-300 shadow-[4px_0_30px_rgba(59,130,246,0.06)]">
      {/* Brand */}
      <div className="px-5 py-5">
        <div className="text-xs font-semibold text-blue-600">Nexus SaaS</div>
        <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
          IssueTracker Pro
        </div>
      </div>

      {/* Nav */}
      <div className="px-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
          Workspace
        </div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" className={itemClass}>
            {({ isActive }) => (
              <>
                <span className={activeBarClass(isActive)} />
                <FiHome className="text-lg" />
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink to="/issues" className={itemClass}>
            {({ isActive }) => (
              <>
                <span className={activeBarClass(isActive)} />
                <FiTag className="text-lg" />
                <span>Issues</span>
              </>
            )}
          </NavLink>

          {/* Optional pages (keep now for screenshot parity) */}
          <NavLink to="/analytics" className={itemClass}>
            {({ isActive }) => (
              <>
                <span className={activeBarClass(isActive)} />
                <FiBarChart2 className="text-lg" />
                <span>Analytics</span>
              </>
            )}
          </NavLink>

          <NavLink to="/settings" className={itemClass}>
            {({ isActive }) => (
              <>
                <span className={activeBarClass(isActive)} />
                <FiSettings className="text-lg" />
                <span>Settings</span>
              </>
            )}
          </NavLink>
        </nav>

        <div className="mt-4 px-3">
          <NavLink
            to="/issues/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            <FiPlusCircle className="text-lg" />
            New Issue
          </NavLink>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 w-64 p-4 space-y-2">
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <FiLogOut />
          Logout
        </Button>
      </div>
    </aside>
  );
}