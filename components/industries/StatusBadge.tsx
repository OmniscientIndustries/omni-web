import { expansionStatus } from "@/content/industries";

/** "In development" marker for expansion industries. */
export function StatusBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-gold/35 bg-ink-950/80 px-3 py-1 font-mono text-[0.625rem] tracking-[0.16em] text-gold-bright uppercase backdrop-blur-sm ${className}`}
    >
      <span aria-hidden className="relative flex size-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-gold/70 [animation-duration:2.4s] motion-reduce:hidden" />
        <span className="relative size-1.5 rounded-full bg-gold" />
      </span>
      {expansionStatus.label}
    </span>
  );
}
