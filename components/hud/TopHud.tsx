import { AlertTriangle, Bot, Coins, ReceiptText, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import { BudgetBar } from "@/components/hud/BudgetBar";
import { MetricCard } from "@/components/cards/MetricCard";
import { approvals, tasks, treasuryRecord } from "@/lib/mock-data";
import { getProfit } from "@/lib/finance/treasuryCalculations";
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

  return (
    <header className="relative z-10 border-b border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-wide text-white">Atlas Command</h1>
            <p className="truncate text-xs text-zinc-400">Day 1 · Local mock session · approval-gated mode</p>
          </div>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4 xl:max-w-3xl">
          <MetricCard icon={<Wallet size={15} />} label="Cash" tone="cyan" value={formatCurrency(treasuryRecord.cashOnHand)} />
          <MetricCard icon={<Coins size={15} />} label="Revenue" tone="emerald" value={formatCurrency(treasuryRecord.revenueMTD)} />
          <MetricCard icon={<ReceiptText size={15} />} label="Expenses" value={formatCurrency(treasuryRecord.expensesMTD)} />
          <MetricCard
            detail={profit >= 0 ? "positive MTD" : "expected early loss"}
            icon={<Bot size={15} />}
            label="AI spend"
            tone="amber"
            value={formatCurrency(treasuryRecord.aiSpendMTD)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BudgetBar record={treasuryRecord} />
          <div className="grid grid-cols-3 gap-2">
            <MetricCard icon={<Bot size={15} />} label="Tasks" value={activeTasks} />
            <MetricCard icon={<ShieldAlert size={15} />} label="Approvals" tone="amber" value={pendingApprovals} />
            <MetricCard icon={<AlertTriangle size={15} />} label="Risk" tone="rose" value={riskAlerts} />
          </div>
        </div>
      </div>
    </header>
  );
}
