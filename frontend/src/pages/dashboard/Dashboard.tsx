/**
 * Dashboard (UI only for now).
 * Next step we will add counts from backend.
 */
export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-600">Track your issues and priorities.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Open</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">—</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">In Progress</div>
          <div className="mt-2 text-2xl font-bold text-amber-600">—</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-500">Resolved</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">—</div>
        </div>
      </div>
    </div>
  );
}