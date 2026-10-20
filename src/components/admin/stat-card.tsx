import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  highlight?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        highlight
          ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-white text-zinc-950 border border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Top subtle gloss sheen for premium touch */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-4">
        <span
          className={`text-xs font-mono uppercase tracking-wider ${
            highlight ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {title}
        </span>
        <div
          className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
            highlight
              ? "bg-zinc-800/80 text-cyan-400 border border-zinc-700/50"
              : "bg-zinc-100 text-zinc-800 border border-zinc-200"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div
          className={`text-3xl font-bold tracking-tight font-sans ${
            highlight ? "text-white" : "text-zinc-950"
          }`}
        >
          {value}
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-mono font-medium px-1.5 py-0.5 rounded text-[10px] ${
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              }`}
            >
              {trend.isPositive ? "↑ " : "↓ "}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span
              className={`${
                highlight ? "text-zinc-400" : "text-zinc-500"
              } text-[11px] truncate`}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
