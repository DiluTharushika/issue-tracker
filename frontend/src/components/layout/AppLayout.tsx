import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Topbar />

          <main className="px-6 py-6 text-slate-800 dark:text-slate-100">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}