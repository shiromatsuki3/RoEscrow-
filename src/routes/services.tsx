import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Services } from "@/components/services";

export const Route = createFileRoute("/services")({
  component: () => (
    <PageShell>
      <Services />
    </PageShell>
  ),
});
