import type { Building } from "@/lib/types/atlas";

export interface VillageSceneOptions {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (buildingId: string) => void;
}

export interface VillageSceneApi {
  setSelectedBuilding: (buildingId: string | null) => void;
  relayout: () => void;
}
