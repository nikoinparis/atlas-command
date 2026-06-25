import { Progress } from "@/components/ui/Progress";
import type { TreasuryRecord } from "@/lib/types/atlas";
import { formatCurrency } from "@/lib/utils/format";

interface BudgetBarProps {
  record: TreasuryRecord;
}

export function BudgetBar({ record }: BudgetBarProps) {
  const usage = record.monthlyAIBudget === 0 ? 0 : (record.aiSpendMTD / record.monthlyAIBudget) * 100;
  const tone =
    usage >= 90 ? "bg-rose-300" : usage >= 70 ? "bg-amber-300" : "bg-emerald-300";

  return (
    <div className="min-w-[160px]">
      <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
        <span className="text-zinc-500">AI budget</span>
        <span className="font-mono text-zinc-200">
          {formatCurrency(record.aiSpendMTD)} / {formatCurrency(record.monthlyAIBudget)}
        </span>
      </div>
      <Progress indicatorClassName={tone} value={usage} />
    </div>
  );
}
