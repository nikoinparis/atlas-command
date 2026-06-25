"use client";

import { useCallback, useMemo, useState } from "react";
import { Bot, MousePointer2, PanelRightClose, ScrollText, UsersRound, X } from "lucide-react";
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
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [crewOpen, setCrewOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? null,
    [selectedBuildingId],
  );
  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [selectedAgentId],
  );
  const manager = useMemo(
    () => agents.find((agent) => agent.id === selectedBuilding?.managerAgentId),
    [selectedBuilding],
  );
  const selectedTasks = useMemo(
    () => (selectedBuilding ? tasks.filter((task) => task.buildingId === selectedBuilding.id) : []),
    [selectedBuilding],
  );
  const selectedApprovals = useMemo(
    () =>
      selectedBuilding
        ? approvals.filter((approval) => approval.buildingId === selectedBuilding.id)
        : [],
    [selectedBuilding],
  );
  const agentBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedAgent?.buildingId),
    [selectedAgent],
  );
  const sidePanelClass =
    "fixed bottom-[104px] top-[156px] z-30 rounded-xl border border-white/[0.12] bg-zinc-950/[0.58] shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl transition-transform duration-300";

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

        <div className="pointer-events-none fixed inset-x-0 top-[104px] z-50 mx-auto flex max-w-[1800px] items-start justify-between px-3">
          <div className="pointer-events-auto rounded-xl border border-white/10 bg-zinc-950/[0.52] p-1 shadow-[0_12px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <Button
              aria-pressed={crewOpen}
              icon={<UsersRound size={15} />}
              onClick={() => setCrewOpen((open) => !open)}
              size="sm"
              variant={crewOpen ? "primary" : "secondary"}
            >
              Crew
            </Button>
          </div>
          <div className="pointer-events-auto flex gap-1 rounded-xl border border-white/10 bg-zinc-950/[0.52] p-1 shadow-[0_12px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
            <Button
              aria-pressed={detailsOpen}
              icon={<PanelRightClose size={15} />}
              onClick={() => setDetailsOpen((open) => !open)}
              size="sm"
              variant={detailsOpen ? "primary" : "secondary"}
            >
              Details
            </Button>
            <Button
              aria-pressed={logOpen}
              icon={<ScrollText size={15} />}
              onClick={() => setLogOpen((open) => !open)}
              size="sm"
              variant={logOpen ? "primary" : "secondary"}
            >
              Log
            </Button>
          </div>
        </div>

        <aside
          className={cn(
            sidePanelClass,
            "left-3 w-[min(360px,calc(100vw-1.5rem))]",
            crewOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",
          )}
        >
          <CrewPanel
            agents={agents}
            className="h-full border-white/0 bg-transparent shadow-none backdrop-blur-0"
            onSelectAgent={selectAgent}
            selectedAgentId={selectedAgentId}
          />
        </aside>

        <aside
          className={cn(
            sidePanelClass,
            "right-3 w-[min(470px,calc(100vw-1.5rem))]",
            detailsOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
          )}
        >
          <div className="flex h-full min-h-0 flex-col p-3">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <Bot className="text-cyan-200" size={15} />
                <span className="truncate text-xs font-medium text-zinc-200">
                  {selectedBuilding && selectedAgent
                    ? `${selectedBuilding.shortName} · ${selectedAgent.name}`
                    : "No selection"}
                </span>
              </div>
              <Button
                aria-label="Close details panel"
                icon={<X size={15} />}
                onClick={() => setDetailsOpen(false)}
                size="icon"
                variant="ghost"
              />
            </div>
            <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
              {selectedBuilding && selectedAgent ? (
                <>
                  <AgentPanel agent={selectedAgent} building={agentBuilding} />
                  <BuildingPanel
                    approvals={selectedApprovals}
                    building={selectedBuilding}
                    manager={manager}
                    tasks={selectedTasks}
                  />
                  <ChatPanel selectedBuilding={selectedBuilding} />
                </>
              ) : (
                <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                    <MousePointer2 className="text-cyan-200" size={16} />
                    Select a building or agent
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Click a village building or open Crew and choose an agent to inspect tasks,
                    approvals, Treasury context, and chat.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <section
          className={cn(
            "fixed bottom-[104px] left-3 right-3 z-30 max-h-[38vh] overflow-y-auto rounded-xl border border-white/[0.12] bg-zinc-950/[0.58] shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl transition-transform duration-300",
            crewOpen && "lg:left-[388px]",
            detailsOpen && "lg:right-[488px]",
            crewOpen || detailsOpen ? "lg:mx-0 lg:max-w-none" : "lg:mx-auto lg:max-w-[1180px]",
            logOpen ? "translate-y-0" : "translate-y-[calc(100%+7rem)]",
          )}
        >
          <EventLog className="border-white/0 bg-transparent shadow-none backdrop-blur-0" />
        </section>
      </main>
      <BottomDock />
    </div>
  );
}
