import { BrandMark, Wordmark } from "@/components/brand";
import { disclaimer, links, nav } from "@/content/site";

const resources = [
  { label: "Discord", href: links.discord },
  { label: "Terms of Service", href: links.terms },
  { label: "Privacy Policy", href: links.privacy },
  { label: "Transaction Rules", href: links.rules },
];

export function Footer() {
  return (
    <footer className="hairline-top relative border-t border-border px-5 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <BrandMark size={32} />
            <Wordmark className="text-xl" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Protecting Every Roblox Transaction.</p>
        </div>

        <nav>
          <p className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Navigation
          </p>
          <ul className="mt-5 space-y-3">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <p className="font-display text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Resources
          </p>
          <ul className="mt-5 space-y-3">
            {resources.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-border pt-8">
        <p className="text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          © {new Date().getFullYear()} RoEscrow™. All rights reserved.
        </p>
      </div>
    </footer>
  );
}