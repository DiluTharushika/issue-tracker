import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

/**
 * Reusable input with label + error.
 * Reason: consistent styles across Login/Register/Forms.
 */
export default function Input({ label, error, className = "", ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        {...props}
        className={[
          "w-full rounded-md border bg-white px-3 py-2 text-sm outline-none",
          "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "",
          className,
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}