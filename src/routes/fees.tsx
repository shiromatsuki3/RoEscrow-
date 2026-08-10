import { createFileRoute } from "@tanstack/react-router";
import { Fees } from "@/components/fees";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/fees")({
  component: () => (
    <PageShell>
      <Fees />
    </PageShell>
  ),
});
