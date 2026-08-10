import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/components/section";
import { faqs } from "@/content/site";

export function Faq() {
  return (
    <Section id="faq" eyebrow="FAQ" title={<>Questions, answered.</>}>
      <Accordion type="single" collapsible className="glass-panel rounded-2xl px-6">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-border">
            <AccordionTrigger className="py-6 text-left font-display text-base font-bold tracking-tight hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}