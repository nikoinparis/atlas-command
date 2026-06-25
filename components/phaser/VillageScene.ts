import type Phaser from "phaser";
import { buildingStatusPalette, categoryAccent } from "@/components/phaser/buildingSprites";
import type { VillageSceneApi, VillageSceneOptions } from "@/components/phaser/gameTypes";
import {
  getBuildingAsset,
  getBuildingAssets,
  type BuildingAssetConfig,
  type BuildingFallbackStyle,
} from "@/lib/game/buildingAssets";

// --- Isometric village grid -------------------------------------------------
// Buildings, roads, and lots are all placed on one logical grid. gridToWorld() converts a
// (col, row) cell into world px using a standard 2:1-ish isometric projection, so the town
// reads as an organized base-builder map instead of scattered sprites.
const GRID_TILE_HALF_W = 110; // half width of one iso tile (controls horizontal spread)
const GRID_TILE_HALF_H = 58; // half height of one iso tile (controls vertical spread)
const GRID_ORIGIN_X = 0; // world-space origin offset for the grid
const GRID_ORIGIN_Y = 18; // nudged down so top-row labels clear the HUD and bottom row clears the dock

// Slight zoom so the composition feels full without cropping buildings or hiding labels.
const VILLAGE_ZOOM = 1.04;
// Extra background drawn beyond the viewport so zoom + edge-pan never expose empty canvas.
const BACKGROUND_OVERSCAN = 110;
// Edge-pan tuning: how close (px) the cursor must get to a screen edge before the camera drifts.
const EDGE_PAN_THRESHOLD = 52;
// Largest distance (px) the camera can drift from its resting position in any direction.
const EDGE_PAN_MAX_DISTANCE = 32;
// How quickly the camera eases toward its target each frame (0-1 per ~16ms); kept low for a gentle drift.
const EDGE_PAN_EASE = 0.045;

type PhaserRuntime = typeof Phaser;

interface BuildingNode {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Ellipse;
  highlight: Phaser.GameObjects.Polygon;
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
    private failedAssetKeys = new Set<string>();
    private isReady = false;
    private originScrollX = 0;
    private originScrollY = 0;
    private pointerInsideCanvas = false;
    private detachPointerListeners?: () => void;

    constructor() {
      super({ key: "VillageScene" });
    }

    preload() {
      this.load.on("loaderror", (file: { key?: string | string[] }) => {
        if (typeof file.key === "string") {
          this.failedAssetKeys.add(file.key);
        }
      });

      getBuildingAssets().forEach((asset) => {
        this.load.image(asset.key, asset.path);
      });
    }

    create() {
      const camera = this.cameras.main;
      camera.setBackgroundColor("#102115");
      camera.setZoom(VILLAGE_ZOOM);
      this.originScrollX = camera.scrollX;
      this.originScrollY = camera.scrollY;
      this.setupEdgePanTracking();
      this.isReady = true;
      this.drawScene();
    }

    private setupEdgePanTracking() {
      const canvas = this.game.canvas;
      if (!canvas) {
        return;
      }

      const handleEnter = () => {
        this.pointerInsideCanvas = true;
      };
      const handleLeave = () => {
        this.pointerInsideCanvas = false;
      };

      canvas.addEventListener("mouseenter", handleEnter);
      canvas.addEventListener("mouseleave", handleLeave);
      this.detachPointerListeners = () => {
        canvas.removeEventListener("mouseenter", handleEnter);
        canvas.removeEventListener("mouseleave", handleLeave);
      };
      this.events.once("shutdown", () => this.detachPointerListeners?.());
      this.events.once("destroy", () => this.detachPointerListeners?.());
    }

    update() {
      if (!this.isReady) {
        return;
      }

      const camera = this.cameras.main;
      const { width, height } = this.scale;
      const pointer = this.input.activePointer;

      // Resolve where the camera *wants* to be based on cursor proximity to each edge.
      let targetScrollX = this.originScrollX;
      let targetScrollY = this.originScrollY;

      const cursorInBounds =
        pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;

      // Only drift while the cursor is actually over the canvas (so open UI panels/drawers,
      // which sit above the canvas, naturally suppress the movement).
      if (this.pointerInsideCanvas && cursorInBounds) {
        if (pointer.x < EDGE_PAN_THRESHOLD) {
          targetScrollX -= ((EDGE_PAN_THRESHOLD - pointer.x) / EDGE_PAN_THRESHOLD) * EDGE_PAN_MAX_DISTANCE;
        } else if (pointer.x > width - EDGE_PAN_THRESHOLD) {
          targetScrollX +=
            ((pointer.x - (width - EDGE_PAN_THRESHOLD)) / EDGE_PAN_THRESHOLD) * EDGE_PAN_MAX_DISTANCE;
        }

        if (pointer.y < EDGE_PAN_THRESHOLD) {
          targetScrollY -= ((EDGE_PAN_THRESHOLD - pointer.y) / EDGE_PAN_THRESHOLD) * EDGE_PAN_MAX_DISTANCE;
        } else if (pointer.y > height - EDGE_PAN_THRESHOLD) {
          targetScrollY +=
            ((pointer.y - (height - EDGE_PAN_THRESHOLD)) / EDGE_PAN_THRESHOLD) * EDGE_PAN_MAX_DISTANCE;
        }
      }

      // Clamp so the camera can never drift further than the allowed distance from rest.
      targetScrollX = PhaserLib.Math.Clamp(
        targetScrollX,
        this.originScrollX - EDGE_PAN_MAX_DISTANCE,
        this.originScrollX + EDGE_PAN_MAX_DISTANCE,
      );
      targetScrollY = PhaserLib.Math.Clamp(
        targetScrollY,
        this.originScrollY - EDGE_PAN_MAX_DISTANCE,
        this.originScrollY + EDGE_PAN_MAX_DISTANCE,
      );

      camera.scrollX += (targetScrollX - camera.scrollX) * EDGE_PAN_EASE;
      camera.scrollY += (targetScrollY - camera.scrollY) * EDGE_PAN_EASE;
    }

