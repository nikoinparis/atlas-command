export type AgentStatus =
  | "idle"
  | "thinking"
  | "working"
  | "waiting_approval"
  | "blocked"
  | "error"
  | "completed";

export type TaskStatus =
  | "idle"
  | "queued"
  | "running"
  | "waiting_approval"
  | "blocked"
  | "error"
  | "completed"
  | "rejected";

export type BuildingStatus =
  | "idle"
  | "working"
  | "waiting_approval"
  | "blocked"
  | "error"
  | "upgrading";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "revision_requested";

export type BuildingCategory = "core" | "revenue" | "support" | "future";

export interface VillagePosition {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  name: string;
  shortName: string;
  category: BuildingCategory;
  description: string;
  visual: string;
  managerAgentId: string;
  status: BuildingStatus;
  position: VillagePosition;
  level: number;
  revenueMTD: number;
  expensesMTD: number;
  roi: number;
  riskLevel: RiskLevel;
  tools: string[];
  metrics: string[];
  recommendedAction: string;
  pendingApprovalIds: string[];
  taskIds: string[];
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  buildingId: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  modelTier: "cheap" | "workhorse" | "flagship" | "none";
  toolPolicy: string;
  riskLevel: RiskLevel;
}

export interface Task {
  id: string;
  title: string;
  buildingId: string;
  agentId: string;
  status: TaskStatus;
  summary: string;
  costEstimate: number;
  expectedValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRun {
  id: string;
  taskId: string;
  status: TaskStatus;
  startedAt: string;
  endedAt?: string;
  cost: number;
  resultPreview: string;
}

export interface Approval {
  id: string;
  title: string;
  sourceAgentId: string;
  buildingId: string;
  status: ApprovalStatus;
  summary: string;
  riskLevel: RiskLevel;
  expectedBenefit: string;
  estimatedCost: number;
  outputPreview: string;
  sideEffectType: "publish" | "send" | "spend" | "code" | "invest";
}

export interface EventLogItem {
  id: string;
  timestamp: string;
  buildingId: string;
  agentId?: string;
  message: string;
  riskLevel: RiskLevel;
}

export interface TreasuryRecord {
  cashOnHand: number;
  revenueMTD: number;
  expensesMTD: number;
  aiSpendMTD: number;
  hostingSpendMTD: number;
  approvalRiskExposure: number;
  monthlyAIBudget: number;
  dailyAIBudget: number;
  maxCostPerTask: number;
  maxRunsPerTask: number;
  requireApprovalAbove: number;
}

export interface RevenueEvent {
  id: string;
  experimentId: string;
  buildingId: string;
  label: string;
  gross: number;
  fees: number;
  net: number;
  date: string;
}

export interface CostEvent {
  id: string;
  experimentId: string;
  buildingId: string;
  label: string;
  category: "ai" | "hosting" | "asset" | "platform" | "manual";
  amount: number;
  date: string;
}

export interface Experiment {
  id: string;
  buildingId: string;
  name: string;
  hypothesis: string;
  status: "planned" | "running" | "paused" | "completed";
  riskLevel: RiskLevel;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}
