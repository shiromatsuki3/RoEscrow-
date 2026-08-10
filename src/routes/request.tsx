import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { TransactionForm } from "@/components/transaction-form";

export const Route = createFileRoute("/request")({
  component: () => (
    <PageShell>
      <TransactionForm />
    </PageShell>
  ),
});
