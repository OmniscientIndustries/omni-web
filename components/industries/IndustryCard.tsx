import Link from "next/link";
import { Arrow } from "@/components/ui/GoldButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { expansionStatus, type Industry } from "@/content/industries";
import { StatusBadge } from "./StatusBadge";

/** Compact card for expansion industries. */
export function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  return (
    <Link
      href={industry.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-ink-900 transition-[border-color] duration-[var(--duration-standard)] hover:border-line-strong focus-visible:border-gold/70"
    >
      <div className="relative">
        <MediaFrame
          image={industry.image}
          procedural={industry.procedural}
          uid={`card-${industry.slug}`}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          decorative
          className="aspect-[4/3]"
          imageClassName="transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent" />
        <StatusBadge className="absolute top-4 left-4" />
      </div>

      <div className="relative -mt-10 flex flex-1 flex-col px-6 pb-6">
        <p className="font-mono text-[0.625rem] tracking-[0.18em] text-gold-muted uppercase">0{index} · Expansion</p>
        <h3 className="text-heading mt-3 text-[1.625rem] text-bone">{industry.name}</h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{industry.summary}</p>
        <p className="mt-3 text-[0.8125rem] leading-snug text-stone-dim">{expansionStatus.short}</p>
        <div className="mt-auto pt-6">
          <div className="relative h-px bg-line">
            <div aria-hidden className="card-line absolute inset-0 bg-gold" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-[0.875rem] font-medium text-bone transition-colors group-hover:text-gold-bright">
            Explore
            <span className="sr-only"> {industry.name}</span>
            <Arrow />
          </p>
        </div>
      </div>
    </Link>
  );
}
