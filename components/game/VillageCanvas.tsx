"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { createVillageScene } from "@/components/phaser/VillageScene";
import type { VillageSceneApi } from "@/components/phaser/gameTypes";
import type { Building } from "@/lib/types/atlas";

interface VillageCanvasProps {
  buildings: Building[];
  selectedBuildingId: string;
  onSelectBuilding: (buildingId: string) => void;
}

export function VillageCanvas({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
}: VillageCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<VillageSceneApi | null>(null);
  const onSelectBuildingRef = useRef(onSelectBuilding);
  const initialSelectedRef = useRef(selectedBuildingId);

  useEffect(() => {
    onSelectBuildingRef.current = onSelectBuilding;
  }, [onSelectBuilding]);

  useEffect(() => {
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;

    async function boot() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const PhaserModule = await import("phaser");
      const PhaserLib = PhaserModule.default;
      const scene = createVillageScene(PhaserLib, {
        buildings,
        selectedBuildingId: initialSelectedRef.current,
        onSelectBuilding: (buildingId) => onSelectBuildingRef.current(buildingId),
      });

      if (disposed) {
        return;
      }

      sceneRef.current = scene;
      gameRef.current = new PhaserLib.Game({
        type: PhaserLib.AUTO,
        parent: container,
        width: Math.max(container.clientWidth, 720),
        height: Math.max(container.clientHeight, 520),
        backgroundColor: "#07111b",
        antialias: true,
        scale: {
          mode: PhaserLib.Scale.RESIZE,
          autoCenter: PhaserLib.Scale.CENTER_BOTH,
        },
        scene,
      });

      resizeObserver = new ResizeObserver(() => {
        const game = gameRef.current;
        if (!game || !containerRef.current) {
          return;
        }

        game.scale.resize(
          Math.max(containerRef.current.clientWidth, 720),
          Math.max(containerRef.current.clientHeight, 520),
        );
        sceneRef.current?.relayout();
      });
      resizeObserver.observe(container);
    }

    boot();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, [buildings]);

  useEffect(() => {
    sceneRef.current?.setSelectedBuilding(selectedBuildingId);
  }, [selectedBuildingId]);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[#07111b] shadow-[inset_0_0_80px_rgba(8,47,73,0.38)] xl:min-h-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
        <div className="rounded-md border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-200/80">
            Village Canvas
          </div>
          <div className="text-xs text-zinc-400">Phaser 3 · isometric mock map</div>
        </div>
        <div className="rounded-md border border-amber-300/20 bg-amber-300/[0.08] px-3 py-2 text-xs text-amber-100 backdrop-blur-md">
          All external actions route to Approval Court
        </div>
      </div>
      <div className="h-full w-full" ref={containerRef} />
    </div>
  );
}
