import type { BuildingStatus } from "@/lib/types/atlas";

export const buildingStatusPalette: Record<
  BuildingStatus,
  { base: number; roof: number; glow: number; label: string }
> = {
  idle: { base: 0x52525b, roof: 0x71717a, glow: 0xa1a1aa, label: "Idle" },
  working: { base: 0x0f766e, roof: 0x34d399, glow: 0x6ee7b7, label: "Working" },
  waiting_approval: { base: 0x92400e, roof: 0xfbbf24, glow: 0xfcd34d, label: "Approval" },
  blocked: { base: 0x9a3412, roof: 0xfb923c, glow: 0xfdba74, label: "Blocked" },
  error: { base: 0x9f1239, roof: 0xfb7185, glow: 0xfda4af, label: "Error" },
  upgrading: { base: 0x075985, roof: 0x38bdf8, glow: 0x7dd3fc, label: "Upgrade" },
};

export const categoryAccent: Record<string, number> = {
  core: 0x22d3ee,
  revenue: 0x34d399,
  support: 0xa78bfa,
  future: 0xfbbf24,
};
