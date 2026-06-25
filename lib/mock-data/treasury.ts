import type { CostEvent, Experiment, RevenueEvent, TreasuryRecord } from "@/lib/types/atlas";

export const treasuryRecord: TreasuryRecord = {
  cashOnHand: 1240,
  revenueMTD: 88,
  expensesMTD: 31.39,
  aiSpendMTD: 14.13,
  hostingSpendMTD: 12,
  approvalRiskExposure: 2.84,
  monthlyAIBudget: 50,
  dailyAIBudget: 4,
  maxCostPerTask: 0.75,
  maxRunsPerTask: 3,
  requireApprovalAbove: 0.5,
};

export const experiments: Experiment[] = [
  {
    id: "exp-content-funnel",
    buildingId: "content-studio",
    name: "AI productivity content funnel",
    hypothesis: "Original operator content can feed template and service demand.",
    status: "running",
    riskLevel: "medium",
  },
  {
    id: "exp-finance-template",
    buildingId: "product-workshop",
    name: "Finance dashboard template",
    hypothesis: "Students and builders will pay for a simple cash runway dashboard.",
    status: "running",
    riskLevel: "medium",
  },
  {
    id: "exp-dashboard-service",
    buildingId: "freelance-guild",
    name: "Dashboard automation service",
    hypothesis: "A scoped Python/dashboard offer can convert faster than digital products.",
    status: "planned",
    riskLevel: "high",
  },
  {
    id: "exp-atlas-paper",
    buildingId: "allocation-tower",
    name: "Atlas paper allocation",
    hypothesis: "Display-only allocation output can become a portfolio/resource planning surface.",
    status: "running",
    riskLevel: "critical",
  },
];

export const revenueEvents: RevenueEvent[] = [
  {
    id: "rev-001",
    experimentId: "exp-finance-template",
    buildingId: "product-workshop",
    label: "Manual template sale",
    gross: 96,
    fees: 8,
    net: 88,
    date: "2026-06-22",
  },
];

export const costEvents: CostEvent[] = [
  {
    id: "cost-001",
    experimentId: "exp-content-funnel",
    buildingId: "content-studio",
    label: "Hook draft generation",
    category: "ai",
    amount: 0.08,
    date: "2026-06-25",
  },
  {
    id: "cost-002",
    experimentId: "exp-finance-template",
    buildingId: "product-workshop",
    label: "Product research pass",
    category: "ai",
    amount: 0.16,
    date: "2026-06-25",
  },
  {
    id: "cost-003",
    experimentId: "exp-dashboard-service",
    buildingId: "freelance-guild",
    label: "Proposal drafting",
    category: "ai",
    amount: 0.11,
    date: "2026-06-25",
  },
  {
    id: "cost-004",
    experimentId: "exp-atlas-paper",
    buildingId: "allocation-tower",
    label: "Paper allocation narrative",
    category: "ai",
    amount: 0.22,
    date: "2026-06-25",
  },
  {
    id: "cost-005",
    experimentId: "exp-finance-template",
    buildingId: "product-workshop",
    label: "Mock marketplace listing fee",
    category: "platform",
    amount: 2.5,
    date: "2026-06-23",
  },
  {
    id: "cost-006",
    experimentId: "exp-content-funnel",
    buildingId: "content-studio",
    label: "Monthly AI drafting allocation",
    category: "ai",
    amount: 13.56,
    date: "2026-06-01",
  },
  {
    id: "cost-007",
    experimentId: "exp-atlas-paper",
    buildingId: "allocation-tower",
    label: "Local hosting placeholder",
    category: "hosting",
    amount: 12,
    date: "2026-06-01",
  },
  {
    id: "cost-008",
    experimentId: "exp-finance-template",
    buildingId: "product-workshop",
    label: "Template mockup assets",
    category: "asset",
    amount: 2.76,
    date: "2026-06-18",
  },
];

export const aiUsageLog = [
  { id: "ai-001", agent: "Nova", task: "Content hooks", model: "workhorse", cost: 0.08 },
  { id: "ai-002", agent: "Vera", task: "Product research", model: "workhorse", cost: 0.16 },
  { id: "ai-003", agent: "Forge", task: "Proposal draft", model: "workhorse", cost: 0.11 },
  { id: "ai-004", agent: "Atlas", task: "Daily briefing", model: "flagship", cost: 0.42 },
  { id: "ai-005", agent: "Allocator", task: "Paper allocation", model: "flagship", cost: 0.22 },
];
