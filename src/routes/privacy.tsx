import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <PageShell>
      <Section
        eyebrow="Privacy"
        title={<>Privacy policy.</>}
        intro="Transaction details are reviewed only by verified RoEscrow middlemen and used to process deal requests."
      >
        <div className="glass-panel hairline-top rounded-2xl p-7 text-sm leading-relaxed text-muted-foreground">
          Do not submit passwords or sensitive account credentials through public forms.
        </div>
      </Section>
    </PageShell>
  ),
});
