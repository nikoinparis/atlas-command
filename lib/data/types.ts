import type {
  Agent,
  Approval,
  Building,
  CostEvent,
  EventLogItem,
  Experiment,
  RevenueEvent,
  Task,
  TaskRun,
  TreasuryRecord,
} from "@/lib/types/atlas";

export type DataSourceMode = "mock" | "supabase";

export interface AtlasDataSnapshot {
  buildings: Building[];
  agents: Agent[];
  tasks: Task[];
  taskRuns: TaskRun[];
  approvals: Approval[];
  events: EventLogItem[];
  experiments: Experiment[];
  revenueEvents: RevenueEvent[];
  costEvents: CostEvent[];
  treasuryRecord: TreasuryRecord;
}

export interface AtlasDataSource {
  mode: DataSourceMode;
  getSnapshot: () => Promise<AtlasDataSnapshot>;
  getBuildings: () => Promise<Building[]>;
  getAgents: () => Promise<Agent[]>;
  getTasks: () => Promise<Task[]>;
  getApprovals: () => Promise<Approval[]>;
  getTreasuryRecord: () => Promise<TreasuryRecord>;
}
