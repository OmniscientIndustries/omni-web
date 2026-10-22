import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";

const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[10px] px-6 text-[0.95rem] font-medium tracking-[-0.005em] transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-brand)] hover:-translate-y-px active:translate-y-px active:duration-75";

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(180deg,#d7c4a4_0%,#b79768_45%,#8a693e_100%)] text-ink-950 shadow-[inset_0_1px_0_rgb(239_228_210/0.55),0_10px_30px_-12px_rgb(183_151_104/0.55)] hover:shadow-[inset_0_1px_0_rgb(239_228_210/0.7),0_14px_36px_-12px_rgb(183_151_104/0.7)]",
  secondary:
    "border border-line-strong bg-ink-950/40 text-bone backdrop-blur-sm hover:border-gold/70 hover:text-gold-bright",
  quiet: "px-0 text-bone hover:text-gold-bright",
};

function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_250_230/0.45),transparent)] opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-brand)] group-hover/btn:translate-x-[300%] group-hover/btn:opacity-100 motion-reduce:hidden"
    />
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`size-4 shrink-0 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-brand)] group-hover/btn:translate-x-0.5 group-hover:translate-x-0.5 ${className}`}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  href: ComponentProps<typeof Link>["href"];
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
};

export function GoldButton({
  href,
  variant = "primary",
  children,
  arrow = true,
  className = "",
}: Props) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {variant === "primary" ? <Sheen /> : null}
      <span className="relative">{children}</span>
      {arrow ? <Arrow className="relative" /> : null}
    </Link>
  );
}

export const buttonClasses = { base, variants };
