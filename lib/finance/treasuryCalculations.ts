import type { CostEvent, Experiment, RevenueEvent, TreasuryRecord } from "@/lib/types/atlas";

export function getProfit(record: TreasuryRecord) {
  return record.revenueMTD - record.expensesMTD;
}

export function getBudgetUsage(record: TreasuryRecord) {
  return record.monthlyAIBudget === 0 ? 0 : record.aiSpendMTD / record.monthlyAIBudget;
}

export function getCostByBuilding(costs: CostEvent[]) {
  return costs.reduce<Record<string, number>>((acc, event) => {
    acc[event.buildingId] = (acc[event.buildingId] ?? 0) + event.amount;
    return acc;
  }, {});
}

export function getRevenueByExperiment(revenue: RevenueEvent[]) {
  return revenue.reduce<Record<string, number>>((acc, event) => {
    acc[event.experimentId] = (acc[event.experimentId] ?? 0) + event.net;
    return acc;
  }, {});
}

export function getCostByExperiment(costs: CostEvent[]) {
  return costs.reduce<Record<string, number>>((acc, event) => {
    acc[event.experimentId] = (acc[event.experimentId] ?? 0) + event.amount;
    return acc;
  }, {});
}

export function getRoiByExperiment(
  experiments: Experiment[],
  revenue: RevenueEvent[],
  costs: CostEvent[],
) {
  const revenueByExperiment = getRevenueByExperiment(revenue);
  const costByExperiment = getCostByExperiment(costs);

  return experiments.map((experiment) => {
    const totalRevenue = revenueByExperiment[experiment.id] ?? 0;
    const totalCost = costByExperiment[experiment.id] ?? 0;
    const roi = totalCost === 0 ? 0 : (totalRevenue - totalCost) / totalCost;

    return {
      ...experiment,
      totalRevenue,
      totalCost,
      roi,
    };
  });
}
