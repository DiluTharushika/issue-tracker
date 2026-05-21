import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Topbar />

          <main className="p-6 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}