import { agents } from "@/lib/mock-data/agents";

export function getAgentById(agentId: string) {
  return agents.find((agent) => agent.id === agentId);
}

export function getAgentsByBuilding(buildingId: string) {
  return agents.filter((agent) => agent.buildingId === buildingId);
}
