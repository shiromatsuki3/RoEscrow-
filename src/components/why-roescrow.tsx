import {
  ShieldCheck,
  BadgeCheck,
  MessagesSquare,
  Zap,
  Receipt,
  FileClock,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/section";
import { reasons } from "@/content/site";

const icons: LucideIcon[] = [ShieldCheck, BadgeCheck, MessagesSquare, Zap, Receipt, FileClock];

export function WhyRoEscrow() {
  return (
    <Section
      eyebrow="Why RoEscrow™"
      title={<>Built like a fintech. Tuned for Roblox.</>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => {
          const Icon = icons[i % icons.length]!;
          return (
            <div
              key={r.title}
              className="glass-panel hairline-top sheen-line relative rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <Icon className="size-6 text-foreground/80" />
              <h3 className="mt-5 font-display text-base font-bold tracking-tight">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}