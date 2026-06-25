"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { createVillageScene } from "@/components/phaser/VillageScene";
import type { VillageSceneApi } from "@/components/phaser/gameTypes";
import type { Building } from "@/lib/types/atlas";
import { cn } from "@/lib/utils/cn";

interface VillageCanvasProps {
  buildings: Building[];
  selectedBuildingId: string;
  onSelectBuilding: (buildingId: string) => void;
  className?: string;
  variant?: "framed" | "immersive";
}

export function VillageCanvas({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  className,
  variant = "framed",
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
        backgroundColor: "#102115",
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
          Math.max(containerRef.current.clientWidth, 760),
          Math.max(containerRef.current.clientHeight, 540),
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
    <div
      className={cn(
        "relative h-full min-h-[420px] overflow-hidden bg-[#102115] xl:min-h-0",
        variant === "framed" &&
          "rounded-lg border border-white/10 shadow-[inset_0_0_80px_rgba(8,47,73,0.38)]",
        variant === "immersive" && "shadow-[inset_0_0_140px_rgba(0,0,0,0.42)]",
        className,
      )}
    >
      <div className="h-full w-full" ref={containerRef} />
    </div>
  );
}
