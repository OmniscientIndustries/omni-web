/**
 * Official Omniscient emblem, isolated from the approved 19 October 2026
 * brand board. This is a cropped photograph of that artwork, not a redraw.
 * A clean vector original is still needed for a sharper mark at large sizes.
 */
export function OmniscientMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const decorative = !title;
  return (
    // Native img: the asset is a small local PNG and must keep the exact pixels.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/omniscient-emblem.png"
      alt={decorative ? "" : title}
      width={322}
      height={280}
      className={className}
      aria-hidden={decorative ? true : undefined}
    />
  );
}

export function Wordmark({
  full = false,
  responsive = false,
  className = "",
}: {
  full?: boolean;
  /** Scales up on large and very wide screens (used by the site header). */
  responsive?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center font-medium text-bone ${
        responsive
          ? "gap-2.5 tracking-[0.16em] min-[400px]:gap-3 min-[400px]:tracking-[0.22em] lg:gap-[clamp(14px,1vw,20px)] lg:tracking-[clamp(4px,0.38vw,8px)]"
          : "gap-2.5 tracking-[0.24em]"
      } ${className}`}
    >
      <OmniscientMark
        className={`shrink-0 ${responsive ? "size-8 min-[400px]:size-[34px] lg:size-[clamp(40px,2.65vw,54px)]" : "size-7"}`}
      />
      <span className={`leading-none ${responsive ? "text-[13px] min-[400px]:text-[15px] lg:text-[clamp(18px,1.18vw,24px)]" : "text-[0.82rem]"}`}>
        OMNISCIENT
        {full ? <span className="text-stone"> INDUSTRIES</span> : null}
      </span>
    </span>
  );
}
