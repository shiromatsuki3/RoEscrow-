import { useState, type FormEvent } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { links, paymentMethods, transactionTypes } from "@/content/site";

export function TransactionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/deal-requests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          buyer: formData.get("buyer"),
          seller: formData.get("seller"),
          type: formData.get("type"),
          value: formData.get("value"),
          method: formData.get("method"),
          notes: formData.get("notes"),
          description: formData.get("description"),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? "Failed to submit transaction request.");
      }

      form.reset();
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit transaction request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Section
      id="request"
      eyebrow="Transaction Request"
      title={<>Open a deal.</>}
      intro="Submit the details and a verified RoEscrow™ middleman will review your request."
    >
      <div className="glass-panel hairline-top relative rounded-3xl p-7 sm:p-10">
        <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Details are reviewed by verified middlemen only.
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-12 text-center">
            <CheckCircle2 className="size-12 text-foreground" />
            <h3 className="mt-6 font-display text-2xl font-black tracking-tight">
              Request received.
            </h3>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Your transaction request has been submitted. A verified RoEscrow™ middleman will
              review the details and follow up through official channels.
            </p>
            <Button
              variant="glass"
              size="xl"
              className="mt-8"
              onClick={() => {
                setSubmitted(false);
                setAgreed(false);
              }}
            >
              Submit another request
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
            <Field label="Buyer Discord username" id="buyer">
              <Input id="buyer" name="buyer" required maxLength={64} placeholder="buyer#0000" />
            </Field>
            <Field label="Seller Discord username" id="seller">
              <Input id="seller" name="seller" required maxLength={64} placeholder="seller#0000" />
            </Field>
            <Field label="Transaction type" id="type">
              <select
                id="type"
                name="type"
                required
                defaultValue=""
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  Select a type
                </option>
                {transactionTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Transaction value" id="value">
              <Input
                id="value"
                name="value"
                required
                maxLength={40}
                placeholder="e.g. 10,000 Robux"
              />
            </Field>
            <Field label="Preferred payment method" id="method">
              <select
                id="method"
                name="method"
                required
                defaultValue=""
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  Select a method
                </option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Additional notes" id="notes">
              <Input id="notes" name="notes" maxLength={200} placeholder="Optional" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description of deal" id="description">
                <Textarea
                  id="description"
                  name="description"
                  required
                  maxLength={1000}
                  rows={5}
                  placeholder="Describe exactly what each side is providing."
                />
              </Field>
            </div>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                required
              />
              <Label htmlFor="agree" className="text-sm leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <a href={links.rules} className="text-foreground underline underline-offset-4">
                  RoEscrow™ transaction rules
                </a>
                .
              </Label>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive sm:col-span-2">
                {error}
              </div>
            )}

            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="chrome"
                size="xl"
                disabled={!agreed || isSubmitting}
                className="sheen-line w-full sm:w-auto"
              >
                {isSubmitting ? "Submitting..." : "Submit Transaction Request"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}
