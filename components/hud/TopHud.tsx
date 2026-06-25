import { AlertTriangle, Bot, Coins, ReceiptText, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import { BudgetBar } from "@/components/hud/BudgetBar";
import { approvals, tasks, treasuryRecord } from "@/lib/mock-data";
import { getProfit } from "@/lib/finance/treasuryCalculations";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";

export function TopHud() {
  const activeTasks = tasks.filter((task) =>
    ["queued", "running", "waiting_approval"].includes(task.status),
  ).length;
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending").length;
  const riskAlerts = approvals.filter(
    (approval) => approval.riskLevel === "high" || approval.riskLevel === "critical",
  ).length;
  const profit = getProfit(treasuryRecord);

  const stats = [
    { label: "Cash", value: formatCurrency(treasuryRecord.cashOnHand), icon: Wallet, tone: "cyan" },
    { label: "Revenue", value: formatCurrency(treasuryRecord.revenueMTD), icon: Coins, tone: "emerald" },
    { label: "Expenses", value: formatCurrency(treasuryRecord.expensesMTD), icon: ReceiptText, tone: "zinc" },
    { label: "AI Spend", value: formatCurrency(treasuryRecord.aiSpendMTD), icon: Bot, tone: "amber" },
    { label: "Tasks", value: String(activeTasks), icon: Bot, tone: "zinc" },
    { label: "Approvals", value: String(pendingApprovals), icon: ShieldAlert, tone: "amber" },
    { label: "Risk", value: String(riskAlerts), icon: AlertTriangle, tone: "rose" },
  ] as const;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-zinc-950/70 px-3 py-2 shadow-[0_12px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-wide text-white">Atlas Command</h1>
            <p className="truncate text-[11px] text-zinc-400">Day 1 · mock village · approval-gated</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 lg:justify-center lg:pb-0">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-lg border bg-black/25 px-3",
                  stat.tone === "cyan" && "border-cyan-300/25 text-cyan-100",
                  stat.tone === "emerald" && "border-emerald-300/25 text-emerald-100",
                  stat.tone === "amber" && "border-amber-300/25 text-amber-100",
                  stat.tone === "rose" && "border-rose-300/25 text-rose-100",
                  stat.tone === "zinc" && "border-white/10 text-zinc-100",
                )}
                key={stat.label}
              >
                <Icon className="shrink-0 opacity-80" size={14} />
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-500">
                    {stat.label}
                  </div>
                  <div className="font-mono text-sm font-semibold text-white">{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="min-w-[190px]">
          <BudgetBar record={treasuryRecord} />
          <div className="mt-1 text-right text-[10px] text-zinc-500">
            {profit >= 0 ? "positive MTD" : "early loss visible"}
          </div>
        </div>
      </div>
    </header>
  );
}
