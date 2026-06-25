import type { Building } from "@/lib/types/atlas";

export interface VillageSceneOptions {
  buildings: Building[];
  selectedBuildingId: string;
  onSelectBuilding: (buildingId: string) => void;
}

export interface VillageSceneApi {
  setSelectedBuilding: (buildingId: string) => void;
  relayout: () => void;
}
