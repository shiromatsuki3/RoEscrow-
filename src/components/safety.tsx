import { AlertTriangle, ShieldAlert } from "lucide-react";
import { Section } from "@/components/section";
import { safetyPoints } from "@/content/site";

export function Safety() {
  return (
    <Section
      id="safety"
      eyebrow="Safety"
      title={<>Stay Protected.</>}
      intro="A few rules that keep every deal — and every trader — safe."
    >
      <div className="relative overflow-hidden rounded-3xl border border-warning/25 bg-[image:var(--gradient-glass)] p-8 backdrop-blur-xl sm:p-12">
        <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-warning/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <ShieldAlert className="size-6 text-warning" />
          <p className="font-display text-sm tracking-[0.25em] text-warning uppercase">
            Important
          </p>
        </div>
        <ul className="relative mt-8 grid gap-4 sm:grid-cols-2">
          {safetyPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-border bg-background/40 p-5 transition-colors hover:border-warning/35"
            >
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <span className="text-sm leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}