    relayout() {
      if (!this.isReady) {
        return;
      }

      this.drawScene();
    }

    setSelectedBuilding(buildingId: string | null) {
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

      // Layering (back to front): grass -> grid roads -> building lots -> small decorations
      // -> building sprites (depth-sorted) -> agent markers.
      this.drawBackground();
      this.drawTiles();
      this.drawRoads();
      this.drawLots();
      this.drawScenery();
      this.drawBuildings();
      this.drawAgents();
      this.refreshSelection();
    }

    private drawBackground() {
      const { width, height } = this.scale;
      const graphics = this.add.graphics();
      // Overscan the background so the slight zoom + edge-pan never reveal empty canvas.
      const margin = BACKGROUND_OVERSCAN;
      graphics.fillGradientStyle(0x274b2b, 0x2c5932, 0x183920, 0x102719, 1);
      graphics.fillRect(-margin, -margin, width + margin * 2, height + margin * 2);
      graphics.fillStyle(0x0b1712, 0.08);
      graphics.fillRect(-margin, -margin, width + margin * 2, 96 + margin);
      graphics.fillStyle(0x0b1712, 0.1);
      graphics.fillRect(-margin, height - 104, width + margin * 2, 104 + margin);

      this.tileGroup?.add(graphics);
    }

    private drawTiles() {
      const { width, height } = this.scale;
      const graphics = this.add.graphics();
      const meadowPatches = [
        { x: -380, y: -214, width: 280, height: 128, color: 0x315f34, alpha: 0.44 },
        { x: 338, y: -188, width: 318, height: 146, color: 0x376b38, alpha: 0.38 },
        { x: -424, y: 198, width: 352, height: 168, color: 0x2e6134, alpha: 0.46 },
        { x: 370, y: 224, width: 336, height: 176, color: 0x335f31, alpha: 0.44 },
        { x: 4, y: 268, width: 450, height: 164, color: 0x2f6738, alpha: 0.34 },
      ];

      meadowPatches.forEach((patch) => {
        const point = this.toScreen(patch.x, patch.y);
        graphics.fillStyle(patch.color, patch.alpha);
        graphics.fillEllipse(point.x, point.y, patch.width, patch.height);
      });

      for (let index = 0; index < 150; index += 1) {
        const x = ((index * 173) % Math.max(1, Math.round(width + 280))) - 140;
        const y = ((index * 97) % Math.max(1, Math.round(height + 220))) - 86;
        const color = [0x2b5a31, 0x356f3a, 0x244c2b, 0x416f38, 0x2d6336][index % 5];
        const alpha = 0.16 + (index % 4) * 0.04;
        const patchWidth = 18 + (index % 7) * 7;
        const patchHeight = 7 + (index % 5) * 4;

        graphics.fillStyle(color, alpha);
        graphics.fillEllipse(x, y, patchWidth, patchHeight);
      }

      for (let index = 0; index < 120; index += 1) {
        const x = ((index * 151) % Math.max(1, Math.round(width + 220))) - 110;
        const y = ((index * 71) % Math.max(1, Math.round(height + 180))) - 62;
        const tuftColor = index % 3 === 0 ? 0x86b568 : 0x5e914c;

        graphics.lineStyle(1, tuftColor, 0.24);
        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.lineTo(x - 4, y + 9);
        graphics.moveTo(x, y);
        graphics.lineTo(x + 3, y + 10);
        graphics.strokePath();
      }

      this.tileGroup?.add(graphics);
    }

    private drawRoads() {
      const graphics = this.add.graphics();

      // Roads run along the half-integer grid lines, i.e. the borders *between* lots, so they
      // form a clean isometric lattice and never pass under a building's center. Each entry is
      // a straight avenue defined by two grid endpoints.
      const roadLines: { from: [number, number]; to: [number, number] }[] = [
        // Down-right avenues (constant row).
        { from: [-2.5, -0.5], to: [1.5, -0.5] },
        { from: [-2.5, 0.5], to: [2.5, 0.5] },
        { from: [-0.5, 1.5], to: [2.5, 1.5] },
        // Down-left avenues (constant col).
        { from: [-1.5, -1.5], to: [-1.5, 2.5] },
        { from: [-0.5, -2.5], to: [-0.5, 2.5] },
        { from: [0.5, -2.5], to: [0.5, 2.5] },
        { from: [1.5, -1.5], to: [1.5, 1.5] },
      ];

      roadLines.forEach(({ from, to }) => {
        const a = this.gridToScreen(from[0], from[1]);
        const b = this.gridToScreen(to[0], to[1]);
        const line = [a, b];
        this.strokePath(graphics, line, 46, 0x6d5934, 0.16, 0);
        this.strokePath(graphics, line, 40, 0xefe0ad, 0.8, 0);
        this.strokePath(graphics, line, 24, 0xcaa976, 0.4, 0);
      });

      // A paved plaza at the central intersection sells the "town square" read.
      const center = this.gridToScreen(0, 0);
      graphics.fillStyle(0x6d5934, 0.2);
      graphics.fillEllipse(center.x, center.y, GRID_TILE_HALF_W * 1.5, GRID_TILE_HALF_H * 1.5);
      graphics.fillStyle(0xefe0ad, 0.52);
      graphics.fillEllipse(center.x, center.y, GRID_TILE_HALF_W * 1.2, GRID_TILE_HALF_H * 1.2);
      graphics.fillStyle(0xcaa976, 0.34);
      graphics.fillEllipse(center.x, center.y, GRID_TILE_HALF_W * 0.74, GRID_TILE_HALF_H * 0.74);

      this.tileGroup?.add(graphics);
    }

