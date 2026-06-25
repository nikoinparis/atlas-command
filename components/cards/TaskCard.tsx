import { Badge } from "@/components/ui/Badge";
import type { Agent, Building, Task } from "@/lib/types/atlas";
import { formatCurrency, humanizeStatus, statusTone } from "@/lib/utils/format";

interface TaskCardProps {
  task: Task;
  agent?: Agent;
  building?: Building;
}

export function TaskCard({ task, agent, building }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{task.title}</div>
          <div className="mt-1 text-xs text-zinc-500">
            {agent?.name ?? "Unassigned"} · {building?.shortName ?? "Village"}
          </div>
        </div>
        <Badge className={statusTone[task.status]}>{humanizeStatus(task.status)}</Badge>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-400">{task.summary}</p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
        <span className="text-zinc-500">Estimated cost</span>
        <span className="font-mono text-zinc-100">{formatCurrency(task.costEstimate)}</span>
      </div>
      <div className="mt-2 text-xs text-zinc-500">{task.expectedValue}</div>
    </div>
  );
}
