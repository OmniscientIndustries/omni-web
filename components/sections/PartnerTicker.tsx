"use client";

import Image from "next/image";
import { useState } from "react";
import { partners, partnersLabel, type Partner } from "@/content/partners";

function Separator() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className="size-2.5 shrink-0 text-gold-muted">
      <circle cx="6" cy="6" r="2" fill="currentColor" />
      <circle cx="6" cy="6" r="4.6" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1.4" />
    </svg>
  );
}

function PartnerMark({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <Image
        src={partner.logo.src}
        alt={partner.name}
        width={partner.logo.width}
        height={partner.logo.height}
        className="h-[clamp(24px,1.55vw,32px)] w-auto opacity-75 transition-opacity duration-[var(--duration-standard)] hover:opacity-100"
      />
    );
  }
  return (
    <span className="text-[clamp(24px,1.55vw,32px)] leading-none font-[450] tracking-[-0.01em] whitespace-nowrap text-[rgb(245_240_226/0.76)] transition-colors duration-[var(--duration-standard)] hover:text-gold-bright">
      {partner.name}
    </span>
  );
}

/** Each of the two identical groups repeats the set so it is always wider than wide screens. */
const REPEATS = 2;

function Row({ hidden = false }: { hidden?: boolean }) {
  const items = Array.from({ length: REPEATS }, (_, r) => partners.map((p) => ({ partner: p, copy: r }))).flat();
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map(({ partner, copy }) => (
        <li
          key={`${copy}-${partner.name}`}
          aria-hidden={!hidden && copy > 0 ? true : undefined}
          className="flex items-center gap-[clamp(37px,3.5vw,75px)] pr-[clamp(37px,3.5vw,75px)]"
        >
          <PartnerMark partner={partner} />
          <Separator />
        </li>
      ))}
    </ul>
  );
}

export function PartnerTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      aria-labelledby="partners-label"
      className="relative flex min-h-[clamp(180px,11vw,230px)] flex-col justify-center border-y border-line bg-ink-900"
    >
      <div aria-hidden className="gold-hairline absolute inset-x-0 top-0 h-px opacity-40" />
      <div className="container-site flex items-center justify-between gap-4 pt-6 sm:pt-7">
        <h2
          id="partners-label"
          className="font-mono text-[clamp(13px,0.78vw,16px)] leading-snug tracking-[clamp(3px,0.28vw,6px)] text-stone uppercase"
        >
          {partnersLabel}
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.625rem] tracking-[0.18em] text-stone-dim uppercase transition-colors hover:text-gold motion-reduce:hidden"
        >
          <span aria-hidden className="flex size-3 items-center justify-center gap-[3px]">
            {paused ? (
              <svg viewBox="0 0 8 8" className="size-2.5"><path d="M1 0.5 L7.5 4 L1 7.5Z" fill="currentColor" /></svg>
            ) : (
              <>
                <span className="h-2.5 w-[2px] bg-current" />
                <span className="h-2.5 w-[2px] bg-current" />
              </>
            )}
          </span>
          {paused ? "Play" : "Pause"}
          <span className="sr-only"> partner list animation</span>
        </button>
      </div>

      {/* Animated marquee: hidden when the user prefers reduced motion. */}
      <div
        className="ticker ticker-mask relative overflow-hidden py-8 motion-reduce:hidden sm:py-10"
        data-paused={paused}
      >
        <div className="ticker-track flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>

      {/* Static wrapped row for reduced motion. */}
      <div className="container-site hidden py-7 motion-reduce:block">
        <ul className="flex flex-wrap items-center gap-x-[clamp(48px,5vw,110px)] gap-y-5">
          {partners.map((partner) => (
            <li key={partner.name} className="flex items-center">
              <PartnerMark partner={partner} />
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="gold-hairline absolute inset-x-0 bottom-0 h-px opacity-25" />
    </section>
  );
}
