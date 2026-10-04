import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  back?: { href: string; label: string };
};

export function PageHero({ eyebrow, title, intro, children, aside, back }: Props) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_80%_0%,rgb(211_175_55/0.09),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(211_175_55/0.035)_1px,transparent_1px)] bg-[size:100%_88px] [mask-image:linear-gradient(180deg,#000,transparent_85%)]"
      />
      <div className="container-site relative">
        {back ? (
          <Link
            href={back.href}
            className="group mb-10 inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-stone uppercase transition-colors hover:text-gold"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5">
              <path d="M14 8H3M7 4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {back.label}
          </Link>
        ) : null}
        <div className={`grid gap-12 ${aside ? "lg:grid-cols-12 lg:items-end" : ""}`}>
          <div className={aside ? "lg:col-span-7" : "max-w-4xl"}>
            <p className="eyebrow animate-rise mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              {eyebrow}
            </p>
            <h1
              id="page-title"
              className="text-display animate-rise text-[clamp(2.4rem,5.4vw,4.6rem)] text-bone [--delay:80ms]"
            >
              {title}
            </h1>
            {intro ? (
              <p className="measure animate-rise mt-7 text-[1.0625rem] leading-relaxed text-stone [--delay:160ms] sm:text-lg">
                {intro}
              </p>
            ) : null}
            {children ? <div className="animate-rise mt-9 [--delay:240ms]">{children}</div> : null}
          </div>
          {aside ? <div className="animate-rise [--delay:240ms] lg:col-span-5">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
