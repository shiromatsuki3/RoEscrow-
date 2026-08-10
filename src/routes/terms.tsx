import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";

export const Route = createFileRoute("/terms")({
  component: () => (
    <PageShell>
      <Section
        eyebrow="Terms"
        title={<>Terms of service.</>}
        intro="RoEscrow terms are provided through official channels and may be updated as service rules change."
      >
        <div className="glass-panel hairline-top rounded-2xl p-7 text-sm leading-relaxed text-muted-foreground">
          Contact RoEscrow staff for the current transaction terms before opening a deal.
        </div>
      </Section>
    </PageShell>
  ),
});
