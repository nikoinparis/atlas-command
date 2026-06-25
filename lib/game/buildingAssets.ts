export type BuildingSilhouette =
  | "keep"
  | "treasury"
  | "studio"
  | "workshop"
  | "guild"
  | "court"
  | "library"
  | "engineering"
  | "tower";

export interface BuildingFallbackStyle {
  silhouette: BuildingSilhouette;
  wallColor: number;
  sideColor: number;
  roofColor: number;
  roofDarkColor: number;
  trimColor: number;
  accentColor: number;
}

export interface BuildingAssetConfig {
  key: string;
  path: string;
  spriteEnabled: boolean;
  /**
   * Logical lot on the isometric village grid. The scene converts (gridCol, gridRow) into
   * world/screen coordinates, so buildings are placed on intentional grid lots rather than
   * scattered pixel positions. Roads are drawn along the grid lines between these lots.
   */
  gridCol: number;
  gridRow: number;
  /** Displayed sprite size in world px. The full sprite is also the clickable footprint. */
  width: number;
  height: number;
  /**
   * Sprite origin. y is kept near the bottom so the base of the building lands on its
   * ground lot (no floating). The scene derives the ground line, lot pad, hit area, and
   * selection highlight from width/height/anchor.
   */
  anchor: {
    x: number;
    y: number;
  };
  /** Isometric ground pad/lot drawn under the building base (replaces drop shadows). */
  lotWidth: number;
  lotHeight: number;
  labelOffsetY: number;
  statusOffsetY: number;
  fallbackStyle: BuildingFallbackStyle;
}

