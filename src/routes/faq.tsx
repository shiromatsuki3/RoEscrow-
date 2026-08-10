import { createFileRoute } from "@tanstack/react-router";
import { Faq } from "@/components/faq";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/faq")({
  component: () => (
    <PageShell>
      <Faq />
    </PageShell>
  ),
});
