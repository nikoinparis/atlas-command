"use client";

import { useCallback, useMemo, useState } from "react";
import { Bot, ChevronLeft, PanelRightClose, ScrollText, UsersRound, X } from "lucide-react";
import { VillageCanvas } from "@/components/game/VillageCanvas";
import { CrewPanel } from "@/components/hud/CrewPanel";
import { EventLog } from "@/components/hud/EventLog";
import { TopHud } from "@/components/hud/TopHud";
import { BottomDock } from "@/components/layout/BottomDock";
import { AgentPanel } from "@/components/panels/AgentPanel";
import { BuildingPanel } from "@/components/panels/BuildingPanel";
import { ChatPanel } from "@/components/panels/ChatPanel";
import { Button } from "@/components/ui/Button";
import { agents, approvals, buildings, tasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";

export function AppShell() {
  const [selectedBuildingId, setSelectedBuildingId] = useState("keep-hall");
  const [selectedAgentId, setSelectedAgentId] = useState("atlas");
  const [crewOpen, setCrewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(false);

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
    setDetailsOpen(true);
    const building = buildings.find((item) => item.id === buildingId);
    if (building) {
      setSelectedAgentId(building.managerAgentId);
    }
  }, []);

  const selectAgent = useCallback((agentId: string) => {
    setSelectedAgentId(agentId);
    setDetailsOpen(true);
    const agent = agents.find((item) => item.id === agentId);
    if (agent) {
      setSelectedBuildingId(agent.buildingId);
    }
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#102115] text-white">
      <TopHud />
      <main className="absolute inset-0">
        <VillageCanvas
          buildings={buildings}
          className="h-full w-full"
          onSelectBuilding={selectBuilding}
          selectedBuildingId={selectedBuildingId}
          variant="immersive"
        />

        <div className="pointer-events-none fixed inset-x-0 top-[86px] z-50 mx-auto flex max-w-[1800px] items-start justify-between px-3">
          <Button
            className="pointer-events-auto shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            icon={<UsersRound size={15} />}
            onClick={() => setCrewOpen(true)}
            size="sm"
            variant="primary"
          >
            Crew
          </Button>
          <div className="flex gap-2">
            <Button
              className="pointer-events-auto shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              icon={<PanelRightClose size={15} />}
              onClick={() => setDetailsOpen((open) => !open)}
              size="sm"
            >
              Details
            </Button>
            <Button
              className="pointer-events-auto shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              icon={<ScrollText size={15} />}
              onClick={() => setLogOpen((open) => !open)}
              size="sm"
            >
              Log
            </Button>
          </div>
        </div>

        <aside
          className={cn(
            "fixed bottom-24 left-3 top-[92px] z-30 w-[min(360px,calc(100vw-1.5rem))] transition-transform duration-300",
            crewOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
          )}
        >
          <div className="mb-2 flex justify-end">
            <Button aria-label="Close crew drawer" icon={<ChevronLeft size={15} />} onClick={() => setCrewOpen(false)} size="sm">
              Hide
            </Button>
          </div>
          <div className="h-[calc(100%-42px)]">
            <CrewPanel agents={agents} onSelectAgent={selectAgent} selectedAgentId={selectedAgentId} />
          </div>
        </aside>

        <aside
          className={cn(
            "fixed bottom-24 right-3 top-[92px] z-30 w-[min(470px,calc(100vw-1.5rem))] transition-transform duration-300",
            detailsOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
          )}
        >
          <div className="mb-2 flex items-center justify-between rounded-lg border border-white/10 bg-zinc-950/75 px-3 py-2 backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-2">
              <Bot className="text-cyan-200" size={15} />
              <span className="truncate text-xs font-medium text-zinc-200">
                {selectedBuilding.shortName} · {selectedAgent.name}
              </span>
            </div>
            <Button aria-label="Close details panel" icon={<X size={15} />} onClick={() => setDetailsOpen(false)} size="icon" variant="ghost" />
          </div>
          <div className="h-[calc(100%-50px)] space-y-3 overflow-y-auto pr-1">
          <AgentPanel agent={selectedAgent} building={agentBuilding} />
          <BuildingPanel
            approvals={selectedApprovals}
            building={selectedBuilding}
            manager={manager}
            tasks={selectedTasks}
          />
          <ChatPanel selectedBuilding={selectedBuilding} />
          </div>
        </aside>

        <section
          className={cn(
            "fixed inset-x-3 bottom-24 z-30 mx-auto max-w-[1180px] transition-transform duration-300",
            logOpen ? "translate-y-0" : "translate-y-[calc(100%+7rem)]",
          )}
        >
          <EventLog />
        </section>
      </main>
      <BottomDock />
    </div>
  );
}
