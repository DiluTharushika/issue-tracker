import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function AppLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900">
          <Topbar />

          <main className="p-6 text-slate-800 dark:text-slate-100">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}