import type { HTMLAttributes } from "react";
import { ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { agents, buildings, events } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";
import { riskTone } from "@/lib/utils/format";

export function EventLog({ className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card className={cn("p-4", className)}>
      <CardHeader eyebrow="Feed" title="Village Event Log" action={<ScrollText className="text-cyan-200" size={17} />} />
      <CardBody className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2">
        {events.slice(0, 8).map((event) => {
          const building = buildings.find((item) => item.id === event.buildingId);
          const agent = agents.find((item) => item.id === event.agentId);

          return (
            <div className="rounded-lg border border-white/10 bg-black/20 p-3" key={event.id}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-zinc-500">{event.timestamp}</span>
                <Badge className={riskTone[event.riskLevel]}>{event.riskLevel}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-300">{event.message}</p>
              <div className="mt-2 truncate text-[11px] text-zinc-500">
                {agent?.name ?? "System"} · {building?.shortName ?? "Village"}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