    private drawLots() {
      // Every building gets a visible isometric ground lot/pad drawn under its base. This
      // (not a drop shadow) is what grounds the building onto the terrain.
      const graphics = this.add.graphics();
      options.buildings.forEach((building) => {
        const asset = getBuildingAsset(building.id);
        const { x, y } = this.gridToScreen(asset.gridCol, asset.gridRow);
        const groundY = y + (1 - asset.anchor.y) * asset.height; // the building's base line
        this.fillIsoDiamond(graphics, x, groundY, asset.lotWidth + 16, asset.lotHeight + 8, 0x2f5a32, 0.55);
        this.fillIsoDiamond(graphics, x, groundY, asset.lotWidth, asset.lotHeight, 0x6f5a3a, 0.92);
        this.fillIsoDiamond(graphics, x, groundY - 2, asset.lotWidth * 0.78, asset.lotHeight * 0.78, 0x836b44, 0.7);
        // Thin rim so the lot edge catches a little light and reads as a built pad.
        this.strokeIsoDiamond(graphics, x, groundY, asset.lotWidth, asset.lotHeight, 0x3a2c1a, 0.5);
      });
      this.tileGroup?.add(graphics);
    }

    private isoDiamondPoints(cx: number, cy: number, width: number, height: number) {
      const hw = width / 2;
      const hh = height / 2;
      return [cx, cy - hh, cx + hw, cy, cx, cy + hh, cx - hw, cy];
    }

    private fillIsoDiamond(
      graphics: Phaser.GameObjects.Graphics,
      cx: number,
      cy: number,
      width: number,
      height: number,
      color: number,
      alpha: number,
    ) {
      const p = this.isoDiamondPoints(cx, cy, width, height);
      graphics.fillStyle(color, alpha);
      graphics.beginPath();
      graphics.moveTo(p[0], p[1]);
      graphics.lineTo(p[2], p[3]);
      graphics.lineTo(p[4], p[5]);
      graphics.lineTo(p[6], p[7]);
      graphics.closePath();
      graphics.fillPath();
    }

    private strokeIsoDiamond(
      graphics: Phaser.GameObjects.Graphics,
      cx: number,
      cy: number,
      width: number,
      height: number,
      color: number,
      alpha: number,
    ) {
      const p = this.isoDiamondPoints(cx, cy, width, height);
      graphics.lineStyle(2, color, alpha);
      graphics.beginPath();
      graphics.moveTo(p[0], p[1]);
      graphics.lineTo(p[2], p[3]);
      graphics.lineTo(p[4], p[5]);
      graphics.lineTo(p[6], p[7]);
      graphics.closePath();
      graphics.strokePath();
    }

