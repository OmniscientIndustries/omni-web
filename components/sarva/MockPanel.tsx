import type { ReactNode } from "react";

/** Frame for illustrative product interfaces. Always labelled as illustrative. */
export function MockPanel({
  title,
  label,
  children,
  className = "",
}: {
  title: string;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,#121110,#0a0a0a)] shadow-[0_40px_100px_-50px_rgb(0_0_0/0.9)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <p className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase">
          <span className="size-1.5 rounded-full bg-gold" />
          {title}
        </p>
        <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Illustrative</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.75rem] ${active ? "border-gold/60 bg-gold/10 text-gold-bright" : "border-line text-stone"}`}
    >
      {children}
    </span>
  );
}

export function Check({ on = true }: { on?: boolean }) {
  return (
    <span className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${on ? "border-gold bg-gold" : "border-stone-dim"}`}>
      {on ? (
        <svg viewBox="0 0 12 12" className="size-3 text-ink-950">
          <path d="M2.5 6.2l2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}
