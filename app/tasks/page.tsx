import { PageShell } from "@/components/layout/PageShell";
import { TaskPanel } from "@/components/panels/TaskPanel";

export default function TasksPage() {
  return (
    <PageShell eyebrow="Operations" title="Tasks">
      <TaskPanel />
    </PageShell>
  );
}
