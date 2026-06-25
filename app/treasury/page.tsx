import { PageShell } from "@/components/layout/PageShell";
import { TreasuryPanel } from "@/components/panels/TreasuryPanel";

export default function TreasuryPage() {
  return (
    <PageShell eyebrow="Finance" title="Treasury">
      <TreasuryPanel />
    </PageShell>
  );
}
