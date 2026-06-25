import { AgentCard } from "@/components/cards/AgentCard";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { agents } from "@/lib/mock-data";

export default function AgentsPage() {
  return (
    <PageShell eyebrow="Crew" title="Agents">
      <Card className="p-4">
        <CardHeader eyebrow="Roster" title="Managers And Operators" />
        <CardBody className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard agent={agent} key={agent.id} />
          ))}
        </CardBody>
      </Card>
    </PageShell>
  );
}
