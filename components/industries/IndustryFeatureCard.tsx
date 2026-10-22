import Link from "next/link";
import { Arrow } from "@/components/ui/GoldButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import type { Industry } from "@/content/industries";
import { RailTwinOverlay } from "./RailTwinOverlay";

type Props = {
  industry: Industry;
  index: number;
  subtitle: string;
  sizes: string;
  className?: string;
};

/** Dominant card for the two launch industries. */
export function IndustryFeatureCard({ industry, index, subtitle, sizes, className = "" }: Props) {
  const isRail = industry.slug === "rail";
  return (
    <Link
      href={industry.href}
      className={`group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-ink-900 transition-[border-color,box-shadow] duration-[var(--duration-standard)] ease-[var(--ease-brand)] hover:border-line-strong hover:shadow-[0_30px_80px_-40px_rgb(183_151_104/0.35)] focus-visible:border-gold/70 ${className}`}
    >
      <div className="relative">
        <MediaFrame
          image={industry.image}
          procedural={industry.procedural}
          uid={`card-${industry.slug}`}
          sizes={sizes}
          decorative
          className="aspect-[1024/573]"
          imageClassName="transition-[transform,filter] duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.035] motion-reduce:group-hover:scale-100"
        />
        {isRail ? <RailTwinOverlay /> : null}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-transparent" />
        <p className="absolute top-5 left-5 rounded-md border border-line bg-ink-950/70 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.18em] text-gold uppercase backdrop-blur-sm">
          0{index} · Launch industry
        </p>
      </div>

      <div className="relative flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-heading text-[clamp(1.9rem,3.2vw,2.75rem)] text-bone">{industry.name}</h3>
          {industry.product ? (
            <p className="font-mono text-[0.75rem] tracking-[0.24em] text-gold uppercase">
              <span className="sr-only">Launch product: </span>
              {industry.product}
            </p>
          ) : null}
        </div>
        <p className="mt-3 max-w-[46ch] text-[1.0625rem] leading-relaxed text-stone">{subtitle}</p>

        {industry.concepts ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${industry.name} capabilities`}>
            {industry.concepts.map((c) => (
              <li key={c} className="rounded-md border border-line px-2.5 py-1.5 text-[0.75rem] text-stone transition-colors duration-[var(--duration-standard)] group-hover:border-line-strong group-hover:text-bone/85">
                {c}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto pt-8">
          <div className="relative h-px bg-line">
            <div aria-hidden className="card-line absolute inset-0 bg-gold" />
          </div>
          <p className="mt-5 flex items-center gap-2 text-[0.9375rem] font-medium text-bone transition-colors group-hover:text-gold-bright">
            Explore {industry.name}
            <Arrow />
          </p>
        </div>
      </div>
    </Link>
  );
}
