import type { AgentStatus, BuildingStatus, RiskLevel, TaskStatus } from "@/lib/types/atlas";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function humanizeStatus(status: string) {
  return status.replace(/_/g, " ");
}

export const statusTone: Record<BuildingStatus | AgentStatus | TaskStatus, string> = {
  idle: "bg-zinc-500/15 text-zinc-200 ring-zinc-400/30",
  thinking: "bg-cyan-500/15 text-cyan-100 ring-cyan-300/30",
  working: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
  waiting_approval: "bg-amber-500/15 text-amber-100 ring-amber-300/35",
  blocked: "bg-orange-500/15 text-orange-100 ring-orange-300/35",
  error: "bg-rose-500/15 text-rose-100 ring-rose-300/35",
  upgrading: "bg-sky-500/15 text-sky-100 ring-sky-300/35",
  completed: "bg-teal-500/15 text-teal-100 ring-teal-300/35",
  queued: "bg-indigo-500/15 text-indigo-100 ring-indigo-300/30",
  running: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
  rejected: "bg-zinc-600/30 text-zinc-200 ring-zinc-500/35",
};

export const riskTone: Record<RiskLevel, string> = {
  low: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
  medium: "bg-amber-500/15 text-amber-100 ring-amber-300/30",
  high: "bg-orange-500/15 text-orange-100 ring-orange-300/35",
  critical: "bg-rose-500/15 text-rose-100 ring-rose-300/35",
};

export const statusDot: Record<BuildingStatus | AgentStatus | TaskStatus, string> = {
  idle: "bg-zinc-400",
  thinking: "bg-cyan-300",
  working: "bg-emerald-300",
  waiting_approval: "bg-amber-300",
  blocked: "bg-orange-300",
  error: "bg-rose-300",
  upgrading: "bg-sky-300",
  completed: "bg-teal-300",
  queued: "bg-indigo-300",
  running: "bg-emerald-300",
  rejected: "bg-zinc-500",
};
