import type Phaser from "phaser";
import { buildingStatusPalette, categoryAccent } from "@/components/phaser/buildingSprites";
import type { VillageSceneApi, VillageSceneOptions } from "@/components/phaser/gameTypes";

type PhaserRuntime = typeof Phaser;

interface BuildingNode {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Ellipse;
  base: Phaser.GameObjects.Polygon;
  label: Phaser.GameObjects.Text;
  statusText: Phaser.GameObjects.Text;
}

export function createVillageScene(
  PhaserLib: PhaserRuntime,
  options: VillageSceneOptions,
): Phaser.Scene & VillageSceneApi {
  class VillageScene extends PhaserLib.Scene implements VillageSceneApi {
    private selectedBuildingId = options.selectedBuildingId;
    private buildingNodes = new Map<string, BuildingNode>();
    private tileGroup?: Phaser.GameObjects.Group;
    private agentGroup?: Phaser.GameObjects.Group;
    private isReady = false;

    constructor() {
      super({ key: "VillageScene" });
    }

    create() {
      this.cameras.main.setBackgroundColor("#07111b");
      this.isReady = true;
      this.drawScene();
    }

    relayout() {
      if (!this.isReady) {
        return;
      }

      this.drawScene();
    }

    setSelectedBuilding(buildingId: string) {
      this.selectedBuildingId = buildingId;
      this.refreshSelection();
    }

    private drawScene() {
      this.tileGroup?.clear(true, true);
      this.agentGroup?.clear(true, true);
      this.buildingNodes.forEach((node) => node.container.destroy(true));
      this.buildingNodes.clear();

      this.tileGroup = this.add.group();
      this.agentGroup = this.add.group();

      this.drawBackground();
      this.drawTiles();
      this.drawBuildings();
      this.drawAgents();
      this.refreshSelection();
    }

    private drawBackground() {
      const { width, height } = this.scale;
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x06111d, 0x07111b, 0x0d1f26, 0x10171f, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.lineStyle(1, 0x164e63, 0.1);

      for (let x = 0; x < width; x += 64) {
        graphics.lineBetween(x, 0, x - height, height);
        graphics.lineBetween(x, 0, x + height, height);
      }

      this.tileGroup?.add(graphics);
    }

    private drawTiles() {
      const { width, height } = this.scale;
      const originX = width / 2;
      const originY = height / 2 + 24;
      const tileW = 92;
      const tileH = 46;

      for (let gx = -5; gx <= 5; gx += 1) {
        for (let gy = -4; gy <= 4; gy += 1) {
          const x = originX + (gx - gy) * (tileW / 2);
          const y = originY + (gx + gy) * (tileH / 2);
          const tile = this.add.polygon(
            x,
            y,
            [0, -tileH / 2, tileW / 2, 0, 0, tileH / 2, -tileW / 2, 0],
            (gx + gy) % 2 === 0 ? 0x10232c : 0x0c1a22,
            0.88,
          );
          tile.setStrokeStyle(1, 0x67e8f9, 0.08);
          this.tileGroup?.add(tile);
        }
      }
    }

    private drawBuildings() {
      const sorted = [...options.buildings].sort((a, b) => a.position.y - b.position.y);
      sorted.forEach((building) => {
        const { x, y } = this.toScreen(building.position.x, building.position.y);
        const palette = buildingStatusPalette[building.status];
        const accent = categoryAccent[building.category] ?? 0xffffff;
        const container = this.add.container(x, y);
        const glow = this.add.ellipse(0, 18, 112, 44, palette.glow, 0.14);
        const shadow = this.add.ellipse(0, 36, 118, 26, 0x000000, 0.28);
        const base = this.add.polygon(0, 12, [0, -32, 58, 0, 0, 32, -58, 0], palette.base, 0.96);
        const body = this.add.rectangle(0, -18, 76, 58, palette.base, 0.9);
        const roof = this.add.triangle(0, -58, -48, 24, 48, 24, 0, -26, palette.roof, 0.98);
        const windowA = this.add.rectangle(-18, -16, 10, 16, accent, 0.85);
        const windowB = this.add.rectangle(18, -16, 10, 16, accent, 0.85);
        const lantern = this.add.circle(42, -35, 5, palette.glow, 0.95);
        const label = this.add
          .text(0, 54, building.shortName, {
            align: "center",
            color: "#f8fafc",
            fontFamily: "Geist, Arial, sans-serif",
            fontSize: "12px",
            fontStyle: "600",
            stroke: "#020617",
            strokeThickness: 4,
          })
          .setOrigin(0.5, 0);
        const statusText = this.add
          .text(0, 70, palette.label, {
            align: "center",
            color: "#a1a1aa",
            fontFamily: "Geist Mono, monospace",
            fontSize: "10px",
            stroke: "#020617",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0);

        base.setStrokeStyle(2, accent, 0.26);
        roof.setStrokeStyle(2, palette.glow, 0.35);
        container.add([glow, shadow, base, body, roof, windowA, windowB, lantern, label, statusText]);
        container.setDepth(y);
        container.setSize(132, 126);
        container.setInteractive(
          new PhaserLib.Geom.Rectangle(-66, -74, 132, 146),
          PhaserLib.Geom.Rectangle.Contains,
        );
        container.on("pointerover", () => {
          this.tweens.add({ targets: container, scale: 1.05, duration: 150, ease: "Sine.easeOut" });
          glow.setAlpha(0.28);
        });
        container.on("pointerout", () => {
          this.tweens.add({ targets: container, scale: 1, duration: 160, ease: "Sine.easeOut" });
          glow.setAlpha(0.14);
        });
        container.on("pointerdown", () => {
          options.onSelectBuilding(building.id);
          this.setSelectedBuilding(building.id);
        });

        this.tweens.add({
          targets: [lantern, glow],
          alpha: { from: 0.14, to: building.status === "idle" ? 0.22 : 0.42 },
          duration: 1100 + Math.round(Math.random() * 500),
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        this.buildingNodes.set(building.id, { container, glow, base, label, statusText });
      });
    }

    private drawAgents() {
      const agentMarkers = [
        { x: -68, y: -74, color: 0x22d3ee },
        { x: 82, y: -12, color: 0x34d399 },
        { x: -136, y: 44, color: 0xfbbf24 },
        { x: 124, y: 88, color: 0xa78bfa },
        { x: -22, y: 154, color: 0xfb7185 },
      ];

      agentMarkers.forEach((marker, index) => {
        const { x, y } = this.toScreen(marker.x, marker.y);
        const ring = this.add.circle(x, y, 9, marker.color, 0.15);
        const dot = this.add.circle(x, y, 4, marker.color, 0.95);
        this.agentGroup?.addMultiple([ring, dot]);
        this.tweens.add({
          targets: [ring, dot],
          y: y + (index % 2 === 0 ? 8 : -8),
          duration: 1400 + index * 120,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      });
    }

    private refreshSelection() {
      this.buildingNodes.forEach((node, buildingId) => {
        const selected = buildingId === this.selectedBuildingId;
        node.base.setStrokeStyle(selected ? 4 : 2, selected ? 0xf8fafc : 0x67e8f9, selected ? 0.85 : 0.24);
        node.label.setColor(selected ? "#ffffff" : "#f8fafc");
        node.statusText.setColor(selected ? "#67e8f9" : "#a1a1aa");
        node.glow.setAlpha(selected ? 0.38 : 0.14);
      });
    }

    private toScreen(x: number, y: number) {
      return {
        x: this.scale.width / 2 + x,
        y: this.scale.height / 2 + y,
      };
    }
  }

  return new VillageScene();
}
