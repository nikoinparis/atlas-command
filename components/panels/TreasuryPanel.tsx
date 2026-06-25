import { Activity, Coins, Landmark, LineChart, ShieldAlert, Wallet } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";
import { BudgetBar } from "@/components/hud/BudgetBar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { aiUsageLog, buildings, costEvents, experiments, revenueEvents, treasuryRecord } from "@/lib/mock-data";
import {
  getBudgetUsage,
  getCostByBuilding,
  getProfit,
  getRoiByExperiment,
} from "@/lib/finance/treasuryCalculations";
import { formatCurrency, formatPercent, riskTone } from "@/lib/utils/format";

export function TreasuryPanel() {
  const profit = getProfit(treasuryRecord);
  const budgetUsage = getBudgetUsage(treasuryRecord);
  const costByBuilding = getCostByBuilding(costEvents);
  const roiByExperiment = getRoiByExperiment(experiments, revenueEvents, costEvents);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <CardHeader eyebrow="Finance" title="Treasury Dashboard" action={<Landmark className="text-cyan-200" size={18} />} />
        <CardBody>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <MetricCard icon={<Wallet size={15} />} label="Cash" tone="cyan" value={formatCurrency(treasuryRecord.cashOnHand)} />
            <MetricCard icon={<Coins size={15} />} label="Revenue" tone="emerald" value={formatCurrency(treasuryRecord.revenueMTD)} />
            <MetricCard label="Expenses" value={formatCurrency(treasuryRecord.expensesMTD)} />
            <MetricCard label="AI spend" tone={budgetUsage >= 0.7 ? "amber" : "zinc"} value={formatCurrency(treasuryRecord.aiSpendMTD)} />
            <MetricCard label="Hosting" value={formatCurrency(treasuryRecord.hostingSpendMTD)} />
            <MetricCard label="Profit" tone={profit >= 0 ? "emerald" : "rose"} value={formatCurrency(profit)} />
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
            <BudgetBar record={treasuryRecord} />
            <div className="mt-3 grid gap-2 text-xs md:grid-cols-3">
              <div className="text-zinc-400">Daily cap: {formatCurrency(treasuryRecord.dailyAIBudget)}</div>
              <div className="text-zinc-400">Task cap: {formatCurrency(treasuryRecord.maxCostPerTask)}</div>
              <div className="text-zinc-400">
                Approval above: {formatCurrency(treasuryRecord.requireApprovalAbove)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-4">
          <CardHeader eyebrow="Experiments" title="Revenue, Cost, ROI" action={<LineChart className="text-emerald-200" size={18} />} />
          <CardBody className="space-y-2">
            {roiByExperiment.map((experiment) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3" key={experiment.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{experiment.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">{experiment.hypothesis}</div>
                  </div>
                  <Badge className={riskTone[experiment.riskLevel]}>{experiment.riskLevel}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-zinc-500">Revenue</div>
                    <div className="font-mono text-zinc-100">{formatCurrency(experiment.totalRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">Cost</div>
                    <div className="font-mono text-zinc-100">{formatCurrency(experiment.totalCost)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500">ROI</div>
                    <div className="font-mono text-zinc-100">{formatPercent(experiment.roi)}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardHeader eyebrow="Allocation" title="Atlas Paper Mode" action={<ShieldAlert className="text-amber-200" size={18} />} />
          <CardBody>
            <div className="rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-xs leading-5 text-amber-50">
              Decision-support only. No live trading, no brokerage connection, and no investment action without manual approval.
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["VTI", 55],
                ["VXUS", 25],
                ["BND", 15],
                ["SGOV", 5],
              ].map(([ticker, weight]) => (
                <div key={ticker}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-200">{ticker}</span>
                    <span className="text-zinc-500">{weight}% paper weight</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${weight}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MetricCard icon={<Activity size={14} />} label="Mock Sharpe" value="1.18" />
              <MetricCard label="Max drawdown" tone="amber" value="-20.6%" />
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <CardHeader eyebrow="Costs" title="Cost By Building" />
          <CardBody className="space-y-2">
            {Object.entries(costByBuilding).map(([buildingId, amount]) => {
              const building = buildings.find((item) => item.id === buildingId);
              return (
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm" key={buildingId}>
                  <span className="text-zinc-300">{building?.shortName ?? buildingId}</span>
                  <span className="font-mono text-zinc-100">{formatCurrency(amount)}</span>
                </div>
              );
            })}
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardHeader eyebrow="Usage" title="AI Usage Log" />
          <CardBody className="space-y-2">
            {aiUsageLog.map((item) => (
              <div className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm" key={item.id}>
                <div className="min-w-0">
                  <div className="truncate text-zinc-200">{item.agent} · {item.task}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase text-zinc-500">{item.model}</div>
                </div>
                <div className="font-mono text-zinc-100">{formatCurrency(item.cost)}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
