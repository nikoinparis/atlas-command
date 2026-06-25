import type { Approval } from "@/lib/types/atlas";

export const approvals: Approval[] = [
  {
    id: "approval-content-publish",
    title: "Publish content draft",
    sourceAgentId: "nova",
    buildingId: "content-studio",
    status: "pending",
    summary: "Nova drafted a short-form content post about AI productivity operating loops.",
    riskLevel: "medium",
    expectedBenefit: "Tests a content lane that can feed digital product demand.",
    estimatedCost: 0,
    outputPreview:
      "Hook: Your AI stack is not the business. The operating loop is. Here is the 3-part system I use to keep agents useful, cheap, and approval-gated.",
    sideEffectType: "publish",
  },
  {
    id: "approval-product-listing",
    title: "Create product listing draft",
    sourceAgentId: "vera",
    buildingId: "product-workshop",
    status: "pending",
    summary: "Vera prepared a listing draft for a finance dashboard template.",
    riskLevel: "medium",
    expectedBenefit: "Could become the first repeatable digital product experiment.",
    estimatedCost: 2.5,
    outputPreview:
      "Listing draft: Personal cash runway dashboard for students and early-career builders. Includes Sheets template, setup guide, and sample scenarios.",
    sideEffectType: "publish",
  },
  {
    id: "approval-freelance-send",
    title: "Send freelance proposal draft",
    sourceAgentId: "forge",
    buildingId: "freelance-guild",
    status: "pending",
    summary: "Forge drafted a proposal for a Python + dashboard automation project.",
    riskLevel: "high",
    expectedBenefit: "Fastest path to a manually approved revenue opportunity.",
    estimatedCost: 0,
    outputPreview:
      "Proposal: I can build a lightweight dashboard that pulls your CSV exports, cleans them, and gives you a weekly KPI view. I will scope the first version tightly and deliver a walkthrough.",
    sideEffectType: "send",
  },
  {
    id: "approval-engineering-ui",
    title: "Approve Engineering Workshop UI change",
    sourceAgentId: "architect",
    buildingId: "engineering-workshop",
    status: "pending",
    summary: "Architect proposed a Mission Control mini-map rail and build-health widget.",
    riskLevel: "medium",
    expectedBenefit: "Improves status scanning before real agents and queues are connected.",
    estimatedCost: 0.34,
    outputPreview:
      "Change proposal: add a compact status rail with queue depth, latest build result, and next upgrade recommendation. Future implementation should go through a PR.",
    sideEffectType: "code",
  },
  {
    id: "approval-investment-manual",
    title: "Approve future investment recommendation manually",
    sourceAgentId: "allocator",
    buildingId: "allocation-tower",
    status: "pending",
    summary: "Allocator generated a mock paper-mode allocation review.",
    riskLevel: "critical",
    expectedBenefit: "Shows the future Atlas decision-support workflow without placing trades.",
    estimatedCost: 0,
    outputPreview:
      "Paper-only suggestion: keep 55% VTI, 25% VXUS, 15% BND, 5% SGOV for the sample account. This is not investment advice and no order will be placed.",
    sideEffectType: "invest",
  },
];
