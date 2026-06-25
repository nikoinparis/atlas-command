import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface MetricCardProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
  tone?: "cyan" | "emerald" | "amber" | "rose" | "zinc";
}

const toneClass = {
  cyan: "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-100",
  emerald: "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-100",
  amber: "border-amber-300/20 bg-amber-300/[0.07] text-amber-100",
  rose: "border-rose-300/20 bg-rose-300/[0.07] text-rose-100",
  zinc: "border-white/10 bg-white/[0.05] text-zinc-100",
};

export function MetricCard({ label, value, detail, icon, tone = "zinc" }: MetricCardProps) {
  return (
    <div className={cn("rounded-lg border p-3", toneClass[tone])}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
          {label}
        </span>
        {icon ? <span className="text-current opacity-80">{icon}</span> : null}
      </div>
      <div className="mt-2 font-mono text-xl font-semibold text-white">{value}</div>
      {detail ? <div className="mt-1 text-xs text-zinc-400">{detail}</div> : null}
    </div>
  );
}