export const buildingAssetRegistry: Record<string, BuildingAssetConfig> = {
  "keep-hall": {
    key: "building-hq",
    path: "/assets/buildings/hq.png",
    spriteEnabled: true,
    gridCol: 0,
    gridRow: 0,
    width: 188,
    height: 176,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 150,
    lotHeight: 64,
    labelOffsetY: -174,
    statusOffsetY: 38,
    fallbackStyle: {
      silhouette: "keep",
      wallColor: 0x75523a,
      sideColor: 0x4d3426,
      roofColor: 0x315b49,
      roofDarkColor: 0x1f3d33,
      trimColor: 0xd8bc82,
      accentColor: 0x67e8f9,
    },
  },
  treasury: {
    key: "building-treasury",
    path: "/assets/buildings/treasury.png",
    spriteEnabled: true,
    gridCol: -2,
    gridRow: 0,
    width: 150,
    height: 218,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 120,
    lotHeight: 52,
    labelOffsetY: -212,
    statusOffsetY: 32,
    fallbackStyle: {
      silhouette: "treasury",
      wallColor: 0x80552b,
      sideColor: 0x55341f,
      roofColor: 0xc47a2d,
      roofDarkColor: 0x8b4e1f,
      trimColor: 0xf0d08a,
      accentColor: 0xfcd34d,
    },
  },
  "content-studio": {
    key: "building-content-studio",
    path: "/assets/buildings/content-studio.png",
    spriteEnabled: true,
    gridCol: 2,
    gridRow: 0,
    width: 148,
    height: 214,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 118,
    lotHeight: 52,
    labelOffsetY: -209,
    statusOffsetY: 32,
    fallbackStyle: {
      silhouette: "studio",
      wallColor: 0x4d5e61,
      sideColor: 0x344347,
      roofColor: 0x3f86a8,
      roofDarkColor: 0x286176,
      trimColor: 0xd5f3ff,
      accentColor: 0x22d3ee,
    },
  },
  "product-workshop": {
    key: "building-product-workshop",
    path: "/assets/buildings/product-workshop.png",
    spriteEnabled: true,
    gridCol: 0.95,
    gridRow: 1,
    width: 150,
    height: 218,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 120,
    lotHeight: 52,
    labelOffsetY: -212,
    statusOffsetY: 32,
    fallbackStyle: {
      silhouette: "workshop",
      wallColor: 0x78533a,
      sideColor: 0x4f3324,
      roofColor: 0x925c2f,
      roofDarkColor: 0x66381f,
      trimColor: 0xe5b86d,
      accentColor: 0x34d399,
    },
  },
  "freelance-guild": {
    key: "building-freelance-guild",
    path: "/assets/buildings/freelance-guild.png",
    spriteEnabled: true,
    gridCol: -2.5,
    gridRow: 1,
    width: 152,
    height: 222,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 122,
    lotHeight: 53,
    labelOffsetY: -216,
    statusOffsetY: 33,
    fallbackStyle: {
      silhouette: "guild",
      wallColor: 0x714522,
      sideColor: 0x4c2e1c,
      roofColor: 0xb8752b,
      roofDarkColor: 0x7d461c,
      trimColor: 0xf0c77b,
      accentColor: 0xfbbf24,
    },
  },
  "engineering-workshop": {
    key: "building-engineering-workshop",
    path: "/assets/buildings/engineering-workshop.png",
    spriteEnabled: true,
    gridCol: 2.5,
    gridRow: 1,
    width: 154,
    height: 226,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 123,
    lotHeight: 53,
    labelOffsetY: -219,
    statusOffsetY: 33,
    fallbackStyle: {
      silhouette: "engineering",
      wallColor: 0x5b5047,
      sideColor: 0x3e342f,
      roofColor: 0x4b8dbb,
      roofDarkColor: 0x2f5d79,
      trimColor: 0xbfd9e8,
      accentColor: 0x7dd3fc,
    },
  },
  "approval-court": {
    key: "building-approval-court",
    path: "/assets/buildings/approval-court.png",
    spriteEnabled: true,
    gridCol: -0.95,
    gridRow: 1,
    width: 164,
    height: 240,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 132,
    lotHeight: 56,
    labelOffsetY: -232,
    statusOffsetY: 34,
    fallbackStyle: {
      silhouette: "court",
      wallColor: 0x67604d,
      sideColor: 0x454033,
      roofColor: 0x3f7d63,
      roofDarkColor: 0x2b5545,
      trimColor: 0xf0ddab,
      accentColor: 0xfbbf24,
    },
  },
  "research-library": {
    key: "building-research-library",
    path: "/assets/buildings/research-library.png",
    spriteEnabled: true,
    gridCol: -1.8,
    gridRow: 2,
    width: 150,
    height: 218,
    anchor: { x: 0.5, y: 0.9 },
    lotWidth: 120,
    lotHeight: 52,
    labelOffsetY: -212,
    statusOffsetY: 32,
    fallbackStyle: {
      silhouette: "library",
      wallColor: 0x62544f,
      sideColor: 0x413630,
      roofColor: 0x817b7f,
      roofDarkColor: 0x5b5358,
      trimColor: 0xd8d0ba,
      accentColor: 0xa78bfa,
    },
  },
  "allocation-tower": {
    key: "building-atlas-tower",
    path: "/assets/buildings/atlas-tower.png",
    spriteEnabled: true,
    gridCol: 1.8,
    gridRow: 2,
    width: 156,
    height: 250,
    anchor: { x: 0.5, y: 0.92 },
    lotWidth: 125,
    lotHeight: 54,
    labelOffsetY: -246,
    statusOffsetY: 33,
    fallbackStyle: {
      silhouette: "tower",
      wallColor: 0x435d61,
      sideColor: 0x2f4248,
      roofColor: 0x2f7d8e,
      roofDarkColor: 0x205864,
      trimColor: 0xd2edf2,
      accentColor: 0xfcd34d,
    },
  },
};

const defaultAsset = buildingAssetRegistry["product-workshop"];

export function getBuildingAsset(buildingId: string) {
  return buildingAssetRegistry[buildingId] ?? defaultAsset;
}

export function getBuildingAssets() {
  return Object.values(buildingAssetRegistry);
}

export function getEnabledBuildingAssets() {
  return Object.values(buildingAssetRegistry).filter((asset) => asset.spriteEnabled);
}
