import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Safety } from "@/components/safety";

export const Route = createFileRoute("/safety")({
  component: () => (
    <PageShell>
      <Safety />
    </PageShell>
  ),
});
