import { PageShell } from "@/components/layout/PageShell";
import { SettingsPanel } from "@/components/panels/SettingsPanel";

export default function SettingsPage() {
  return (
    <PageShell eyebrow="Local" title="Settings">
      <SettingsPanel />
    </PageShell>
  );
}
