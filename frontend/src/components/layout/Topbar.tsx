
export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <div className="text-sm text-slate-500">IssueTracker Pro</div>
          <div className="text-base font-semibold text-slate-900">Workspace</div>
        </div>

        {/* Right side placeholder */}
        <div className="text-sm text-slate-600">v1.0</div>
      </div>
    </header>
  );
}