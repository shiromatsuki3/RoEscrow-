import { Check } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { feeTiers, links } from "@/content/site";

export function Fees() {
  return (
    <Section
      id="fees"
      eyebrow="Fees"
      title={<>Simple, transparent pricing.</>}
      intro="Fees are confirmed before each transaction begins."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {feeTiers.map((tier) => (
          <div
            key={tier.name}
            className="glass-panel hairline-top relative flex flex-col rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase">
              {tier.name}
            </p>
            <p className="mt-6 font-display text-5xl font-black tracking-tight text-chrome">
              {tier.amount}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{tier.unit}</p>
            <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
              {tier.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Button asChild variant="chrome" size="xl" className="sheen-line">
          <a href={links.fees}>View Fees</a>
        </Button>
      </div>
    </Section>
  );
}
