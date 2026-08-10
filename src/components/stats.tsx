import { stats } from "@/content/site";

export function Stats() {
  return (
    <section className="relative px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-panel hairline-top sheen-line relative rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="font-display text-4xl font-black tracking-tight text-chrome">{s.value}</p>
            <p className="mt-3 text-sm font-medium">{s.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}