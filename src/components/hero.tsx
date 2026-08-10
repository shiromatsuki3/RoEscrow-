import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { links } from "@/content/site";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-5 pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-foreground/6 blur-[130px]" />
      <div className="animate-float-slow pointer-events-none absolute top-2/3 -left-16 hidden size-40 rotate-12 rounded-3xl border border-border bg-[image:var(--gradient-glass)] opacity-70 lg:block" />
      <div
        className="animate-float-slow pointer-events-none absolute right-6 bottom-10 size-24 -rotate-6 rounded-2xl border border-border bg-[image:var(--gradient-glass)]"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise-in min-w-0">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.7rem] tracking-[0.25em] text-muted-foreground uppercase">
            Protecting Every Roblox Transaction.
          </span>
          <h1 className="mt-7 font-display text-[2.6rem] leading-[0.95] font-black tracking-tighter sm:text-7xl">
            <span className="text-chrome">Trade With</span>
            <br />
            Confidence.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            RoEscrow provides secure middleman services for Roblox transactions, helping buyers and
            sellers complete deals with confidence.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="chrome" size="xl" className="sheen-line">
              <a href={links.startTransaction}>
                Start a Transaction <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="glass" size="xl">
              <a href="/how-it-works">How It Works</a>
            </Button>
          </div>
        </div>

        <div className="animate-rise-in relative" style={{ animationDelay: "150ms" }}>
          <div className="glass-panel overflow-hidden rounded-3xl p-2">
            <img
              src="/escrow banner.png"
              alt="RoEscrow chrome and glass brand emblem"
              width={1672}
              height={941}
              className="w-full rounded-2xl object-cover"
            />
          </div>
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-foreground/8 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
