"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Agent, Approval, ApprovalStatus, Building } from "@/lib/types/atlas";
import { formatCurrency, humanizeStatus, riskTone } from "@/lib/utils/format";

interface ApprovalCardProps {
  approval: Approval;
  agent?: Agent;
  building?: Building;
  status?: ApprovalStatus;
  onStatusChange?: (approvalId: string, status: ApprovalStatus) => void;
}

export function ApprovalCard({
  approval,
  agent,
  building,
  status = approval.status,
  onStatusChange,
}: ApprovalCardProps) {
  const isPending = status === "pending";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{approval.title}</div>
          <div className="mt-1 text-xs text-zinc-500">
            {agent?.name ?? "Agent"} · {building?.shortName ?? "Building"} · {approval.sideEffectType}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={riskTone[approval.riskLevel]}>{approval.riskLevel}</Badge>
          <Badge className="bg-white/[0.06] text-zinc-200 ring-white/10">
            {humanizeStatus(status)}
          </Badge>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-400">{approval.summary}</p>
      <div className="mt-4 rounded-md border border-white/10 bg-black/25 p-3 text-xs leading-5 text-zinc-300">
        {approval.outputPreview}
      </div>
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <div className="text-zinc-500">Expected benefit</div>
          <div className="text-zinc-300">{approval.expectedBenefit}</div>
        </div>
        <div>
          <div className="text-zinc-500">Estimated cost</div>
          <div className="font-mono text-zinc-100">{formatCurrency(approval.estimatedCost)}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          disabled={!isPending}
          icon={<Check size={14} />}
          onClick={() => onStatusChange?.(approval.id, "approved")}
          size="sm"
          variant="primary"
        >
          Approve
        </Button>
        <Button
          disabled={!isPending}
          icon={<RotateCcw size={14} />}
          onClick={() => onStatusChange?.(approval.id, "revision_requested")}
          size="sm"
        >
          Revise
        </Button>
        <Button
          disabled={!isPending}
          icon={<X size={14} />}
          onClick={() => onStatusChange?.(approval.id, "rejected")}
          size="sm"
          variant="danger"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
