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
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 bg-white/90 backdrop-blur-xl border ${
        highlight
          ? "border-zinc-300 shadow-[0_6px_30px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]"
          : "border-zinc-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
      }`}
    >
      {/* Top subtle gloss sheen for premium touch */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] ${
          highlight
            ? "bg-zinc-950"
            : "bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
        } pointer-events-none`}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-medium">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${
            highlight
              ? "bg-zinc-950 text-white shadow-md border border-zinc-900"
              : "bg-zinc-100 text-zinc-900 border border-zinc-200/60"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-extrabold tracking-tight font-sans text-zinc-950">
          {value}
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center font-mono font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {trend.isPositive ? "↑ " : "↓ "}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-zinc-500 text-[11px] font-medium truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
