import { BuildingCard } from "@/components/cards/BuildingCard";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { buildings } from "@/lib/mock-data";

export default function BuildingsPage() {
  return (
    <PageShell eyebrow="Village" title="Buildings">
      <Card className="p-4">
        <CardHeader eyebrow="Catalog" title="Active First-Build Structures" />
        <CardBody className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {buildings.map((building) => (
            <BuildingCard building={building} key={building.id} />
          ))}
        </CardBody>
      </Card>
    </PageShell>
  );
}
