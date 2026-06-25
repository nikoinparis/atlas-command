import { PageShell } from "@/components/layout/PageShell";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

const sections = [
  {
    title: "Architecture",
    body: "Next.js App Router renders the route shell and React HUD, panels, chat, cards, and settings. Phaser owns the village canvas only. Local mock data stands in for Supabase, workers, queues, and LLM providers.",
  },
  {
    title: "Safety",
    body: "Posting, sending, spending, publishing, code changes, and investing are represented as Approval Court items. The app has no live external integrations, no model keys, and no autonomous side effects.",
  },
  {
    title: "Treasury",
    body: "Treasury tracks mock cost events, revenue events, ROI, AI budget caps, hosting spend, and paper-only Atlas Allocation placeholders. Numbers are calculated locally and are ready to be moved behind database queries later.",
  },
  {
    title: "Next Steps",
    body: "Connect the repo to GitHub and Vercel, keep this local UI passing build checks, then add Supabase schema, append-only ledger tables, task lifecycle tables, workers, and real LLM APIs only after cost controls exist.",
  },
];

export default function DocsPage() {
  return (
    <PageShell eyebrow="Internal" title="Project Documentation">
      <div className="grid gap-4 xl:grid-cols-2">
        {sections.map((section) => (
          <Card className="p-4" key={section.title}>
            <CardHeader eyebrow="Atlas Command" title={section.title} />
            <CardBody>
              <p className="text-sm leading-6 text-zinc-300">{section.body}</p>
            </CardBody>
          </Card>
        ))}
        <Card className="p-4 xl:col-span-2">
          <CardHeader eyebrow="Source of Truth" title="Master Plan PDF" />
          <CardBody>
            <p className="text-sm leading-6 text-zinc-300">
              The file at <span className="font-mono text-cyan-100">docs/Atlas Command Master Plan.pdf</span> is the canonical implementation reference. Future agents should consult it before changing architecture, safety rules, building names, Treasury behavior, or roadmap priorities.
            </p>
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}
