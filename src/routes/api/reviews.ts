import { createFileRoute } from "@tanstack/react-router";
import {
  assertAdminPassword,
  createReview,
  deleteReview,
  listReviews,
  updateReviewFeatured,
} from "@/server/admin-data.server";

function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object";
}

export const Route = createFileRoute("/api/reviews")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const adminMode = url.searchParams.get("admin") === "1";
        if (adminMode) {
          const adminError = assertAdminPassword(request);
          if (adminError) return adminError;
        }

        return Response.json({ reviews: await listReviews(!adminMode) });
      },
      POST: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        const body = (await request.json().catch(() => null)) as unknown;
        if (!isObject(body)) {
          return Response.json({ message: "Invalid request body." }, { status: 400 });
        }

        const review = await createReview(body);
        return Response.json(review, { status: 201 });
      },
      PATCH: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        const body = (await request.json().catch(() => null)) as unknown;
        const id = isObject(body) && typeof body.id === "string" ? body.id : "";
        const featured =
          isObject(body) && typeof body.featured === "boolean" ? body.featured : null;

        if (!id || featured == null) {
          return Response.json(
            { message: "A valid id and featured value are required." },
            { status: 400 },
          );
        }

        const updated = await updateReviewFeatured(id, featured);
        return updated
          ? Response.json(updated)
          : Response.json({ message: "Review not found." }, { status: 404 });
      },
      DELETE: async ({ request }) => {
        const adminError = assertAdminPassword(request);
        if (adminError) return adminError;

        const body = (await request.json().catch(() => null)) as unknown;
        const id = isObject(body) && typeof body.id === "string" ? body.id : "";

        if (!id) {
          return Response.json({ message: "Review id is required." }, { status: 400 });
        }

        await deleteReview(id);
        return Response.json({ ok: true });
      },
    },
  },
});
