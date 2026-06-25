import type { Building } from "@/lib/types/atlas";
import { approvals, buildings, tasks, treasuryRecord } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils/format";

const globalSummary =
  "Atlas reads the village as: one content draft waiting, one product research run in motion, Treasury under budget, and all external actions correctly stopped at Approval Court.";

export function getMockAgentResponse(prompt: string, selectedBuilding?: Building | null) {
  const normalized = prompt.toLowerCase();
  const pendingApprovals = approvals.filter((approval) => approval.status === "pending");
  const blockedBuildings = buildings.filter(
    (building) => building.status === "blocked" || building.status === "waiting_approval",
  );

  if (normalized.includes("happening") || normalized.includes("village")) {
    return `${globalSummary} The highest-leverage next move is to review ${pendingApprovals.length} pending approvals before spinning up more draft work.`;
  }

  if (normalized.includes("build next") || normalized.includes("new building")) {
    return "Build Mission Control next: it is in the master plan as the non-game power-user operations board, and it will make tasks, errors, queue depth, and spend easier to triage once real workers arrive.";
  }

  if (normalized.includes("blocked")) {
    return blockedBuildings.length
      ? `The main blockers are ${blockedBuildings.map((building) => building.shortName).join(", ")}. They are not broken; they are waiting on human approval, which is the correct safety posture.`
      : "No building is blocked right now. I would still check the Approval Court before adding more tasks.";
  }

  if (normalized.includes("ai spend") || normalized.includes("cost")) {
    return `Current mock AI spend is ${formatCurrency(treasuryRecord.aiSpendMTD)} against a ${formatCurrency(treasuryRecord.monthlyAIBudget)} monthly cap. That is healthy, but the cost governor should stay central before real LLM keys are added.`;
  }

  if (normalized.includes("approval")) {
    return `There are ${pendingApprovals.length} pending approvals. They cover publishing, listing creation, freelance sending, an engineering UI change, and a paper investment recommendation. None should execute without your explicit action.`;
  }

  if (normalized.includes("revenue experiment")) {
    return "Best next revenue experiment: turn Vera's finance dashboard template into one polished product, then let Content Studio draft supporting educational posts. This matches the master plan's skill-fit logic and keeps platform risk manageable.";
  }

  if (normalized.includes("ui")) {
    return "Improve the UI by adding Mission Control, a cost-governor kill switch, and clearer approval aging. The village is already useful, but those pieces would make it feel more operational.";
  }

  if (normalized.includes("treasury")) {
    return `Treasury recommends staying on the cheapest path: keep fixed costs low, spend only ${formatCurrency(treasuryRecord.maxCostPerTask)} or less per mock task by default, and only raise budgets after repeatable revenue appears.`;
  }

  if (selectedBuilding) {
    const buildingTasks = tasks.filter((task) => task.buildingId === selectedBuilding.id);
    return `${selectedBuilding.shortName} is ${selectedBuilding.status.replace(/_/g, " ")}. It has ${buildingTasks.length} active mock task${buildingTasks.length === 1 ? "" : "s"}. Recommended action: ${selectedBuilding.recommendedAction}`;
  }

  return `${globalSummary} Ask me about blockers, AI spend, pending approvals, a new revenue experiment, or which building to build next.`;
}