    private strokePath(
      graphics: Phaser.GameObjects.Graphics,
      points: { x: number; y: number }[],
      width: number,
      color: number,
      alpha: number,
      wobble = 0,
    ) {
      graphics.lineStyle(width, color, alpha);
      graphics.beginPath();
      graphics.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point, index) => {
        const previous = points[index];
        const midpointX = (previous.x + point.x) / 2;
        const midpointY = (previous.y + point.y) / 2;
        const offset = (index % 2 === 0 ? wobble : -wobble) + (point.x > previous.x ? 3 : -3);

        graphics.lineTo(midpointX + offset, midpointY - wobble / 2);
        graphics.lineTo(point.x, point.y);
      });
      graphics.strokePath();
    }

    private drawScenery() {
      // Scenery is kept sparse and pushed to the village perimeter / road edges so it frames
      // the larger buildings instead of cluttering or overlapping them.
      const treePositions = [
        [-400, -30],
        [-360, 120],
        [-300, -150],
        [-200, -185],
        [-150, 205],
        [150, 205],
        [200, -185],
        [300, -150],
        [360, 120],
        [400, -30],
        [330, 200],
        [-330, 200],
        [0, 225],
      ];

      treePositions.forEach(([x, y], index) => {
        this.drawTree(x, y, index % 3);
      });

      [
        [-160, -50],
        [160, -50],
      ].forEach(([x, y]) => this.drawFence(x, y));

      [
        [-300, -30],
        [300, -30],
        [-180, 170],
        [180, 170],
        [0, 150],
      ].forEach(([x, y]) => this.drawRock(x, y));

      [
        [-110, -20],
        [110, -20],
        [0, 42],
        [-60, 40],
        [60, 40],
        [-275, 30],
        [275, 30],
        [-160, 40],
        [160, 40],
      ].forEach(([x, y], index) => this.drawBush(x, y, index % 4));

      [
        [-70, -10],
        [70, -10],
        [-30, 30],
        [30, 30],
        [-150, 108],
        [150, 108],
      ].forEach(([x, y], index) => this.drawFlowerClump(x, y, index));

      [
        [-58, 8],
        [58, 8],
        [-150, -30],
        [150, -30],
      ].forEach(([x, y]) => this.drawLanternPost(x, y));

      [
        [160, 60],
        [-285, 92],
        [300, 96],
      ].forEach(([x, y], index) => this.drawCrateStack(x, y, index));

      this.drawWell(60, 150);
    }

    private drawBuildings() {
      // Place each building on its grid lot and depth-sort by world y so nearer (lower)
      // buildings draw in front.
      const placed = options.buildings.map((building) => {
        const asset = getBuildingAsset(building.id);
        const world = this.gridToWorld(asset.gridCol, asset.gridRow);
        return { building, asset, world };
      });
      placed.sort((a, b) => a.world.y - b.world.y);

      placed.forEach(({ building, asset, world }) => {
        const { x, y } = this.toScreen(world.x, world.y);
        const palette = buildingStatusPalette[building.status];
        const accent = categoryAccent[building.category] ?? 0xffffff;
        const labelText = this.getBuildingLabel(building.id, building.shortName);
        const container = this.add.container(x, y);
        // The sprite is drawn with its anchor at the container origin, so these bounds describe
        // exactly where the visible building sits and where its base meets the lot.
        const groundY = (1 - asset.anchor.y) * asset.height; // base line, on top of the lot
        const spriteTop = -asset.anchor.y * asset.height;
        const hitWidth = asset.width;
        const hitHeight = asset.height;

        // Small status glow resting on the lot (a grounded accent, NOT a floating drop shadow).
        const glow = this.add.ellipse(
          0,
          groundY - 4,
          asset.lotWidth * 0.5,
          asset.lotHeight * 0.42,
          palette.glow,
          0.18,
        );
        // Selection/hover highlight: an iso diamond that lights up the building's lot.
        const highlight = this.add.polygon(
          0,
          groundY,
          this.isoDiamondPoints(0, 0, asset.lotWidth + 6, asset.lotHeight + 4),
          0xfff3b0,
          0,
        );
        highlight.setStrokeStyle(3, 0xfff3b0, 0);
        const art = this.createBuildingArt(asset, accent);
        const lantern = this.add.circle(
          asset.width * 0.3,
          spriteTop + asset.height * 0.32,
          5,
          palette.glow,
          0.94,
        );
        const labelBg = this.add.rectangle(
          0,
          asset.labelOffsetY,
          Math.max(58, labelText.length * 8 + 18),
          22,
          0x0b1210,
          0.72,
        );
        const label = this.add
          .text(0, asset.labelOffsetY - 1, labelText, {
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
          .text(0, groundY + asset.statusOffsetY, palette.label, {
            align: "center",
            color: "#e6ddb5",
            fontFamily: "Geist Mono, monospace",
            fontSize: "10px",
            stroke: "#132016",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0);

        labelBg.setStrokeStyle(1, palette.glow, 0.24);
        // Highlight sits behind the building so its lit lot edges show around the base.
        container.add([
          glow,
          highlight,
          ...art,
          lantern,
          labelBg,
          label,
          statusText,
        ]);
        // Screen-space y keeps buildings above the ground layers (roads/lots at depth 0) while
        // still sorting nearer buildings in front.
        container.setDepth(y);
        container.setSize(hitWidth, hitHeight);
        // Hit area matches the full visible sprite so the whole building is clickable/hoverable.
        container.setInteractive(
          new PhaserLib.Geom.Rectangle(-hitWidth / 2, spriteTop, hitWidth, hitHeight),
          PhaserLib.Geom.Rectangle.Contains,
        );
        container.on("pointerover", () => {
          this.tweens.add({ targets: container, scale: 1.04, duration: 150, ease: "Sine.easeOut" });
          glow.setAlpha(0.3);
          if (this.selectedBuildingId !== building.id) {
            highlight.setStrokeStyle(3, 0xfff3b0, 0.4);
          }
        });
        container.on("pointerout", () => {
          this.tweens.add({ targets: container, scale: 1, duration: 160, ease: "Sine.easeOut" });
          glow.setAlpha(0.18);
          if (this.selectedBuildingId !== building.id) {
            highlight.setStrokeStyle(3, 0xfff3b0, 0);
          }
        });
        container.on("pointerdown", () => {
          options.onSelectBuilding(building.id);
          this.setSelectedBuilding(building.id);
        });

        this.tweens.add({
          targets: [lantern, glow],
          alpha: { from: 0.18, to: building.status === "idle" ? 0.26 : 0.46 },
          duration: 1100 + Math.round(Math.random() * 500),
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        this.buildingNodes.set(building.id, { container, glow, highlight, label, statusText });
      });
    }

    private createBuildingArt(asset: BuildingAssetConfig, accent: number) {
      if (asset.spriteEnabled && !this.failedAssetKeys.has(asset.key) && this.textures.exists(asset.key)) {
        const sprite = this.add
          .image(0, 0, asset.key)
          .setDisplaySize(asset.width, asset.height)
          .setOrigin(asset.anchor.x, asset.anchor.y);

        return [sprite];
      }

      return this.createFallbackBuilding(asset, accent);
    }

    private createFallbackBuilding(asset: BuildingAssetConfig, accent: number) {
      const style = asset.fallbackStyle;

      switch (style.silhouette) {
        case "keep":
          return this.createKeepFallback(asset, style, accent);
        case "treasury":
          return this.createTreasuryFallback(asset, style, accent);
        case "studio":
          return this.createStudioFallback(asset, style, accent);
        case "workshop":
          return this.createWorkshopFallback(asset, style, accent);
        case "guild":
          return this.createGuildFallback(asset, style, accent);
        case "court":
          return this.createCourtFallback(asset, style, accent);
        case "library":
          return this.createLibraryFallback(asset, style, accent);
        case "engineering":
          return this.createEngineeringFallback(asset, style, accent);
        case "tower":
          return this.createTowerFallback(asset, style, accent);
      }
    }

    private createHouseCore(
      asset: BuildingAssetConfig,
      style: BuildingFallbackStyle,
      accent: number,
      options: {
        wallWidth?: number;
        wallHeight?: number;
        roofHeight?: number;
        footY?: number;
        doorWidth?: number;
        doorHeight?: number;
      } = {},
    ) {
      const wallWidth = options.wallWidth ?? asset.width * 0.56;
      const wallHeight = options.wallHeight ?? asset.height * 0.34;
      const roofHeight = options.roofHeight ?? asset.height * 0.28;
      const footY = options.footY ?? 14;
      const wallCenterY = footY - wallHeight / 2;
      const roofY = wallCenterY - wallHeight / 2;
      const sideDepth = Math.max(18, wallWidth * 0.24);
      const items: Phaser.GameObjects.GameObject[] = [];

      const side = this.add.polygon(
        wallWidth / 2,
        wallCenterY + 3,
        [0, -wallHeight / 2, sideDepth, -wallHeight / 2 - 10, sideDepth, wallHeight / 2 - 6, 0, wallHeight / 2],
        style.sideColor,
        0.96,
      );
      const front = this.add.rectangle(0, wallCenterY, wallWidth, wallHeight, style.wallColor, 0.98);
      const roof = this.add.polygon(
        0,
        roofY - 8,
        [
          -wallWidth / 2 - 18,
          18,
          -wallWidth * 0.18,
          -roofHeight,
          wallWidth * 0.18,
          -roofHeight,
          wallWidth / 2 + 18,
          18,
          wallWidth / 2 + 7,
          32,
          0,
          6,
          -wallWidth / 2 - 7,
          32,
        ],
        style.roofColor,
        0.98,
      );
      const roofShade = this.add.polygon(
        wallWidth * 0.22,
        roofY + 2,
        [0, -roofHeight + 2, wallWidth * 0.34, 9, wallWidth * 0.22, 21, -wallWidth * 0.1, -2],
        style.roofDarkColor,
        0.44,
      );
      const roofHighlight = this.add.rectangle(-wallWidth * 0.16, roofY - 12, wallWidth * 0.42, 4, this.lighten(style.roofColor), 0.42);
      roofHighlight.setRotation(-0.46);
      const door = this.add.rectangle(
        -wallWidth * 0.12,
        footY - (options.doorHeight ?? 27) / 2,
        options.doorWidth ?? 15,
        options.doorHeight ?? 27,
        0x342116,
        0.96,
      );
      const windowA = this.add.rectangle(-wallWidth * 0.32, wallCenterY - 4, 9, 13, accent, 0.8);
      const windowB = this.add.rectangle(wallWidth * 0.25, wallCenterY - 2, 9, 13, accent, 0.78);

      side.setStrokeStyle(1, 0x1b130d, 0.28);
      front.setStrokeStyle(1, style.trimColor, 0.22);
      roof.setStrokeStyle(2, style.trimColor, 0.3);
      door.setStrokeStyle(1, 0x0f0906, 0.35);
      windowA.setStrokeStyle(1, 0xe9fbff, 0.22);
      windowB.setStrokeStyle(1, 0xe9fbff, 0.22);

      items.push(side, front, roof, roofShade, roofHighlight, door, windowA, windowB);

      return { items, wallWidth, wallHeight, wallCenterY, roofY, footY };
    }

    private createKeepFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const items: Phaser.GameObjects.GameObject[] = [];
      [-46, 47].forEach((towerX, index) => {
        const tower = this.add.rectangle(towerX, -26, 26, 58, style.sideColor, 0.98);
        const cap = this.add.polygon(
          towerX,
          -63,
          [-20, 16, 0, -16, 20, 16, 13, 26, 0, 9, -13, 26],
          index === 0 ? style.roofDarkColor : style.roofColor,
          0.98,
        );
        const slit = this.add.rectangle(towerX, -28, 5, 16, accent, 0.78);
        tower.setStrokeStyle(1, style.trimColor, 0.22);
        cap.setStrokeStyle(1, style.trimColor, 0.28);
        items.push(tower, cap, slit);
      });

      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 82,
        wallHeight: 48,
        roofHeight: 34,
        doorWidth: 18,
        doorHeight: 32,
      });
      const bannerPole = this.add.rectangle(0, -76, 4, 38, style.trimColor, 0.78);
      const banner = this.add.polygon(12, -84, [-2, -11, 26, -5, 21, 10, -2, 7], accent, 0.88);
      banner.setStrokeStyle(1, 0x07100b, 0.24);

      return [...items, ...core.items, bannerPole, banner];
    }

    private createTreasuryFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 70,
        wallHeight: 40,
        roofHeight: 24,
      });
      const pediment = this.add.polygon(0, core.roofY - 31, [-42, 24, 0, -7, 42, 24], style.trimColor, 0.36);
      const vaultTop = this.add.circle(0, core.footY - 23, 15, 0x1f2933, 0.96);
      const vaultBottom = this.add.rectangle(0, core.footY - 12, 30, 23, 0x1f2933, 0.96);
      const vaultRim = this.add.circle(0, core.footY - 14, 7, accent, 0.5);
      const coinA = this.add.circle(-40, core.footY - 2, 5, 0xfcd34d, 0.82);
      const coinB = this.add.circle(39, core.footY - 4, 4, 0xfbbf24, 0.78);
      [vaultTop, vaultBottom].forEach((item) => item.setStrokeStyle(1, style.trimColor, 0.28));

      return [...core.items, pediment, vaultTop, vaultBottom, vaultRim, coinA, coinB];
    }

    private createStudioFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 68,
        wallHeight: 38,
        roofHeight: 28,
      });
      const skylight = this.add.rectangle(-10, core.roofY - 22, 26, 8, 0xbae6fd, 0.74);
      skylight.setRotation(-0.45);
      const palette = this.add.circle(37, core.wallCenterY - 8, 8, style.trimColor, 0.82);
      const paintA = this.add.circle(34, core.wallCenterY - 10, 2, 0xfb7185, 0.9);
      const paintB = this.add.circle(39, core.wallCenterY - 5, 2, 0xfbbf24, 0.9);
      const paintC = this.add.circle(42, core.wallCenterY - 11, 2, 0x34d399, 0.9);
      const pennantLine = this.add.rectangle(0, core.roofY - 38, 52, 2, style.trimColor, 0.6);
      pennantLine.setRotation(0.1);

      return [...core.items, skylight, palette, paintA, paintB, paintC, pennantLine];
    }

    private createWorkshopFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const chimney = this.add.rectangle(34, -56, 14, 36, 0x4a2d1d, 0.96);
      const smoke = this.add.circle(39, -82, 8, 0x91a39a, 0.22);
      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 72,
        wallHeight: 39,
        roofHeight: 27,
      });
      const gear = this.add.circle(38, core.wallCenterY + 4, 9, 0x1f2933, 0.8);
      const gearHub = this.add.circle(38, core.wallCenterY + 4, 3, accent, 0.82);
      const crate = this.add.rectangle(-43, core.footY - 5, 14, 14, 0x8d6336, 0.82);
      gear.setStrokeStyle(2, style.trimColor, 0.32);
      crate.setStrokeStyle(1, style.trimColor, 0.24);

      return [chimney, smoke, ...core.items, gear, gearHub, crate];
    }

    private createGuildFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 76,
        wallHeight: 41,
        roofHeight: 29,
      });
      const signPost = this.add.rectangle(47, core.wallCenterY - 10, 3, 30, style.trimColor, 0.78);
      const sign = this.add.rectangle(55, core.wallCenterY + 1, 25, 14, 0x3b2518, 0.94);
      const mug = this.add.circle(55, core.wallCenterY + 1, 4, accent, 0.76);
      const awning = this.add.rectangle(-5, core.footY - 33, 52, 6, style.trimColor, 0.34);
      awning.setRotation(-0.04);
      sign.setStrokeStyle(1, style.trimColor, 0.35);

      return [...core.items, signPost, sign, mug, awning];
    }

    private createCourtFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const items: Phaser.GameObjects.GameObject[] = [];
      const body = this.add.rectangle(0, -10, 78, 46, style.wallColor, 0.98);
      const side = this.add.polygon(39, -9, [0, -23, 20, -31, 20, 19, 0, 23], style.sideColor, 0.96);
      const pediment = this.add.polygon(0, -52, [-54, 29, 0, -18, 54, 29], style.roofColor, 0.98);
      const baseStep = this.add.rectangle(0, 17, 92, 9, style.trimColor, 0.36);
      body.setStrokeStyle(1, style.trimColor, 0.22);
      side.setStrokeStyle(1, 0x1b130d, 0.24);
      pediment.setStrokeStyle(2, style.trimColor, 0.32);
      items.push(side, body, pediment, baseStep);

      [-27, -9, 9, 27].forEach((columnX) => {
        const column = this.add.rectangle(columnX, -3, 7, 40, style.trimColor, 0.76);
        const cap = this.add.rectangle(columnX, -24, 12, 4, 0xf0ddab, 0.72);
        const foot = this.add.rectangle(columnX, 18, 13, 5, 0xd8c690, 0.66);
        items.push(column, cap, foot);
      });

      const lantern = this.add.circle(42, -34, 4, accent, 0.9);
      return [...items, lantern];
    }

    private createLibraryFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const backTower = this.add.rectangle(-36, -31, 26, 66, style.sideColor, 0.96);
      const backRoof = this.add.polygon(-36, -75, [-18, 15, 0, -15, 18, 15, 11, 25, 0, 8, -11, 25], style.roofDarkColor, 0.98);
      const core = this.createHouseCore(asset, style, accent, {
        wallWidth: 70,
        wallHeight: 44,
        roofHeight: 27,
      });
      const bookA = this.add.rectangle(28, core.wallCenterY + 4, 6, 25, 0x7c3aed, 0.8);
      const bookB = this.add.rectangle(36, core.wallCenterY + 2, 6, 29, 0x0ea5e9, 0.8);
      const bookC = this.add.rectangle(44, core.wallCenterY + 6, 6, 21, 0xf59e0b, 0.8);
      const arch = this.add.rectangle(-8, core.footY - 15, 20, 30, 0x302620, 0.82);
      backTower.setStrokeStyle(1, style.trimColor, 0.24);
      backRoof.setStrokeStyle(1, style.trimColor, 0.24);
      bookA.setStrokeStyle(1, style.trimColor, 0.24);
      bookB.setStrokeStyle(1, style.trimColor, 0.24);
      bookC.setStrokeStyle(1, style.trimColor, 0.24);
      arch.setStrokeStyle(1, style.trimColor, 0.24);

      return [backTower, backRoof, ...core.items, bookA, bookB, bookC, arch];
    }

    private createEngineeringFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const core = this.createWorkshopFallback(asset, style, accent);
      const items: Phaser.GameObjects.GameObject[] = [...core];
      [-54, 54].forEach((postX) => {
        const post = this.add.rectangle(postX, -12, 5, 64, 0xd9b16f, 0.72);
        const railA = this.add.rectangle(postX / 2, -36, 64, 4, 0xd9b16f, 0.68);
        const railB = this.add.rectangle(postX / 2, -10, 64, 4, 0xd9b16f, 0.62);
        railA.setRotation(postX < 0 ? -0.2 : 0.2);
        railB.setRotation(postX < 0 ? 0.14 : -0.14);
        items.push(post, railA, railB);
      });
      const sparkA = this.add.circle(48, -46, 2, accent, 0.92);
      const sparkB = this.add.circle(55, -38, 2, 0xfcd34d, 0.88);
      items.push(sparkA, sparkB);

      return items;
    }

    private createTowerFallback(asset: BuildingAssetConfig, style: BuildingFallbackStyle, accent: number) {
      const items: Phaser.GameObjects.GameObject[] = [];
      const lower = this.add.polygon(0, -14, [-28, -31, 26, -39, 34, 29, -34, 34], style.sideColor, 0.98);
      const shaft = this.add.rectangle(0, -45, 48, 78, style.wallColor, 0.98);
      const bandA = this.add.rectangle(0, -71, 54, 6, style.trimColor, 0.38);
      const bandB = this.add.rectangle(0, -28, 54, 6, style.trimColor, 0.32);
      const observatory = this.add.ellipse(0, -95, 70, 30, style.roofColor, 0.98);
      const dome = this.add.circle(0, -108, 25, style.roofDarkColor, 0.96);
      const lens = this.add.circle(19, -103, 7, accent, 0.86);
      const telescope = this.add.rectangle(36, -111, 35, 6, style.trimColor, 0.76);
      telescope.setRotation(-0.28);
      const door = this.add.rectangle(-8, 7, 15, 28, 0x261813, 0.95);
      const windowA = this.add.rectangle(0, -57, 9, 14, 0xbae6fd, 0.76);
      const windowB = this.add.rectangle(0, -17, 9, 14, 0xbae6fd, 0.72);

      lower.setStrokeStyle(1, style.trimColor, 0.25);
      shaft.setStrokeStyle(1, style.trimColor, 0.25);
      observatory.setStrokeStyle(1, style.trimColor, 0.25);
      dome.setStrokeStyle(1, style.trimColor, 0.25);
      door.setStrokeStyle(1, style.trimColor, 0.25);
      windowA.setStrokeStyle(1, style.trimColor, 0.25);
      windowB.setStrokeStyle(1, style.trimColor, 0.25);
      items.push(lower, shaft, bandA, bandB, observatory, dome, lens, telescope, door, windowA, windowB);

      return items;
    }

    private drawAgents() {
      // Agent markers wander the roads/plaza between the lots.
      const agentMarkers = [
        { x: -55, y: -30, color: 0x22d3ee },
        { x: 58, y: 8, color: 0x34d399 },
        { x: -170, y: 36, color: 0xfbbf24 },
        { x: 170, y: 36, color: 0xa78bfa },
        { x: 0, y: 150, color: 0xfb7185 },
        { x: -250, y: 110, color: 0xe6ddb5 },
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
        // Selected building lights up its full lot (iso diamond), aligned with the building.
        node.highlight.setFillStyle(0xfff3b0, selected ? 0.16 : 0);
        node.highlight.setStrokeStyle(3, 0xfff3b0, selected ? 0.95 : 0);
        node.label.setColor(selected ? "#ffffff" : "#fff8d7");
        node.statusText.setColor(selected ? "#fff3b0" : "#e6ddb5");
        node.glow.setAlpha(selected ? 0.5 : 0.18);
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

    private drawBush(x: number, y: number, variant: number) {
      const point = this.toScreen(x, y);
      const shadow = this.add.ellipse(point.x + 4, point.y + 10, 44, 12, 0x07100b, 0.18);
      const leafA = this.add.circle(point.x - 12, point.y + 2, 13 + variant, 0x376f38, 0.88);
      const leafB = this.add.circle(point.x + 2, point.y - 4, 16, variant % 2 === 0 ? 0x4f8a46 : 0x5f9d4e, 0.88);
      const leafC = this.add.circle(point.x + 15, point.y + 4, 12, 0x2f6839, 0.86);

      [shadow, leafA, leafB, leafC].forEach((item) => {
        item.setDepth(point.y + 14);
        this.tileGroup?.add(item);
      });
    }

    private drawFlowerClump(x: number, y: number, variant: number) {
      const point = this.toScreen(x, y);
      const graphics = this.add.graphics();
      const colors = [0xfde68a, 0xf9a8d4, 0x93c5fd, 0xfca5a5];

      for (let index = 0; index < 5; index += 1) {
        const flowerX = point.x + index * 7 - 14;
        const flowerY = point.y + ((index * 5 + variant) % 9) - 4;

        graphics.lineStyle(1, 0x74a15a, 0.45);
        graphics.beginPath();
        graphics.moveTo(flowerX, flowerY + 9);
        graphics.lineTo(flowerX + (index % 2 === 0 ? 2 : -2), flowerY + 1);
        graphics.strokePath();
        graphics.fillStyle(colors[(index + variant) % colors.length], 0.62);
        graphics.fillCircle(flowerX, flowerY, 2);
      }

      graphics.setDepth(point.y + 10);
      this.tileGroup?.add(graphics);
    }

    private drawLanternPost(x: number, y: number) {
      const point = this.toScreen(x, y);
      const post = this.add.rectangle(point.x, point.y - 9, 5, 34, 0x6b4428, 0.88);
      const arm = this.add.rectangle(point.x + 10, point.y - 24, 24, 4, 0x8d6336, 0.82);
      const lantern = this.add.circle(point.x + 22, point.y - 22, 6, 0xfbbf24, 0.76);
      const glow = this.add.circle(point.x + 22, point.y - 22, 15, 0xfbbf24, 0.12);
      const shadow = this.add.ellipse(point.x + 4, point.y + 10, 24, 8, 0x07100b, 0.18);

      [shadow, post, arm, glow, lantern].forEach((item) => {
        item.setDepth(point.y + 12);
        this.tileGroup?.add(item);
      });
    }

    private drawCrateStack(x: number, y: number, variant: number) {
      const point = this.toScreen(x, y);
      const shadow = this.add.ellipse(point.x + 4, point.y + 10, 42, 12, 0x07100b, 0.18);
      const crateA = this.add.rectangle(point.x - 10, point.y, 18, 16, 0x8d6336, 0.84);
      const crateB = this.add.rectangle(point.x + 8, point.y + 2, 18, 16, 0x6f4828, 0.84);
      const barrel = this.add.ellipse(point.x + (variant % 2 === 0 ? 22 : -24), point.y + 2, 15, 18, 0x70411f, 0.82);

      [crateA, crateB].forEach((crate) => crate.setStrokeStyle(1, 0xd9b16f, 0.22));
      barrel.setStrokeStyle(1, 0xd9b16f, 0.24);
      [shadow, crateA, crateB, barrel].forEach((item) => {
        item.setDepth(point.y + 16);
        this.tileGroup?.add(item);
      });
    }

    private drawWell(x: number, y: number) {
      const point = this.toScreen(x, y);
      const shadow = this.add.ellipse(point.x + 4, point.y + 18, 58, 16, 0x07100b, 0.2);
      const base = this.add.ellipse(point.x, point.y + 7, 42, 24, 0x6b6254, 0.9);
      const water = this.add.ellipse(point.x, point.y + 4, 28, 12, 0x155e75, 0.7);
      const postA = this.add.rectangle(point.x - 22, point.y - 14, 5, 38, 0x8d6336, 0.85);
      const postB = this.add.rectangle(point.x + 22, point.y - 14, 5, 38, 0x8d6336, 0.85);
      const roof = this.add.polygon(point.x, point.y - 39, [-34, 14, 0, -14, 34, 14, 24, 24, 0, 4, -24, 24], 0x8f5729, 0.94);

      base.setStrokeStyle(1, 0xd8d0ba, 0.28);
      water.setStrokeStyle(1, 0x67e8f9, 0.2);
      roof.setStrokeStyle(1, 0xd9b16f, 0.28);
      [shadow, base, water, postA, postB, roof].forEach((item) => {
        item.setDepth(point.y + 24);
        this.tileGroup?.add(item);
      });
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

    // Isometric grid cell -> world px. Fractional col/row are allowed so roads can run along
    // the lines between lots.
    private gridToWorld(col: number, row: number) {
      return {
        x: GRID_ORIGIN_X + (col - row) * GRID_TILE_HALF_W,
        y: GRID_ORIGIN_Y + (col + row) * GRID_TILE_HALF_H,
      };
    }

    private gridToScreen(col: number, row: number) {
      const world = this.gridToWorld(col, row);
      return this.toScreen(world.x, world.y);
    }
  }

  return new VillageScene();
}
