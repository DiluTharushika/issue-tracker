import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:bg-slate-900 dark:bg-none">
      <div className="flex h-full">
        {/* Mobile sidebar overlay backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300 animate-in fade-in"
          />
        )}

        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar setIsOpen={setIsSidebarOpen} />

          {/* Each page manages its own scroll */}
          <main className="flex-1 overflow-hidden px-4 sm:px-6 py-6">
            <div className="mx-auto h-full w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}