import Image from "next/image";
import type { MediaAsset } from "@/content/industries";

type Callout = { x: number; y: number; label: string; side: "left" | "right" };

/** Image at native aspect so callout coordinates stay true at every breakpoint. */
export function AnnotatedImage({
  image,
  callouts,
  caption,
  preload,
}: {
  image: MediaAsset;
  callouts: Callout[];
  caption: string;
  preload?: boolean;
}) {
  return (
    <figure>
      <div className="relative overflow-hidden rounded-[20px] border border-line">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="93vw"
          preload={preload}
          className="h-auto w-full"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(5_5_5/0.45))]" />
        <ul aria-hidden className="absolute inset-0">
          {callouts.map((c, i) => (
            <li
              key={c.label}
              className="animate-rise absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%`, ["--delay" as string]: `${500 + i * 140}ms` }}
            >
              <span className="absolute -translate-x-1/2 -translate-y-1/2">
                <span className="block size-4 rounded-full border border-gold-bright/90 bg-ink-950/40 shadow-[0_0_14px_rgb(215_196_164/0.45)] sm:size-5" />
                <span className="absolute inset-0 m-auto block size-1.5 rounded-full bg-gold-bright" />
              </span>
              <span
                className={`absolute top-0 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap md:flex ${c.side === "right" ? "left-4" : "right-4 flex-row-reverse"}`}
              >
                <span className="h-px w-6 bg-gold/70" />
                <span className="rounded-md border border-line-strong bg-ink-950/80 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-bone uppercase backdrop-blur-sm">
                  {c.label}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-[0.875rem] text-stone-dim">
        <span>{caption}</span>
        <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase">Illustrative visualisation</span>
      </figcaption>
    </figure>
  );
}
