import { Coins, Gem, KeyRound, Boxes, Sparkles } from "lucide-react";
import { Section } from "@/components/section";
import { services } from "@/content/site";

const icons = [Coins, Gem, KeyRound, Boxes, Sparkles];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title={<>Coverage for the deals that matter.</>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = icons[i % icons.length]!;
          return (
            <article
              key={s.title}
              className="glass-panel hairline-top sheen-line group relative rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-xl border border-border bg-secondary/50 text-foreground transition-colors group-hover:border-foreground/30">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Note: supported transaction types and rules may vary.
      </p>
    </Section>
  );
}