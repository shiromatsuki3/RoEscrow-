type JsonObject = Record<string, unknown>;

const REQUESTS_TABLE = "roescrow_deal_requests";
const REVIEWS_TABLE = "roescrow_reviews";

export type DealStatus =
  "pending" | "in_progress" | "review" | "completed" | "cancelled" | "overdue";

export interface DealRequest {
  id: string;
  buyer: string;
  seller: string;
  type: string;
  value: string;
  method: string;
  notes: string;
  description: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  transactionId: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/+$/, ""),
    key,
  };
}

function getSupabaseHeaders(key: string, json = false) {
  const headers: Record<string, string> = {
    apikey: key,
  };

  if (!key.startsWith("sb_")) {
    headers.Authorization = `Bearer ${key}`;
  }

  if (json) {
    headers["content-type"] = "application/json";
  }

  return headers;
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Missing SUPABASE_URL and SUPABASE_SECRET_KEY environment variables.");
  }

  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(getSupabaseHeaders(config.key))) {
    headers.set(key, value);
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }

  return response;
}

function normalizeStatus(value: unknown): DealStatus {
  const status = typeof value === "string" ? value : "pending";
  if (
    status === "pending" ||
    status === "in_progress" ||
    status === "review" ||
    status === "completed" ||
    status === "cancelled" ||
    status === "overdue"
  ) {
    return status;
  }

  return "pending";
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function rowToDeal(row: {
  id: string;
  status?: unknown;
  data?: unknown;
  created_at?: string;
  updated_at?: string;
}) {
  const data = row.data != null && typeof row.data === "object" ? (row.data as JsonObject) : {};

  return {
    id: row.id,
    buyer: asString(data.buyer),
    seller: asString(data.seller),
    type: asString(data.type),
    value: asString(data.value),
    method: asString(data.method),
    notes: asString(data.notes),
    description: asString(data.description),
    status: normalizeStatus(row.status ?? data.status),
    createdAt: row.created_at ?? asString(data.createdAt),
    updatedAt: row.updated_at ?? asString(data.updatedAt),
  } satisfies DealRequest;
}

function rowToReview(row: {
  id: string;
  featured?: boolean;
  data?: unknown;
  created_at?: string;
  updated_at?: string;
}) {
  const data = row.data != null && typeof row.data === "object" ? (row.data as JsonObject) : {};

  return {
    id: row.id,
    name: asString(data.name),
    rating: asNumber(data.rating, 5),
    body: asString(data.body),
    transactionId: asString(data.transactionId),
    featured: row.featured === true || data.featured === true,
    createdAt: row.created_at ?? asString(data.createdAt),
    updatedAt: row.updated_at ?? asString(data.updatedAt),
  } satisfies Review;
}

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) {
    return process.env.ADMIN_PASSWORD;
  }

  if (process.env.NODE_ENV !== "production") {
    return "admin";
  }

  return "";
}

export function assertAdminPassword(request: Request) {
  const expectedPassword = getAdminPassword();
  const password = request.headers.get("x-admin-password") ?? "";

  if (!expectedPassword) {
    return Response.json({ message: "ADMIN_PASSWORD is not configured." }, { status: 500 });
  }

  if (password !== expectedPassword) {
    return Response.json({ message: "Invalid admin password." }, { status: 401 });
  }

  return null;
}

export async function createDealRequest(input: JsonObject) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const data = {
    buyer: asString(input.buyer),
    seller: asString(input.seller),
    type: asString(input.type),
    value: asString(input.value),
    method: asString(input.method),
    notes: asString(input.notes),
    description: asString(input.description),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  const response = await supabaseFetch(REQUESTS_TABLE, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(getSupabaseConfig()?.key ?? "", true),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id,
      status: "pending",
      data,
      created_at: now,
      updated_at: now,
    }),
  });

  const rows = (await response.json()) as Array<Parameters<typeof rowToDeal>[0]>;
  return rowToDeal(rows[0]);
}

export async function listDealRequests() {
  const response = await supabaseFetch(`${REQUESTS_TABLE}?select=*&order=created_at.desc`);
  const rows = (await response.json()) as Array<Parameters<typeof rowToDeal>[0]>;
  return rows.map(rowToDeal);
}

export async function updateDealStatus(id: string, status: DealStatus) {
  const now = new Date().toISOString();
  const response = await supabaseFetch(`${REQUESTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...getSupabaseHeaders(getSupabaseConfig()?.key ?? "", true),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      status,
      updated_at: now,
    }),
  });

  const rows = (await response.json()) as Array<Parameters<typeof rowToDeal>[0]>;
  return rows[0] ? rowToDeal(rows[0]) : null;
}

export async function deleteDealRequest(id: string) {
  await supabaseFetch(`${REQUESTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function listReviews(featuredOnly = false) {
  const path = featuredOnly
    ? `${REVIEWS_TABLE}?featured=eq.true&select=*&order=created_at.desc`
    : `${REVIEWS_TABLE}?select=*&order=created_at.desc`;
  const response = await supabaseFetch(path);
  const rows = (await response.json()) as Array<Parameters<typeof rowToReview>[0]>;
  return rows.map(rowToReview);
}

export async function createReview(input: JsonObject) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const featured = input.featured === true;
  const data = {
    name: asString(input.name),
    rating: Math.min(5, Math.max(1, Math.round(asNumber(input.rating, 5)))),
    body: asString(input.body),
    transactionId: asString(input.transactionId),
    featured,
    createdAt: now,
    updatedAt: now,
  };

  const response = await supabaseFetch(REVIEWS_TABLE, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(getSupabaseConfig()?.key ?? "", true),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      id,
      featured,
      data,
      created_at: now,
      updated_at: now,
    }),
  });

  const rows = (await response.json()) as Array<Parameters<typeof rowToReview>[0]>;
  return rowToReview(rows[0]);
}

export async function updateReviewFeatured(id: string, featured: boolean) {
  const response = await supabaseFetch(`${REVIEWS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...getSupabaseHeaders(getSupabaseConfig()?.key ?? "", true),
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      featured,
      updated_at: new Date().toISOString(),
    }),
  });

  const rows = (await response.json()) as Array<Parameters<typeof rowToReview>[0]>;
  return rows[0] ? rowToReview(rows[0]) : null;
}

export async function deleteReview(id: string) {
  await supabaseFetch(`${REVIEWS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
