import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { FiSun, FiMoon, FiBell, FiSearch, FiMenu } from "react-icons/fi";

/**
 * Topbar - Premium SaaS navigation bar
 * - Dynamic page title based on route
 * - Search bar
 * - Notification bell
 * - Theme toggle
 * - Profile avatar badge
 */
interface Props {
  setIsOpen: (open: boolean) => void;
}

export default function Topbar({ setIsOpen }: Props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const profileName = user?.fullName || "Developer";

  const currentSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync search input value with URL parameter changes (e.g., if cleared elsewhere)
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (location.pathname !== "/issues") {
      navigate(`/issues?search=${encodeURIComponent(val)}`);
    } else {
      navigate(`/issues?search=${encodeURIComponent(val)}`, { replace: true });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/issues?search=${encodeURIComponent(searchValue)}`);
  };

  // Dynamic page title and subtitle
  const getPageMeta = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return { title: "Dashboard Overview", subtitle: "Tracking performance for the v2.0 Release Cycle" };
    if (path.startsWith("/issues/new")) return { title: "Create Issue", subtitle: "Fill in details and submit a new issue" };
    if (path.startsWith("/issues")) return { title: "Issues", subtitle: "Manage and track all project issues" };
    if (path.startsWith("/analytics")) return { title: "Analytics", subtitle: "Monitor resolution velocity and team productivity" };
    if (path.startsWith("/settings")) return { title: "Settings", subtitle: "Manage your profile, preferences, and integrations" };
    return { title: "IssueTracker Pro", subtitle: "Manage and track your project tasks" };
  };

  const pageMeta = getPageMeta();

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Left: Hamburger menu + Page title */}
      <div className="flex items-center min-w-0">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 mr-3 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition md:hidden cursor-pointer shrink-0"
          title="Open Menu"
        >
          <FiMenu className="text-sm" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
            {pageMeta.title}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5 hidden sm:block">
            {pageMeta.subtitle}
          </p>
        </div>
      </div>


      {/* Right: Action controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-slate-50/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 text-sm w-56 transition hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-blue-500/60 dark:focus-within:border-slate-600">
          <FiSearch className="text-xs shrink-0" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchValue}
            onChange={handleSearchChange}
            className="bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full"
          />
        </form>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer">
          <FiBell className="text-sm" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <FiMoon className="text-sm" /> : <FiSun className="text-sm" />}
        </button>

        {/* Profile Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-white/80 dark:ring-slate-800/80 cursor-pointer">
          {profileName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}