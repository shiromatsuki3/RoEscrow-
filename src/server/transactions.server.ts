import { readFile } from "node:fs/promises";
import path from "node:path";

export interface TransactionDetails {
  id: string;
  amount: string;
  item: string;
  fee: string;
  paymentMethod: string;
  status?: string;
  rating?: string;
  ratingStars?: string;
  createdAt?: string;
  verificationUrl?: string;
}

type StoredTransaction = Record<string, unknown>;
const SUPABASE_TABLE = "roescrow_transactions";

function getTransactionStorePath() {
  return (
    process.env.ROESCROW_TRANSACTION_STORE ??
    path.resolve(process.cwd(), "roescrow-bot", "src", "data", "transactions.json")
  );
}

function normalizeReferenceId(referenceId: string) {
  return referenceId.trim().toUpperCase();
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
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

function getSupabaseHeaders(key: string) {
  const headers: Record<string, string> = {
    apikey: key,
  };

  if (!key.startsWith("sb_")) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}

async function findTransactionInSupabase(referenceId: string): Promise<StoredTransaction | null> {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const normalizedReferenceId = normalizeReferenceId(referenceId);
  const url = new URL(`${config.url}/rest/v1/${SUPABASE_TABLE}`);
  url.searchParams.set("id", `eq.${normalizedReferenceId}`);
  url.searchParams.set("select", "data");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: getSupabaseHeaders(config.key),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[Transactions] Supabase lookup failed (${response.status}): ${body}`);
    return null;
  }

  const rows = (await response.json()) as unknown;
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const firstRow = rows[0] as { data?: unknown };
  return firstRow.data != null && typeof firstRow.data === "object"
    ? (firstRow.data as StoredTransaction)
    : null;
}

async function readTransactions(): Promise<StoredTransaction[]> {
  try {
    const raw = (await readFile(getTransactionStorePath(), "utf-8")).replace(/^\uFEFF/, "");
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is StoredTransaction => item != null && typeof item === "object",
      );
    }

    if (
      parsed != null &&
      typeof parsed === "object" &&
      Array.isArray((parsed as { transactions?: unknown }).transactions)
    ) {
      return (parsed as { transactions: unknown[] }).transactions.filter(
        (item): item is StoredTransaction => item != null && typeof item === "object",
      );
    }

    return [];
  } catch (error) {
    if (error != null && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    console.error("[Transactions] Failed to read transaction store:", error);
    return [];
  }
}

function toTransactionDetails(transaction: StoredTransaction): TransactionDetails {
  const id = asString(transaction.id, asString(transaction.referenceId));

  return {
    id,
    amount: asString(transaction.amount, "Unknown"),
    item: asString(transaction.item, "Unknown"),
    fee: asString(transaction.fee, "Unknown"),
    paymentMethod: asString(transaction.paymentMethod, "Unknown"),
    status: asString(transaction.status) || undefined,
    rating: asString(transaction.rating) || undefined,
    ratingStars: asString(transaction.ratingStars) || undefined,
    createdAt: asString(transaction.createdAt) || undefined,
    verificationUrl: asString(transaction.verificationUrl) || undefined,
  };
}

export async function findTransactionByReferenceId(referenceId: string) {
  const normalizedReferenceId = normalizeReferenceId(referenceId);
  const supabaseTransaction = await findTransactionInSupabase(normalizedReferenceId);
  if (supabaseTransaction) {
    return toTransactionDetails(supabaseTransaction);
  }

  const transactions = await readTransactions();
  const transaction = transactions.find((item) => {
    const itemId = normalizeReferenceId(asString(item.id, asString(item.referenceId)));
    return itemId === normalizedReferenceId;
  });

  return transaction ? toTransactionDetails(transaction) : null;
}
