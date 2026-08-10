import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { links } from "@/content/site";

export function Cta() {
  return (
    <section className="relative px-5 py-24 sm:py-32">
      <div className="glass-panel hairline-top relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-7 py-16 text-center sm:px-16 sm:py-24">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-foreground/10 blur-[110px]" />
        <h2 className="relative font-display text-3xl leading-[1.05] font-black tracking-tighter sm:text-6xl">
          <span className="text-chrome">Ready to Make Your</span>
          <br />
          Next Deal Safer?
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Start your transaction with RoEscrow and let a trusted middleman handle the process.
        </p>
        <div className="relative mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="chrome" size="xl" className="sheen-line">
            <a href={links.startTransaction}>
              Start a Transaction <ArrowRight />
            </a>
          </Button>
          <Button asChild variant="glass" size="xl">
            <a href={links.discord}>Join Our Discord</a>
          </Button>
        </div>
      </div>
    </section>
  );
}