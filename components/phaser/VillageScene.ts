import type Phaser from "phaser";
import { buildingStatusPalette, categoryAccent } from "@/components/phaser/buildingSprites";
import type { VillageSceneApi, VillageSceneOptions } from "@/components/phaser/gameTypes";

type PhaserRuntime = typeof Phaser;

interface BuildingNode {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Ellipse;
  base: Phaser.GameObjects.Rectangle;
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
      this.cameras.main.setBackgroundColor("#102115");
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
      this.drawPaths();
      this.drawScenery();
      this.drawBuildings();
      this.drawAgents();
      this.refreshSelection();
    }

    private drawBackground() {
      const { width, height } = this.scale;
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x213d25, 0x244729, 0x17321f, 0x112319, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.fillStyle(0x0b1712, 0.22);
      graphics.fillRect(0, 0, width, 86);
      graphics.fillStyle(0x0b1712, 0.26);
      graphics.fillRect(0, height - 92, width, 92);

      this.tileGroup?.add(graphics);
    }

    private drawTiles() {
      const { width, height } = this.scale;
      const originX = width / 2;
      const originY = height / 2 + 18;
      const tileW = 86;
      const tileH = 43;

      for (let gx = -8; gx <= 8; gx += 1) {
        for (let gy = -7; gy <= 7; gy += 1) {
          const x = originX + (gx - gy) * (tileW / 2);
          const y = originY + (gx + gy) * (tileH / 2);
          const meadow = (gx * 17 + gy * 23) % 5 === 0;
          const shade = (gx + gy) % 2 === 0 ? 0x234b2a : 0x1f4227;
          const tile = this.add.polygon(
            x,
            y,
            [0, -tileH / 2, tileW / 2, 0, 0, tileH / 2, -tileW / 2, 0],
            meadow ? 0x2f6133 : shade,
            0.9,
          );
          tile.setStrokeStyle(1, 0xd8f1b8, 0.05);
          this.tileGroup?.add(tile);
        }
      }
    }

    private drawPaths() {
      const graphics = this.add.graphics();
      const pathPoints = [
        this.toScreen(-330, 170),
        this.toScreen(-180, 86),
        this.toScreen(0, -6),
        this.toScreen(178, -8),
        this.toScreen(320, 88),
      ];
      const branchA = [this.toScreen(0, -6), this.toScreen(0, -120)];
      const branchB = [this.toScreen(0, -6), this.toScreen(18, 100), this.toScreen(162, 220)];
      const branchC = [this.toScreen(-180, 86), this.toScreen(-150, 220)];

      this.strokePath(graphics, pathPoints, 42, 0xefe0ad, 0.86);
      this.strokePath(graphics, pathPoints, 30, 0xcaa976, 0.48);
      [branchA, branchB, branchC].forEach((branch) => {
        this.strokePath(graphics, branch, 30, 0xefe0ad, 0.78);
        this.strokePath(graphics, branch, 20, 0xcaa976, 0.42);
      });

      graphics.fillStyle(0x866a43, 0.34);
      [
        this.toScreen(-260, 150),
        this.toScreen(-84, 56),
        this.toScreen(84, 42),
        this.toScreen(226, 76),
        this.toScreen(-64, -72),
      ].forEach((point, index) => {
        graphics.fillCircle(point.x + index * 4, point.y + 8, 4 + (index % 2));
      });
      this.tileGroup?.add(graphics);
    }

    private strokePath(
      graphics: Phaser.GameObjects.Graphics,
      points: { x: number; y: number }[],
      width: number,
      color: number,
      alpha: number,
    ) {
      graphics.lineStyle(width, color, alpha);
      graphics.beginPath();
      graphics.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
      graphics.strokePath();
    }

    private drawScenery() {
      const treePositions = [
        [-470, -190],
        [-390, -118],
        [-432, 34],
        [-388, 252],
        [-238, 278],
        [280, -180],
        [410, -94],
        [436, 100],
        [340, 262],
        [48, 318],
        [-36, -242],
        [198, 312],
      ];

      treePositions.forEach(([x, y], index) => {
        this.drawTree(x, y, index % 3);
      });

      [
        [-250, -24],
        [-218, -42],
        [242, 12],
        [276, 30],
        [-48, 196],
        [-20, 210],
        [80, -178],
        [112, -190],
      ].forEach(([x, y]) => this.drawFence(x, y));

      [
        [-314, 36],
        [-104, 148],
        [232, 170],
        [358, -18],
        [58, -18],
      ].forEach(([x, y]) => this.drawRock(x, y));
    }

    private drawBuildings() {
      const sorted = [...options.buildings].sort((a, b) => a.position.y - b.position.y);
      sorted.forEach((building) => {
        const { x, y } = this.toScreen(building.position.x, building.position.y);
        const palette = buildingStatusPalette[building.status];
        const accent = categoryAccent[building.category] ?? 0xffffff;
        const roofColor = this.getRoofColor(building.id);
        const wallColor = this.getWallColor(building.id);
        const labelText = this.getBuildingLabel(building.id, building.shortName);
        const width = building.id === "keep-hall" ? 92 : 74;
        const height = building.id === "keep-hall" ? 66 : 54;
        const container = this.add.container(x, y);
        const glow = this.add.ellipse(0, 14, width + 56, 48, palette.glow, 0.16);
        const shadow = this.add.ellipse(4, 38, width + 62, 30, 0x07100b, 0.35);
        const base = this.add.rectangle(0, 5, width, height, wallColor, 0.98);
        const side = this.add.polygon(
          width / 2,
          9,
          [0, -height / 2, 22, -height / 2 - 12, 22, height / 2 - 8, 0, height / 2],
          this.darken(wallColor),
          0.94,
        );
        const roof = this.add.polygon(
          0,
          -36,
          [
            -width / 2 - 18,
            14,
            0,
            -height / 2 + 2,
            width / 2 + 18,
            14,
            width / 2,
            30,
            0,
            2,
            -width / 2,
            30,
          ],
          roofColor,
          0.98,
        );
        const roofLineA = this.add.rectangle(-20, -25, 42, 4, this.lighten(roofColor), 0.45);
        const roofLineB = this.add.rectangle(18, -13, 42, 4, this.lighten(roofColor), 0.36);
        roofLineA.setRotation(-0.52);
        roofLineB.setRotation(0.52);
        const door = this.add.rectangle(-6, 22, 14, 28, 0x3b2518, 0.95);
        const windowA = this.add.rectangle(-26, 0, 9, 14, accent, 0.82);
        const windowB = this.add.rectangle(24, 0, 9, 14, accent, 0.82);
        const lantern = this.add.circle(width / 2 + 11, -23, 5, palette.glow, 0.95);
        const labelBg = this.add.rectangle(0, -92, Math.max(58, labelText.length * 8 + 18), 22, 0x0b1210, 0.72);
        const label = this.add
          .text(0, -93, labelText, {
            align: "center",
            color: "#fff8d7",
            fontFamily: "Geist Mono, monospace",
            fontSize: "11px",
            fontStyle: "700",
            stroke: "#132016",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0.5);
        const statusText = this.add
          .text(0, 55, palette.label, {
            align: "center",
            color: "#e6ddb5",
            fontFamily: "Geist Mono, monospace",
            fontSize: "10px",
            stroke: "#132016",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0);

        labelBg.setStrokeStyle(1, palette.glow, 0.24);
        base.setStrokeStyle(2, 0x301d14, 0.42);
        roof.setStrokeStyle(2, palette.glow, 0.34);
        container.add([
          glow,
          shadow,
          side,
          base,
          roof,
          roofLineA,
          roofLineB,
          door,
          windowA,
          windowB,
          lantern,
          labelBg,
          label,
          statusText,
        ]);
        container.setDepth(y);
        container.setSize(width + 78, 166);
        container.setInteractive(
          new PhaserLib.Geom.Rectangle(-(width + 78) / 2, -108, width + 78, 178),
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
        { x: -74, y: -78, color: 0x22d3ee },
        { x: 92, y: -8, color: 0x34d399 },
        { x: -136, y: 58, color: 0xfbbf24 },
        { x: 132, y: 92, color: 0xa78bfa },
        { x: -22, y: 154, color: 0xfb7185 },
        { x: -258, y: 122, color: 0xe6ddb5 },
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
        node.base.setStrokeStyle(selected ? 4 : 2, selected ? 0xfff3b0 : 0x301d14, selected ? 0.9 : 0.42);
        node.label.setColor(selected ? "#ffffff" : "#fff8d7");
        node.statusText.setColor(selected ? "#fff3b0" : "#e6ddb5");
        node.glow.setAlpha(selected ? 0.44 : 0.16);
      });
    }

    private drawTree(x: number, y: number, variant: number) {
      const point = this.toScreen(x, y);
      const trunk = this.add.rectangle(point.x, point.y + 18, 10, 24, 0x5a331f, 0.95);
      const shadow = this.add.ellipse(point.x + 4, point.y + 30, 44, 14, 0x07100b, 0.28);
      const leafA = this.add.circle(point.x, point.y, 24 + variant * 3, variant === 1 ? 0x77a85d : 0x4f8a46, 0.96);
      const leafB = this.add.circle(point.x - 16, point.y + 8, 18, 0x376f38, 0.96);
      const leafC = this.add.circle(point.x + 16, point.y + 10, 18, 0x6fa753, 0.95);
      [shadow, trunk, leafA, leafB, leafC].forEach((item) => {
        item.setDepth(point.y + 30);
        this.tileGroup?.add(item);
      });
    }

    private drawFence(x: number, y: number) {
      const point = this.toScreen(x, y);
      const rail = this.add.rectangle(point.x, point.y, 56, 5, 0xd9b16f, 0.72);
      const postA = this.add.rectangle(point.x - 24, point.y - 5, 6, 18, 0x8d6336, 0.85);
      const postB = this.add.rectangle(point.x, point.y - 5, 6, 18, 0x8d6336, 0.85);
      const postC = this.add.rectangle(point.x + 24, point.y - 5, 6, 18, 0x8d6336, 0.85);
      rail.setRotation(-0.28);
      [rail, postA, postB, postC].forEach((item) => {
        item.setDepth(point.y + 18);
        this.tileGroup?.add(item);
      });
    }

    private drawRock(x: number, y: number) {
      const point = this.toScreen(x, y);
      const rock = this.add.polygon(
        point.x,
        point.y,
        [-14, 4, -6, -8, 12, -5, 18, 6, 5, 13, -10, 12],
        0x9da7a0,
        0.82,
      );
      rock.setStrokeStyle(1, 0x38443b, 0.45);
      rock.setDepth(point.y + 12);
      this.tileGroup?.add(rock);
    }

    private getBuildingLabel(buildingId: string, fallback: string) {
      const labels: Record<string, string> = {
        "keep-hall": "HQ",
        treasury: "Treasury",
        "content-studio": "Studio",
        "product-workshop": "Workshop",
        "freelance-guild": "Guild",
        "engineering-workshop": "Engineering",
        "approval-court": "Court",
        "research-library": "Library",
        "allocation-tower": "Atlas Tower",
      };

      return labels[buildingId] ?? fallback;
    }

    private getRoofColor(buildingId: string) {
      const roofs: Record<string, number> = {
        "keep-hall": 0x335c4b,
        treasury: 0xc1782b,
        "content-studio": 0x3f86a8,
        "product-workshop": 0x8f5729,
        "freelance-guild": 0xb8752b,
        "engineering-workshop": 0x4b8dbb,
        "approval-court": 0x3f7d63,
        "research-library": 0x7f7a7c,
        "allocation-tower": 0x2f7d8e,
      };

      return roofs[buildingId] ?? 0x8f5729;
    }

    private getWallColor(buildingId: string) {
      const walls: Record<string, number> = {
        "keep-hall": 0x72523a,
        treasury: 0x7a4a24,
        "content-studio": 0x4f5e61,
        "product-workshop": 0x765139,
        "freelance-guild": 0x70411f,
        "engineering-workshop": 0x564b44,
        "approval-court": 0x5d5949,
        "research-library": 0x5d514d,
        "allocation-tower": 0x435d61,
      };

      return walls[buildingId] ?? 0x765139;
    }

    private darken(color: number) {
      const r = Math.max(0, ((color >> 16) & 0xff) - 36);
      const g = Math.max(0, ((color >> 8) & 0xff) - 36);
      const b = Math.max(0, (color & 0xff) - 36);
      return (r << 16) + (g << 8) + b;
    }

    private lighten(color: number) {
      const r = Math.min(255, ((color >> 16) & 0xff) + 34);
      const g = Math.min(255, ((color >> 8) & 0xff) + 34);
      const b = Math.min(255, (color & 0xff) + 34);
      return (r << 16) + (g << 8) + b;
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
