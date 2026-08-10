import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Eye, Search, Star, Trash2, TrendingUp, Users } from "lucide-react";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DealStatus = "pending" | "in_progress" | "review" | "completed" | "cancelled" | "overdue";

type DealRequest = {
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
};

type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  transactionId: string;
  featured: boolean;
  createdAt: string;
};

const title = "Admin - RoEscrow";
const description = "RoEscrow admin dashboard for transaction requests and reviews.";

const statuses: Array<{ value: "all" | DealStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "overdue", label: "Overdue" },
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [requests, setRequests] = useState<DealRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeStatus, setActiveStatus] = useState<"all" | DealStatus>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const adminFetch = useCallback(
    async (path: string, init: RequestInit = {}, nextPassword = savedPassword) => {
      const headers = new Headers(init.headers);
      headers.set("x-admin-password", nextPassword);
      if (init.body && !headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }

      const response = await fetch(path, { ...init, headers });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Admin request failed.");
      }
      return response;
    },
    [savedPassword],
  );

  const loadAdminData = useCallback(
    async (nextPassword = savedPassword, unlockOnSuccess = false) => {
      setIsLoading(true);
      setError("");

      try {
        const [requestsResponse, reviewsResponse] = await Promise.all([
          adminFetch("/api/deal-requests", {}, nextPassword),
          adminFetch("/api/reviews?admin=1", {}, nextPassword),
        ]);
        const requestsBody = (await requestsResponse.json()) as { requests: DealRequest[] };
        const reviewsBody = (await reviewsResponse.json()) as { reviews: Review[] };
        setRequests(requestsBody.requests);
        setReviews(reviewsBody.reviews);
        if (unlockOnSuccess) {
          setSavedPassword(nextPassword);
          setIsUnlocked(true);
        }
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin data.");
        if (unlockOnSuccess) {
          setIsUnlocked(false);
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [adminFetch, savedPassword],
  );

  async function onUnlock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loadAdminData(password, true);
  }

  async function updateStatus(id: string, status: DealStatus) {
    const response = await adminFetch("/api/deal-requests", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    const updated = (await response.json()) as DealRequest;
    setRequests((current) => current.map((item) => (item.id === id ? updated : item)));
  }

  async function deleteRequest(id: string) {
    await adminFetch("/api/deal-requests", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setRequests((current) => current.filter((item) => item.id !== id));
  }

  async function createReview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const response = await adminFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        transactionId: formData.get("transactionId"),
        rating: Number(formData.get("rating") ?? 5),
        body: formData.get("body"),
        featured: formData.get("featured") === "on",
      }),
    });
    const review = (await response.json()) as Review;
    setReviews((current) => [review, ...current]);
    form.reset();
  }

  async function toggleFeatured(review: Review) {
    const response = await adminFetch("/api/reviews", {
      method: "PATCH",
      body: JSON.stringify({ id: review.id, featured: !review.featured }),
    });
    const updated = (await response.json()) as Review;
    setReviews((current) => current.map((item) => (item.id === review.id ? updated : item)));
  }

  async function removeReview(id: string) {
    await adminFetch("/api/reviews", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setReviews((current) => current.filter((item) => item.id !== id));
  }

  const overview = useMemo(() => buildOverview(requests), [requests]);
  const filteredRequests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return requests
      .filter((request) => activeStatus === "all" || request.status === activeStatus)
      .filter((request) => {
        if (!normalizedQuery) return true;
        return [
          request.buyer,
          request.seller,
          request.type,
          request.value,
          request.method,
          request.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sort === "oldest" ? aTime - bTime : bTime - aTime;
      });
  }, [activeStatus, query, requests, sort]);

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[0.7rem] tracking-[0.35em] text-muted-foreground uppercase">
              Admin Panel
            </p>
            <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">
              Project overview.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Review incoming deal requests, track transaction pipeline status, and control featured
              website reviews.
            </p>
          </div>
          <form onSubmit={onUnlock} className="flex w-full gap-2 lg:w-auto">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="min-w-0 lg:w-64"
            />
            <Button type="submit" variant="chrome">
              Unlock
            </Button>
          </form>
        </header>

        {error && (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="relative mt-8">
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 grid place-items-center rounded-2xl border border-border bg-background/45 px-5 text-center backdrop-blur-sm">
              <div className="max-w-sm">
                <p className="font-display text-sm tracking-[0.25em] uppercase">Locked</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Enter the admin password above to view and manage the dashboard.
                </p>
              </div>
            </div>
          )}

          <div
            className={`transition duration-300 ${
              isUnlocked ? "" : "pointer-events-none select-none blur-md"
            }`}
            aria-hidden={!isUnlocked}
          >
            <section className="grid border border-border bg-card/40 sm:grid-cols-2 lg:grid-cols-4">
              {overview.primary.map((metric) => (
                <MetricCell key={metric.label} {...metric} />
              ))}
            </section>
            <section className="mt-8 grid border border-border bg-card/40 sm:grid-cols-2 lg:grid-cols-4">
              {overview.secondary.map((metric) => (
                <MetricCell key={metric.label} {...metric} />
              ))}
            </section>

            <section className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setActiveStatus(status.value)}
                    className={`border px-5 py-3 font-display text-xs tracking-[0.2em] uppercase transition-colors ${
                      activeStatus === status.value
                        ? "border-yellow-400 text-yellow-300"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="pl-10 lg:w-72"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 font-display text-xs tracking-[0.2em] uppercase"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </section>

            <section className="mt-10 border border-border bg-card/40 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-sm tracking-[0.25em] text-yellow-300 uppercase">
                  Monthly Analytics
                </h2>
                <div className="flex gap-2">
                  <Pill active>Projects</Pill>
                  <Pill>Clients</Pill>
                  <Pill>Revenue</Pill>
                </div>
              </div>
              <AnalyticsBars requests={requests} />
            </section>

            <section className="mt-10 grid gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm tracking-[0.25em] uppercase">Deal Requests</h2>
                <Button variant="glass" onClick={() => void loadAdminData()} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
              {filteredRequests.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  onStatusChange={updateStatus}
                  onDelete={deleteRequest}
                />
              ))}
              {filteredRequests.length === 0 && (
                <div className="border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                  No requests match this view.
                </div>
              )}
            </section>

            <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border border-border bg-card/40 p-6">
                <h2 className="font-display text-sm tracking-[0.25em] uppercase">Add Review</h2>
                <form onSubmit={createReview} className="mt-6 grid gap-4">
                  <Input name="name" required maxLength={80} placeholder="Customer name" />
                  <Input name="transactionId" maxLength={80} placeholder="Transaction ID" />
                  <Input name="rating" type="number" required min={1} max={5} defaultValue={5} />
                  <Textarea
                    name="body"
                    required
                    maxLength={500}
                    rows={5}
                    placeholder="Review text"
                  />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input name="featured" type="checkbox" className="size-4" />
                    Featured on website
                  </label>
                  <Button type="submit" variant="chrome">
                    Add Review
                  </Button>
                </form>
              </div>
              <div className="border border-border bg-card/40 p-6">
                <h2 className="font-display text-sm tracking-[0.25em] uppercase">Reviews</h2>
                <div className="mt-6 grid gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {review.rating}/5 {review.transactionId && `- ${review.transactionId}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="glass"
                            size="sm"
                            onClick={() => void toggleFeatured(review)}
                          >
                            <Star className="size-4" />
                            {review.featured ? "Unfeature" : "Feature"}
                          </Button>
                          <Button
                            variant="glass"
                            size="sm"
                            onClick={() => void removeReview(review.id)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">No reviews have been added yet.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "gold" | "red";
}) {
  const color =
    tone === "gold" ? "text-yellow-300" : tone === "red" ? "text-red-400" : "text-foreground";
  return (
    <div className="min-h-36 border-border p-7 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
      <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className={`mt-8 font-display text-4xl ${color}`}>{value}</p>
    </div>
  );
}

