import {
  agents,
  approvals,
  buildings,
  costEvents,
  events,
  experiments,
  revenueEvents,
  taskRuns,
  tasks,
  treasuryRecord,
} from "@/lib/mock-data";
import type { AtlasDataSource } from "@/lib/data/types";

export const mockDataSource: AtlasDataSource = {
  mode: "mock",
  async getSnapshot() {
    return {
      buildings,
      agents,
      tasks,
      taskRuns,
      approvals,
      events,
      experiments,
      revenueEvents,
      costEvents,
      treasuryRecord,
    };
  },
  async getBuildings() {
    return buildings;
  },
  async getAgents() {
    return agents;
  },
  async getTasks() {
    return tasks;
  },
  async getApprovals() {
    return approvals;
  },
  async getTreasuryRecord() {
    return treasuryRecord;
  },
};
