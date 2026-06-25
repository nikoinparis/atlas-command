import { PageShell } from "@/components/layout/PageShell";
import { ApprovalPanel } from "@/components/panels/ApprovalPanel";

export default function ApprovalsPage() {
  return (
    <PageShell eyebrow="Safety" title="Approval Court">
      <ApprovalPanel />
    </PageShell>
  );
}
