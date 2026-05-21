import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Topbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  console.log("Current theme:", theme);

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6">
      <div className="font-semibold text-slate-800 dark:text-slate-100">
        Issue Tracker
      </div>

      <button
        onClick={() => {
          console.log("Toggle clicked");
          toggleTheme();
        }}
        className="px-3 py-1 rounded-md border text-sm dark:border-slate-600"
      >
        {theme === "dark" ? "🌙 Dark (Active)" : "☀️ Light (Active)"}
      </button>
    </header>
  );
}