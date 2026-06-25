"use client";

import { AgentCard } from "@/components/cards/AgentCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type { Agent } from "@/lib/types/atlas";
import { cn } from "@/lib/utils/cn";

interface CrewPanelProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
  className?: string;
}

export function CrewPanel({ agents, selectedAgentId, onSelectAgent, className }: CrewPanelProps) {
  return (
    <Card className={cn("flex min-h-0 flex-col p-4", className)}>
      <CardHeader eyebrow="Roster" title="Agent Crew" />
      <CardBody className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {agents.map((agent) => (
          <AgentCard
            agent={agent}
            key={agent.id}
            onSelect={onSelectAgent}
            selected={agent.id === selectedAgentId}
          />
        ))}
      </CardBody>
    </Card>
  );
}
