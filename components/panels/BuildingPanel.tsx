import { Building2, Coins, ReceiptText, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/cards/MetricCard";
import { TaskCard } from "@/components/cards/TaskCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type { Agent, Approval, Building, Task } from "@/lib/types/atlas";
import { formatCurrency, formatPercent, humanizeStatus, riskTone, statusTone } from "@/lib/utils/format";

interface BuildingPanelProps {
  building: Building;
  manager?: Agent;
  tasks: Task[];
  approvals: Approval[];
}

export function BuildingPanel({ building, manager, tasks, approvals }: BuildingPanelProps) {
  const completed = tasks.filter((task) => task.status === "completed");
  const active = tasks.filter((task) => task.status !== "completed");
  const roiText = building.roi < 0 ? "learning" : formatPercent(building.roi);

  return (
    <Card className="flex min-h-0 flex-col p-4">
      <CardHeader eyebrow="Building" title={building.name} action={<Building2 className="text-cyan-200" size={18} />} />
      <CardBody className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          <Badge className={statusTone[building.status]}>{humanizeStatus(building.status)}</Badge>
          <Badge className={riskTone[building.riskLevel]}>{building.riskLevel} risk</Badge>
          <Badge className="bg-white/[0.06] text-zinc-200 ring-white/10">Level {building.level}</Badge>
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-400">{building.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <MetricCard icon={<Coins size={14} />} label="Revenue" tone="emerald" value={formatCurrency(building.revenueMTD)} />
          <MetricCard icon={<ReceiptText size={14} />} label="Expense" value={formatCurrency(building.expensesMTD)} />
          <MetricCard icon={<TrendingUp size={14} />} label="ROI" tone={building.roi > 0 ? "emerald" : "amber"} value={roiText} />
        </div>
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Manager agent</div>
          <div className="mt-1 text-sm font-semibold text-white">{manager?.name ?? "Unassigned"}</div>
          <p className="mt-1 text-xs leading-5 text-zinc-400">{manager?.role}</p>
        </div>
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Recommended next action</div>
          <p className="mt-1 text-xs leading-5 text-cyan-100">{building.recommendedAction}</p>
        </div>
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Current tasks</div>
          <div className="mt-2 space-y-2">
            {active.length ? (
              active.map((task) => <TaskCard agent={manager} building={building} key={task.id} task={task} />)
            ) : (
              <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-xs text-zinc-500">
                No active tasks for this building.
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-zinc-500">Completed tasks</div>
            <div className="mt-1 font-mono text-lg text-white">{completed.length}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="text-zinc-500">Pending approvals</div>
            <div className="mt-1 font-mono text-lg text-white">{approvals.length}</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Bottlenecks</div>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            {approvals.length
              ? "Human approval is the intentional bottleneck for any external action."
              : "No hard bottleneck in mock mode; real integrations should add durable task checkpoints."}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
