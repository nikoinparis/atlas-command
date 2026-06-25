"use client";

import { useMemo, useState } from "react";
import { ApprovalCard } from "@/components/cards/ApprovalCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { agents, approvals, buildings } from "@/lib/mock-data";
import type { ApprovalStatus } from "@/lib/types/atlas";

type ApprovalFilter = "all" | ApprovalStatus;

const filters: { value: ApprovalFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "revision_requested", label: "Revise" },
  { value: "rejected", label: "Rejected" },
];

export function ApprovalPanel() {
  const [filter, setFilter] = useState<ApprovalFilter>("pending");
  const [statuses, setStatuses] = useState<Record<string, ApprovalStatus>>(
    Object.fromEntries(approvals.map((approval) => [approval.id, approval.status])),
  );

  const filteredApprovals = useMemo(
    () =>
      approvals.filter((approval) => {
        const status = statuses[approval.id] ?? approval.status;
        return filter === "all" || status === filter;
      }),
    [filter, statuses],
  );

  return (
    <Card className="p-4">
      <CardHeader
        eyebrow="Court"
        title="Approval Queue"
        action={<Tabs items={filters} onValueChange={setFilter} value={filter} />}
      />
      <CardBody className="grid gap-3 lg:grid-cols-2">
        {filteredApprovals.length ? (
          filteredApprovals.map((approval) => (
            <ApprovalCard
              agent={agents.find((agent) => agent.id === approval.sourceAgentId)}
              approval={approval}
              building={buildings.find((building) => building.id === approval.buildingId)}
              key={approval.id}
              onStatusChange={(approvalId, status) =>
                setStatuses((current) => ({ ...current, [approvalId]: status }))
              }
              status={statuses[approval.id] ?? approval.status}
            />
          ))
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-sm text-zinc-400">
            No approvals match this filter.
          </div>
        )}
      </CardBody>
    </Card>
  );
}
