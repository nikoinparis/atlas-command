"use client";

import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Building } from "@/lib/types/atlas";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, humanizeStatus, riskTone, statusTone } from "@/lib/utils/format";

interface BuildingCardProps {
  building: Building;
  selected?: boolean;
  onSelect?: (buildingId: string) => void;
}

export function BuildingCard({ building, selected, onSelect }: BuildingCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{building.name}</div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">{building.description}</p>
        </div>
        {onSelect ? (
          <ChevronRight className="mt-0.5 shrink-0 text-zinc-500 transition group-hover:text-cyan-200" size={16} />
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className={statusTone[building.status]}>{humanizeStatus(building.status)}</Badge>
        <Badge className={riskTone[building.riskLevel]}>{building.riskLevel} risk</Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <div className="text-zinc-500">Revenue</div>
          <div className="font-mono text-zinc-100">{formatCurrency(building.revenueMTD)}</div>
        </div>
        <div>
          <div className="text-zinc-500">Expense</div>
          <div className="font-mono text-zinc-100">{formatCurrency(building.expensesMTD)}</div>
        </div>
        <div>
          <div className="text-zinc-500">Level</div>
          <div className="font-mono text-zinc-100">{building.level}</div>
        </div>
      </div>
    </>
  );

  const className = cn(
    "group w-full rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-300/30 hover:bg-white/[0.07]",
    selected && "border-cyan-300/50 bg-cyan-300/[0.08]",
  );

  if (!onSelect) {
    return <article className={className}>{content}</article>;
  }

  return (
    <button
      className={cn(
        className,
        "focus:outline-none focus:ring-2 focus:ring-cyan-300/40",
      )}
      onClick={() => onSelect?.(building.id)}
      type="button"
    >
      {content}
    </button>
  );
}
