"use client";

import { AgentCard } from "@/components/cards/AgentCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type { Agent } from "@/lib/types/atlas";

interface CrewPanelProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function CrewPanel({ agents, selectedAgentId, onSelectAgent }: CrewPanelProps) {
  return (
    <Card className="flex min-h-0 flex-col p-4">
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
