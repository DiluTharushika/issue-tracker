import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FiHome,
  FiTag,
  FiPlusCircle,
  FiSettings,
  FiBarChart2,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

/**
 * Sidebar (Premium SaaS style)
 * - Glassmorphism backdrop
 * - Animated active indicator bar
 * - Section grouping with labels
 * - Profile card at the bottom with user name, role, and avatar
 */
interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  const profileName = user?.fullName || "Developer";
  const profileRole = user?.role || "Team Member";

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    nav("/login");
  };

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-blue-600/10 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-700/40 hover:text-slate-800 dark:hover:text-slate-200",
    ].join(" ");

  const activeBarClass = (isActive: boolean) =>
    [
      "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-all duration-200",
      isActive ? "bg-blue-600 dark:bg-blue-400" : "bg-transparent",
    ].join(" ");

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/issues", label: "Issues", icon: <FiTag /> },
    { to: "/analytics", label: "Analytics", icon: <FiBarChart2 /> },
    { to: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 h-full w-64 flex flex-col border-r border-white/60 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl transition-transform duration-300 shadow-[4px_0_30px_rgba(59,130,246,0.04)] ${
        isOpen ? "translate-x-0" : "max-md:-translate-x-full"
      }`}
    >
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
            N
          </div>
          <div>
            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Nexus SaaS</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              IssueTracker Pro
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="flex-1 overflow-y-auto glassy-scrollbar px-3 py-4 space-y-5">
        {/* Main section */}
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3">
            Main Menu
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={itemClass}
                onClick={() => setIsOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span className={activeBarClass(isActive)} />
                    <span className={`text-base transition-colors ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <FiChevronRight className="text-xs text-blue-500/50 dark:text-blue-400/40" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Action */}
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3">
            Quick Action
          </div>
          <NavLink
            to="/issues/new"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiPlusCircle className="text-base" />
            New Issue
          </NavLink>
        </div>
      </div>

      {/* Bottom: Profile Card + Logout */}
      <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 space-y-3">
        {/* Profile Card */}
        <div
          onClick={() => {
            setIsOpen(false);
            nav("/settings");
          }}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer group"
        >
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0 ring-2 ring-white/80 dark:ring-slate-800/80">
            {profileName.charAt(0).toUpperCase()}
          </div>
          {/* Name & Role */}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {profileName}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {profileRole}
            </div>
          </div>
          <FiChevronRight className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <FiLogOut className="text-sm" />
          Logout
        </button>
      </div>
    </aside>

  );
}