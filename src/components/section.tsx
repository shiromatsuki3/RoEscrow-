import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-5 py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title) && (
          <header className="mb-14 max-w-2xl">
            {eyebrow && (
              <p className="mb-4 font-display text-[0.7rem] tracking-[0.35em] text-muted-foreground uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl leading-[1.1] font-black tracking-tight sm:text-5xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}