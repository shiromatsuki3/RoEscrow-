import { createFileRoute } from "@tanstack/react-router";
import { HowItWorks } from "@/components/how-it-works";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/how-it-works")({
  component: () => (
    <PageShell>
      <HowItWorks />
    </PageShell>
  ),
});
