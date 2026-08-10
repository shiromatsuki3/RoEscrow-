export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black tracking-tight ${className}`}>
      <span className="text-chrome">RoEscrow</span>
      <sup className="ml-0.5 text-[0.5em] text-muted-foreground">™</sup>
    </span>
  );
}

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/favicon.png"
      alt="RoEscrow chrome E emblem"
      width={size}
      height={size}
      className="shrink-0 drop-shadow-[0_0_18px_oklch(1_0_0/0.25)]"
      style={{ width: size, height: size }}
    />
  );
}