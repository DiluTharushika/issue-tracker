type Props = {
  open: number;
  inProgress: number;
  resolved: number;
};

function Row({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DistributionCard({ open, inProgress, resolved }: Props) {
  const total = open + inProgress + resolved;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors">
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Distribution
      </div>
      <div className="mt-4 space-y-4">
        <Row label="Open" value={open} total={total} color="bg-blue-600" />
        <Row label="In Progress" value={inProgress} total={total} color="bg-amber-500" />
        <Row label="Resolved" value={resolved} total={total} color="bg-emerald-600" />
      </div>
    </div>
  );
}