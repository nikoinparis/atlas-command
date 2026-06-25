export function calculateRoi(revenue: number, cost: number) {
  if (cost === 0) {
    return revenue > 0 ? 1 : 0;
  }

  return (revenue - cost) / cost;
}
