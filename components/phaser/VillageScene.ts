import type Phaser from "phaser";
import { buildingStatusPalette, categoryAccent } from "@/components/phaser/buildingSprites";
import type { VillageSceneApi, VillageSceneOptions } from "@/components/phaser/gameTypes";
import {
  getBuildingAsset,
  getBuildingAssets,
  type BuildingAssetConfig,
  type BuildingFallbackStyle,
} from "@/lib/game/buildingAssets";

const SHOW_BUILDING_CLICK_ZONES = false;

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
    private failedAssetKeys = new Set<string>();
    private isReady = false;

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
      graphics.fillGradientStyle(0x274b2b, 0x2c5932, 0x183920, 0x102719, 1);
      graphics.fillRect(0, 0, width, height);
      graphics.fillStyle(0x0b1712, 0.08);
      graphics.fillRect(0, 0, width, 96);
      graphics.fillStyle(0x0b1712, 0.1);
      graphics.fillRect(0, height - 104, width, 104);

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
      const branchD = [this.toScreen(178, -8), this.toScreen(248, -82), this.toScreen(330, -116)];
      const branchE = [this.toScreen(-180, 86), this.toScreen(-272, 34), this.toScreen(-356, -34)];

      this.strokePath(graphics, pathPoints, 48, 0x6d5934, 0.16, 9);
      this.strokePath(graphics, pathPoints, 42, 0xefe0ad, 0.82, 9);
      this.strokePath(graphics, pathPoints, 28, 0xcaa976, 0.42, 9);
      [branchA, branchB, branchC, branchD, branchE].forEach((branch) => {
        this.strokePath(graphics, branch, 34, 0x6d5934, 0.13, 7);
        this.strokePath(graphics, branch, 30, 0xefe0ad, 0.72, 7);
        this.strokePath(graphics, branch, 19, 0xcaa976, 0.38, 7);
      });

      graphics.fillStyle(0x866a43, 0.28);
      [
        this.toScreen(-260, 150),
        this.toScreen(-84, 56),
        this.toScreen(84, 42),
        this.toScreen(226, 76),
        this.toScreen(-64, -72),
        this.toScreen(272, -92),
        this.toScreen(-302, -12),
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
      const treePositions = [
        [-470, -190],
        [-390, -118],
        [-518, -66],
        [-432, 34],
        [-388, 252],
        [-238, 278],
        [280, -180],
        [346, -246],
        [410, -94],
        [436, 100],
        [492, 176],
        [340, 262],
        [48, 318],
        [-36, -242],
        [198, 312],
        [-520, 176],
        [500, -18],
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

      [
        [-336, -52],
        [-288, -88],
        [-220, 166],
        [-92, -158],
        [128, -146],
        [218, -72],
        [294, 128],
        [172, 188],
        [18, 238],
        [398, 28],
      ].forEach(([x, y], index) => this.drawBush(x, y, index % 4));

      [
        [-176, 138],
        [-124, 104],
        [54, 82],
        [118, 54],
        [244, 104],
        [-34, -98],
        [174, -126],
        [-294, 74],
      ].forEach(([x, y], index) => this.drawFlowerClump(x, y, index));

      [
        [-246, 100],
        [238, -34],
        [108, 166],
        [-58, -112],
      ].forEach(([x, y]) => this.drawLanternPost(x, y));

      [
        [-210, 136],
        [286, 86],
        [92, 208],
      ].forEach(([x, y], index) => this.drawCrateStack(x, y, index));

      this.drawWell(-70, 18);
    }

    private drawBuildings() {
      const sorted = [...options.buildings].sort((a, b) => a.position.y - b.position.y);
      sorted.forEach((building) => {
        const { x, y } = this.toScreen(building.position.x, building.position.y);
        const asset = getBuildingAsset(building.id);
        const palette = buildingStatusPalette[building.status];
        const accent = categoryAccent[building.category] ?? 0xffffff;
        const labelText = this.getBuildingLabel(building.id, building.shortName);
        const container = this.add.container(x, y);
        const glow = this.add.ellipse(
          asset.shadow.offsetX,
          asset.shadow.offsetY - 4,
          asset.shadow.width + 42,
          asset.shadow.height + 24,
          palette.glow,
          0.14,
        );
        const shadow = this.add.ellipse(
          asset.shadow.offsetX,
          asset.shadow.offsetY,
          asset.shadow.width,
          asset.shadow.height,
          0x07100b,
          asset.shadow.alpha,
        );
        const base = this.add.rectangle(
          0,
          asset.clickZone.offsetY + asset.clickZone.height / 2,
          asset.clickZone.width,
          asset.clickZone.height,
          0x000000,
          0,
        );
        const art = this.createBuildingArt(asset, accent);
        const lantern = this.add.circle(asset.width / 2 - 18, asset.statusOffsetY - 42, 5, palette.glow, 0.94);
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
          .text(0, asset.statusOffsetY, palette.label, {
            align: "center",
            color: "#e6ddb5",
            fontFamily: "Geist Mono, monospace",
            fontSize: "10px",
            stroke: "#132016",
            strokeThickness: 3,
          })
          .setOrigin(0.5, 0);

        labelBg.setStrokeStyle(1, palette.glow, 0.24);
        base.setFillStyle(0x22d3ee, SHOW_BUILDING_CLICK_ZONES ? 0.06 : 0);
        base.setStrokeStyle(2, 0x22d3ee, SHOW_BUILDING_CLICK_ZONES ? 0.28 : 0);
        base.setVisible(SHOW_BUILDING_CLICK_ZONES);
        container.add([
          glow,
          shadow,
          base,
          ...art,
          lantern,
          labelBg,
          label,
          statusText,
        ]);
        container.setDepth(y);
        container.setSize(asset.clickZone.width, asset.clickZone.height);
        container.setInteractive(
          new PhaserLib.Geom.Rectangle(
            -asset.clickZone.width / 2,
            asset.clickZone.offsetY,
            asset.clickZone.width,
            asset.clickZone.height,
          ),
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
        node.base.setVisible(selected || SHOW_BUILDING_CLICK_ZONES);
        node.base.setFillStyle(0x22d3ee, SHOW_BUILDING_CLICK_ZONES && !selected ? 0.06 : 0);
        node.base.setStrokeStyle(
          selected ? 4 : 2,
          selected ? 0xfff3b0 : 0x22d3ee,
          selected ? 0.9 : SHOW_BUILDING_CLICK_ZONES ? 0.28 : 0,
        );
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
  }

  return new VillageScene();
}
