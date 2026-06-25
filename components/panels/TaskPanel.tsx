"use client";

import { useMemo, useState } from "react";
import { TaskCard } from "@/components/cards/TaskCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { agents, buildings, tasks } from "@/lib/mock-data";
import type { TaskStatus } from "@/lib/types/atlas";

type TaskFilter = "all" | TaskStatus;

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "waiting_approval", label: "Approval" },
  { value: "queued", label: "Queued" },
  { value: "completed", label: "Done" },
];

export function TaskPanel() {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const filteredTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((task) => task.status === filter)),
    [filter],
  );

  return (
    <Card className="p-4">
      <CardHeader
        eyebrow="Board"
        title="Task Lifecycle"
        action={<Tabs items={filters} onValueChange={setFilter} value={filter} />}
      />
      <CardBody className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard
            agent={agents.find((agent) => agent.id === task.agentId)}
            building={buildings.find((building) => building.id === task.buildingId)}
            key={task.id}
            task={task}
          />
        ))}
      </CardBody>
    </Card>
  );
}
