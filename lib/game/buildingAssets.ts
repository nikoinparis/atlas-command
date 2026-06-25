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
  /** Displayed sprite size in world px. The full sprite is also the clickable footprint. */
  width: number;
  height: number;
  /**
   * Origin used when drawing the sprite. y is kept near the bottom so the base of the
   * building lands on the ground (no floating). The scene derives the ground line,
   * shadow, hit area, and selection highlight from width/height/anchor.
   */
  anchor: {
    x: number;
    y: number;
  };
  labelOffsetY: number;
  statusOffsetY: number;
  /**
   * Ground-contact shadow. Sits tightly under the building base (offset is derived from
   * the anchor in the scene), so it reads as contact rather than a floating blob.
   */
  shadow: {
    width: number;
    height: number;
    alpha: number;
  };
  fallbackStyle: BuildingFallbackStyle;
}

export const buildingAssetRegistry: Record<string, BuildingAssetConfig> = {
  "keep-hall": {
    key: "building-hq",
    path: "/assets/buildings/hq.png",
    spriteEnabled: true,
    width: 188,
    height: 188,
    anchor: { x: 0.5, y: 0.84 },
    labelOffsetY: -174,
    statusOffsetY: 46,
    shadow: { width: 118, height: 28, alpha: 0.3 },
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
    width: 152,
    height: 226,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -214,
    statusOffsetY: 44,
    shadow: { width: 96, height: 23, alpha: 0.28 },
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
    width: 150,
    height: 222,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -210,
    statusOffsetY: 43,
    shadow: { width: 94, height: 22, alpha: 0.28 },
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
    width: 152,
    height: 226,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -214,
    statusOffsetY: 44,
    shadow: { width: 96, height: 23, alpha: 0.28 },
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
    width: 156,
    height: 232,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -220,
    statusOffsetY: 45,
    shadow: { width: 98, height: 23, alpha: 0.28 },
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
    width: 158,
    height: 236,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -224,
    statusOffsetY: 46,
    shadow: { width: 100, height: 24, alpha: 0.29 },
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
    width: 168,
    height: 250,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -236,
    statusOffsetY: 48,
    shadow: { width: 106, height: 25, alpha: 0.29 },
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
    width: 152,
    height: 226,
    anchor: { x: 0.5, y: 0.87 },
    labelOffsetY: -214,
    statusOffsetY: 44,
    shadow: { width: 96, height: 23, alpha: 0.28 },
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
    width: 160,
    height: 264,
    anchor: { x: 0.5, y: 0.88 },
    labelOffsetY: -250,
    statusOffsetY: 47,
    shadow: { width: 100, height: 24, alpha: 0.3 },
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
