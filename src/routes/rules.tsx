import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";

export const Route = createFileRoute("/rules")({
  component: () => (
    <PageShell>
      <Section
        eyebrow="Rules"
        title={<>Transaction rules.</>}
        intro="Only use official RoEscrow channels, verify assigned middlemen, and never send assets before a deal is confirmed."
      >
        <div className="glass-panel hairline-top rounded-2xl p-7 text-sm leading-relaxed text-muted-foreground">
          RoEscrow rules are confirmed with both parties before each transaction begins.
        </div>
      </Section>
    </PageShell>
  ),
});
