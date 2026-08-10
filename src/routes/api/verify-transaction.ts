import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/verify-transaction")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;

        try {
          body = await request.json();
        } catch {
          return Response.json({ message: "Invalid JSON body" }, { status: 400 });
        }

        const referenceId =
          body != null &&
          typeof body === "object" &&
          "referenceId" in body &&
          typeof body.referenceId === "string"
            ? body.referenceId.trim()
            : "";

        if (!referenceId) {
          return Response.json({ message: "Reference ID is required" }, { status: 400 });
        }

        const { findTransactionByReferenceId } = await import("../../server/transactions.server");
        const transaction = await findTransactionByReferenceId(referenceId);

        if (!transaction) {
          return Response.json(
            { message: "Transaction not found or invalid reference ID" },
            { status: 404, headers: { "cache-control": "no-store" } },
          );
        }

        return Response.json(transaction, {
          headers: { "cache-control": "no-store" },
        });
      },
    },
  },
});
