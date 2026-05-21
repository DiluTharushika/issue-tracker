/**
 * StatusCard Component
 * Used in Dashboard to display issue counts.
 */

type StatusCardProps = {
  title: string;
  count: number;
  color: string;
};

export default function StatusCard({ title, count, color }: StatusCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>
        {count}
      </div>
    </div>
  );
}