function Pill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={`border px-5 py-3 font-display text-xs tracking-[0.2em] uppercase ${
        active ? "border-yellow-400 text-yellow-300" : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function RequestRow({
  request,
  onStatusChange,
  onDelete,
}: {
  request: DealRequest;
  onStatusChange: (id: string, status: DealStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <article className="border border-border bg-card/40 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} />
            <p className="font-mono text-xs text-muted-foreground">{request.id}</p>
          </div>
          <h3 className="mt-4 font-display text-xl font-black">
            {request.type || "Transaction Request"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{request.description}</p>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
            <p>Buyer: {request.buyer || "-"}</p>
            <p>Seller: {request.seller || "-"}</p>
            <p>Value: {request.value || "-"}</p>
            <p>Method: {request.method || "-"}</p>
          </div>
          {request.notes && (
            <p className="mt-3 text-sm text-muted-foreground">Notes: {request.notes}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={request.status}
            onChange={(e) => void onStatusChange(request.id, e.target.value as DealStatus)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {statuses
              .filter((status) => status.value !== "all")
              .map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
          </select>
          <Button variant="glass" size="sm" onClick={() => void onDelete(request.id)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: DealStatus }) {
  const label = statuses.find((item) => item.value === status)?.label ?? status;
  return (
    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function AnalyticsBars({ requests }: { requests: DealRequest[] }) {
  const monthly = useMemo(() => buildMonthly(requests), [requests]);
  const max = Math.max(1, ...monthly.map((item) => item.count));

  return (
    <div className="mt-10 flex h-72 items-end justify-between gap-4 border-b border-border px-4">
      {monthly.map((item) => (
        <div
          key={item.label}
          className="flex h-full flex-1 flex-col items-center justify-end gap-3"
        >
          <span className="font-display text-xs text-yellow-300">{item.count}</span>
          <div
            className="w-full max-w-16 bg-yellow-400/70"
            style={{ height: `${Math.max(8, (item.count / max) * 220)}px` }}
          />
          <span className="pb-2 text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function buildOverview(requests: DealRequest[]) {
  const count = (status: DealStatus) =>
    requests.filter((request) => request.status === status).length;
  const completed = count("completed");
  const active = count("pending") + count("in_progress") + count("review");

  return {
    primary: [
      { label: "Total Projects", value: String(requests.length), icon: Eye },
      { label: "Pending", value: String(count("pending")), icon: Clock3 },
      {
        label: "In Progress",
        value: String(count("in_progress")),
        tone: "gold" as const,
        icon: TrendingUp,
      },
      { label: "Completed", value: String(completed), icon: CheckCircle2 },
    ],
    secondary: [
      { label: "Total Revenue", value: estimateRevenue(requests), tone: "gold" as const },
      { label: "Active Projects", value: String(active), icon: Users },
      { label: "Overdue", value: String(count("overdue")), tone: "red" as const },
      { label: "Avg. Completion", value: completed > 0 ? "—" : "—" },
    ],
  };
}

function estimateRevenue(requests: DealRequest[]) {
  const total = requests
    .filter((request) => request.status === "completed")
    .reduce(
      (sum, request) =>
        sum + parseAmount(request.value) * getFeePercent(parseAmount(request.value)),
      0,
    );

  return total > 0 ? `$${Math.round(total).toLocaleString("en-US")}` : "$0";
}

function parseAmount(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function getFeePercent(amount: number) {
  if (amount < 25) return 0.05;
  if (amount <= 100) return 0.04;
  if (amount <= 500) return 0.03;
  return 0.02;
}

function buildMonthly(requests: DealRequest[]) {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const now = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const count = requests.filter((request) => {
      const createdAt = new Date(request.createdAt);
      return createdAt.getMonth() === month && createdAt.getFullYear() === year;
    }).length;

    return {
      label: formatter.format(date),
      count,
    };
  });
}
