import { Section } from "@/components/section";
import { steps } from "@/content/site";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How It Works"
      title={<>A process built to remove the risk.</>}
      intro="Four clear stages, with verification before anything changes hands."
    >
      <div className="relative">
        <div className="pointer-events-none absolute top-12 right-0 left-0 hidden h-px bg-linear-to-r from-transparent via-foreground/25 to-transparent lg:block" />
        <ol className="grid gap-4 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="glass-panel hairline-top sheen-line relative rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-chrome)] font-display text-sm font-black text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}