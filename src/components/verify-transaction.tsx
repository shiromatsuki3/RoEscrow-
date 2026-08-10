import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface TransactionDetails {
  id: string;
  amount: string;
  item: string;
  fee: string;
  paymentMethod: string;
  status?: string;
  rating?: string;
  ratingStars?: string;
  createdAt?: string;
}

interface VerifyTransactionProps {
  initialReferenceId?: string;
  autoVerify?: boolean;
}

export function VerifyTransaction({
  initialReferenceId = "",
  autoVerify = false,
}: VerifyTransactionProps) {
  const [referenceId, setReferenceId] = useState(initialReferenceId);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoVerifiedRef = useRef("");

  const verifyReference = useCallback(async (nextReferenceId: string) => {
    const trimmedReferenceId = nextReferenceId.trim();

    if (!trimmedReferenceId) {
      setError("Please enter a reference ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTransactionDetails(null);

    try {
      const response = await fetch(`/api/verify-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referenceId: trimmedReferenceId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.message === "string"
            ? data.message
            : "Transaction not found or invalid reference ID",
        );
      }

      setTransactionDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify transaction");
      setTransactionDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmedInitialReferenceId = initialReferenceId.trim();
    if (!trimmedInitialReferenceId) {
      return;
    }

    setReferenceId(trimmedInitialReferenceId);

    if (autoVerify && autoVerifiedRef.current !== trimmedInitialReferenceId) {
      autoVerifiedRef.current = trimmedInitialReferenceId;
      void verifyReference(trimmedInitialReferenceId);
    }
  }, [autoVerify, initialReferenceId, verifyReference]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyReference(referenceId);
  };

  return (
    <section id="verify" className="relative overflow-hidden px-5 py-24 sm:py-32">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-foreground/5 blur-[130px]" />

      <div className="relative mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 h-16 w-16 rounded-full bg-foreground/10">
            <Search className="h-8 w-8 text-foreground" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="text-chrome">Verify</span> Transaction
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Enter your transaction reference ID to confirm the order details and status.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="mb-8">
          <div className="glass-panel rounded-2xl p-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Paste your reference ID (e.g. ROESCROW-NM-123456)..."
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground/60"
              />
              <Button
                type="submit"
                variant="chrome"
                size="lg"
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? "Verifying..." : <Search className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/30 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Transaction Details */}
        {transactionDetails && (
          <Card className="border border-border bg-card/50 backdrop-blur p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                Reference ID
              </h3>
              <p className="font-mono text-lg font-semibold text-foreground">
                {transactionDetails.id}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Amount */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Amount
                </h4>
                <p className="text-2xl font-bold text-chrome">{transactionDetails.amount}</p>
              </div>

              {/* Item */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Item/Asset
                </h4>
                <p className="text-lg font-semibold text-foreground">{transactionDetails.item}</p>
              </div>

              {/* Fee */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Fee</h4>
                <p className="text-lg font-semibold text-foreground">{transactionDetails.fee}</p>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Payment Method
                </h4>
                <p className="text-lg font-semibold text-foreground">
                  {transactionDetails.paymentMethod}
                </p>
              </div>
            </div>

            {/* Status */}
            {transactionDetails.status && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  Status
                </h4>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/30">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  {transactionDetails.status}
                </div>
              </div>
            )}

            {(transactionDetails.ratingStars || transactionDetails.createdAt) && (
              <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
                {transactionDetails.ratingStars && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Rating
                    </h4>
                    <p className="text-lg font-semibold text-foreground">
                      {transactionDetails.ratingStars} {transactionDetails.rating}
                    </p>
                  </div>
                )}

                {transactionDetails.createdAt && (
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                      Completed
                    </h4>
                    <p className="text-lg font-semibold text-foreground">
                      {new Date(transactionDetails.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Empty State */}
        {!transactionDetails && !error && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Enter a reference ID above to view transaction details
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
