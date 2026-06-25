"use client";

import { useCallback, useMemo, useState } from "react";
import { VillageCanvas } from "@/components/game/VillageCanvas";
import { CrewPanel } from "@/components/hud/CrewPanel";
import { EventLog } from "@/components/hud/EventLog";
import { TopHud } from "@/components/hud/TopHud";
import { Sidebar } from "@/components/layout/Sidebar";
import { AgentPanel } from "@/components/panels/AgentPanel";
import { BuildingPanel } from "@/components/panels/BuildingPanel";
import { ChatPanel } from "@/components/panels/ChatPanel";
import { agents, approvals, buildings, tasks } from "@/lib/mock-data";

export function AppShell() {
  const [selectedBuildingId, setSelectedBuildingId] = useState("keep-hall");
  const [selectedAgentId, setSelectedAgentId] = useState("atlas");

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? buildings[0],
    [selectedBuildingId],
  );
  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0],
    [selectedAgentId],
  );
  const manager = useMemo(
    () => agents.find((agent) => agent.id === selectedBuilding.managerAgentId),
    [selectedBuilding],
  );
  const selectedTasks = useMemo(
    () => tasks.filter((task) => task.buildingId === selectedBuilding.id),
    [selectedBuilding],
  );
  const selectedApprovals = useMemo(
    () => approvals.filter((approval) => approval.buildingId === selectedBuilding.id),
    [selectedBuilding],
  );
  const agentBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedAgent.buildingId),
    [selectedAgent],
  );

  const selectBuilding = useCallback((buildingId: string) => {
    setSelectedBuildingId(buildingId);
    const building = buildings.find((item) => item.id === buildingId);
    if (building) {
      setSelectedAgentId(building.managerAgentId);
    }
  }, []);

  const selectAgent = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    const agent = agents.find((item) => item.id === agentId);
    if (agent) {
      setSelectedBuildingId(agent.buildingId);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111b] text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(140deg,#06111d_0%,#0b1f26_45%,#121117_100%)]" />
      <TopHud />
      <main className="mx-auto grid h-[calc(100vh-88px)] max-w-[1800px] gap-3 overflow-hidden p-3 xl:grid-cols-[282px_minmax(0,1fr)_410px] xl:grid-rows-[minmax(0,1fr)_220px]">
        <aside className="flex min-h-0 flex-col gap-3 xl:row-span-2">
          <Sidebar />
          <CrewPanel agents={agents} onSelectAgent={selectAgent} selectedAgentId={selectedAgentId} />
        </aside>
        <section className="min-h-0 min-w-0">
          <VillageCanvas
            buildings={buildings}
            onSelectBuilding={selectBuilding}
            selectedBuildingId={selectedBuildingId}
          />
        </section>
        <aside className="min-h-0 space-y-3 overflow-y-auto pr-1 xl:row-span-2">
          <AgentPanel agent={selectedAgent} building={agentBuilding} />
          <BuildingPanel
            approvals={selectedApprovals}
            building={selectedBuilding}
            manager={manager}
            tasks={selectedTasks}
          />
          <ChatPanel selectedBuilding={selectedBuilding} />
        </aside>
        <section className="min-w-0 xl:col-start-2">
          <EventLog />
        </section>
      </main>
    </div>
  );
}
