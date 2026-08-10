import { createFileRoute } from "@tanstack/react-router";
import {
  assertAdminPassword,
  createDealRequest,
  deleteDealRequest,
  listDealRequests,
  updateDealStatus,
  type DealStatus,
} from "@/server/admin-data.server";

const STATUSES = new Set(["pending", "in_progress", "review", "completed", "cancelled", "overdue"]);

function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object";
}

export const Route = createFileRoute("/api/deal-requests")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        return Response.json({ requests: await listDealRequests() });
      },
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as unknown;
        if (!isObject(body)) {
          return Response.json({ message: "Invalid request body." }, { status: 400 });
        }

        const requestRecord = await createDealRequest(body);
        return Response.json(requestRecord, { status: 201 });
      },
      PATCH: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        const body = (await request.json().catch(() => null)) as unknown;
        const id = isObject(body) && typeof body.id === "string" ? body.id : "";
        const status = isObject(body) && typeof body.status === "string" ? body.status : "";

        if (!id || !STATUSES.has(status)) {
          return Response.json({ message: "A valid id and status are required." }, { status: 400 });
        }

        const updated = await updateDealStatus(id, status as DealStatus);
        return updated
          ? Response.json(updated)
          : Response.json({ message: "Request not found." }, { status: 404 });
      },
      DELETE: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        const body = (await request.json().catch(() => null)) as unknown;
        const id = isObject(body) && typeof body.id === "string" ? body.id : "";

        if (!id) {
          return Response.json({ message: "Request id is required." }, { status: 400 });
        }

        await deleteDealRequest(id);
        return Response.json({ ok: true });
      },
    },
  },
});
