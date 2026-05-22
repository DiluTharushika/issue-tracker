import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    // Full viewport height + prevent the page itself from scrolling
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="flex h-full">
        {/* Sidebar stays fixed height */}
        <Sidebar />

        {/* Right side */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar fixed */}
          <Topbar />

          {/* Only this area scrolls */}
          <main className="flex-1 overflow-y-auto px-6 py-6 text-slate-800 dark:text-slate-100">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}