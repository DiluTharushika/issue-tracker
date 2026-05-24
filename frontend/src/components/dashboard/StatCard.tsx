import type { ReactNode } from "react";
import Card from "../ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  subText?: string;
  accent?: "blue" | "red" | "amber" | "emerald" | "solid-blue";
  icon?: ReactNode;
  trendText?: string;
  trendUp?: boolean;
  onClick?: () => void;
};

const accentMap = {
  blue: {
    border: "border-t-blue-500",
    iconBg: "bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400",
  },
  red: {
    border: "border-t-red-500",
    iconBg: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
  },
  amber: {
    border: "border-t-amber-500",
    iconBg: "bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400",
  },
  emerald: {
    border: "border-t-emerald-500",
    iconBg: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  "solid-blue": {
    border: "border-transparent",
    iconBg: "bg-white/20 text-white",
  },
};

export default function StatCard({
  label,
  value,
  subText,
  accent = "blue",
  icon,
  trendText,
  trendUp = true,
  onClick,
}: StatCardProps) {
  const styles = accentMap[accent];
  const isSolid = accent === "solid-blue";

  return (
    <Card 
      onClick={onClick}
      className={`relative overflow-hidden p-5 flex flex-col justify-between border-t-4 ${styles.border} ${
        isSolid ? "bg-blue-600 dark:bg-blue-600 text-white border-none shadow-md" : "bg-transparent"
      } ${onClick ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className={`text-sm font-medium ${isSolid ? "text-blue-100" : "text-slate-600 dark:text-slate-400"}`}>
          {label}
        </div>
        {icon && (
          <div className={`h-8 w-8 rounded-md flex items-center justify-center text-lg ${styles.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className={`text-3xl font-bold tracking-tight ${isSolid ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {value}
        </div>
        
        {(subText || trendText) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
            {trendText && (
              <span className={`flex items-center ${
                isSolid 
                  ? "text-blue-100" 
                  : trendUp 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-red-600 dark:text-red-400"
              }`}>
                {trendUp ? "↑" : "↓"} {trendText}
              </span>
            )}
            {subText && (
              <span className={isSolid ? "text-blue-200" : "text-slate-500 dark:text-slate-400"}>
                {subText}
              </span>
            )}
          </div>
        )}
      </div>

      {isSolid && (
        <div className="absolute -bottom-6 -right-6 text-blue-500/30 dark:text-blue-500/20">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )}
    </Card>
  );
}