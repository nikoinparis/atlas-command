import { Bot, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type { Agent, Building } from "@/lib/types/atlas";
import { humanizeStatus, riskTone, statusTone } from "@/lib/utils/format";

interface AgentPanelProps {
  agent: Agent;
  building?: Building;
}

export function AgentPanel({ agent, building }: AgentPanelProps) {
  return (
    <Card className="p-4">
      <CardHeader eyebrow="Selected Agent" title={agent.name} action={<Bot className="text-cyan-200" size={17} />} />
      <CardBody>
        <div className="flex flex-wrap gap-2">
          <Badge className={statusTone[agent.status]}>{humanizeStatus(agent.status)}</Badge>
          <Badge className={riskTone[agent.riskLevel]}>{agent.riskLevel} risk</Badge>
          <Badge className="bg-white/[0.06] text-zinc-200 ring-white/10">{agent.modelTier}</Badge>
        </div>
        <div className="mt-4 text-sm font-medium text-white">{agent.title}</div>
        <p className="mt-2 text-xs leading-5 text-zinc-400">{agent.role}</p>
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-[11px] uppercase tracking-[0.08em] text-zinc-500">Current task</div>
          <div className="mt-1 text-xs leading-5 text-zinc-200">{agent.currentTask}</div>
        </div>
        <div className="mt-3 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-100">
            <ShieldCheck size={14} />
            Tool policy
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-400">{agent.toolPolicy}</p>
        </div>
        <div className="mt-3 text-xs text-zinc-500">Stationed at {building?.name ?? "the village"}.</div>
      </CardBody>
    </Card>
  );
}
