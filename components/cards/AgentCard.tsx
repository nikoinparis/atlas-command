"use client";

import { Badge } from "@/components/ui/Badge";
import type { Agent } from "@/lib/types/atlas";
import { cn } from "@/lib/utils/cn";
import { humanizeStatus, riskTone, statusDot, statusTone } from "@/lib/utils/format";

interface AgentCardProps {
  agent: Agent;
  selected?: boolean;
  onSelect?: (agentId: string) => void;
}

export function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className={cn("mt-1 h-2.5 w-2.5 rounded-full shadow-[0_0_16px_currentColor]", statusDot[agent.status])} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-semibold text-white">{agent.name}</div>
            <span className="font-mono text-[10px] uppercase text-zinc-500">{agent.modelTier}</span>
          </div>
          <div className="truncate text-xs text-zinc-400">{agent.title}</div>
          <div className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">{agent.currentTask}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge className={statusTone[agent.status]}>{humanizeStatus(agent.status)}</Badge>
        <Badge className={riskTone[agent.riskLevel]}>{agent.riskLevel}</Badge>
      </div>
    </>
  );

  const className = cn(
    "w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.07]",
    selected && "border-cyan-300/50 bg-cyan-300/[0.08]",
  );

  if (!onSelect) {
    return <article className={className}>{content}</article>;
  }

  return (
    <button
      className={cn(
        className,
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/40",
      )}
      onClick={() => onSelect?.(agent.id)}
      type="button"
    >
      {content}
    </button>
  );
}
