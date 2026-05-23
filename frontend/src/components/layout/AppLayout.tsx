import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="flex h-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          {/* ✅ No main scrollbar */}
          <main className="flex-1 overflow-hidden px-6 py-6">
            <div className="mx-auto h-full w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}