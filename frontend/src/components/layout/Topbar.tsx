import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Topbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      <div className="font-semibold text-slate-800 dark:text-slate-100">
        Issue Tracker
      </div>

      <button
        onClick={toggleTheme}
        className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
      >
        {theme === "dark" ? "🌙 Dark (Active)" : "☀️ Light (Active)"}
      </button>
    </header>
  );
}