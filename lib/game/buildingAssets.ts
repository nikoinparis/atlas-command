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
  width: number;
  height: number;
  anchor: {
    x: number;
    y: number;
  };
  labelOffsetY: number;
  statusOffsetY: number;
  clickZone: {
    width: number;
    height: number;
    offsetY: number;
  };
  shadow: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    alpha: number;
  };
  fallbackStyle: BuildingFallbackStyle;
}

export const buildingAssetRegistry: Record<string, BuildingAssetConfig> = {
  "keep-hall": {
    key: "building-hq",
    path: "/assets/buildings/hq.png",
    spriteEnabled: false,
    width: 148,
    height: 128,
    anchor: { x: 0.5, y: 0.82 },
    labelOffsetY: -118,
    statusOffsetY: 66,
    clickZone: { width: 154, height: 150, offsetY: -34 },
    shadow: { width: 154, height: 34, offsetX: 6, offsetY: 34, alpha: 0.3 },
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
    spriteEnabled: false,
    width: 124,
    height: 104,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -102,
    statusOffsetY: 58,
    clickZone: { width: 132, height: 126, offsetY: -30 },
    shadow: { width: 134, height: 30, offsetX: 5, offsetY: 32, alpha: 0.28 },
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
    spriteEnabled: false,
    width: 120,
    height: 100,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -100,
    statusOffsetY: 56,
    clickZone: { width: 128, height: 122, offsetY: -30 },
    shadow: { width: 130, height: 28, offsetX: 5, offsetY: 31, alpha: 0.27 },
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
    spriteEnabled: false,
    width: 122,
    height: 104,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -102,
    statusOffsetY: 58,
    clickZone: { width: 132, height: 126, offsetY: -30 },
    shadow: { width: 132, height: 30, offsetX: 5, offsetY: 32, alpha: 0.28 },
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
    spriteEnabled: false,
    width: 126,
    height: 104,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -102,
    statusOffsetY: 58,
    clickZone: { width: 136, height: 126, offsetY: -30 },
    shadow: { width: 136, height: 30, offsetX: 5, offsetY: 32, alpha: 0.28 },
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
    spriteEnabled: false,
    width: 130,
    height: 108,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -104,
    statusOffsetY: 60,
    clickZone: { width: 140, height: 130, offsetY: -31 },
    shadow: { width: 140, height: 30, offsetX: 5, offsetY: 33, alpha: 0.29 },
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
    spriteEnabled: false,
    width: 132,
    height: 108,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -104,
    statusOffsetY: 60,
    clickZone: { width: 140, height: 130, offsetY: -31 },
    shadow: { width: 140, height: 30, offsetX: 5, offsetY: 33, alpha: 0.3 },
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
    spriteEnabled: false,
    width: 122,
    height: 112,
    anchor: { x: 0.5, y: 0.85 },
    labelOffsetY: -108,
    statusOffsetY: 60,
    clickZone: { width: 132, height: 132, offsetY: -34 },
    shadow: { width: 132, height: 30, offsetX: 5, offsetY: 34, alpha: 0.28 },
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
    spriteEnabled: false,
    width: 126,
    height: 142,
    anchor: { x: 0.5, y: 0.88 },
    labelOffsetY: -132,
    statusOffsetY: 70,
    clickZone: { width: 134, height: 156, offsetY: -48 },
    shadow: { width: 132, height: 32, offsetX: 6, offsetY: 38, alpha: 0.3 },
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

export function getEnabledBuildingAssets() {
  return Object.values(buildingAssetRegistry).filter((asset) => asset.spriteEnabled);
}
