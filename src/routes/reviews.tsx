import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Reviews } from "@/components/reviews";

export const Route = createFileRoute("/reviews")({
  component: () => (
    <PageShell>
      <Reviews />
    </PageShell>
  ),
});
