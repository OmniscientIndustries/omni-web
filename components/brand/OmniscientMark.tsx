/*
 * TEMPORARY BRAND MARK
 * No approved Omniscient logo asset was supplied. This is a minimal abstract
 * radial "computational sun" placeholder. When the official asset is available,
 * place it at /public/brand/omniscient-mark.svg and replace the body of this
 * component with a single <img>/<Image>. Every usage on the site goes through
 * this component and <Wordmark>, so the swap is a one-file change.
 */

const RAYS = 32;

function ray(i: number) {
  const angle = (i / RAYS) * Math.PI * 2;
  const long = i % 2 === 0;
  const inner = 11.5;
  const outer = long ? 21.5 : 17.5;
  const spread = long ? 0.045 : 0.035;
  const p = (r: number, a: number) =>
    `${(24 + Math.cos(a) * r).toFixed(2)},${(24 + Math.sin(a) * r).toFixed(2)}`;
  return `M${p(inner, angle - spread)} L${p(outer, angle)} L${p(inner, angle + spread)} Z`;
}

const rayPath = Array.from({ length: RAYS }, (_, i) => ray(i)).join(" ");

export function OmniscientMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  const decorative = !title;
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id="om-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E3A1" />
          <stop offset="0.5" stopColor="#D3AF37" />
          <stop offset="1" stopColor="#8D7530" />
        </linearGradient>
        <radialGradient id="om-core" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#2A2620" />
          <stop offset="1" stopColor="#050505" />
        </radialGradient>
      </defs>
      <path d={rayPath} fill="url(#om-gold)" />
      <circle cx="24" cy="24" r="9.6" fill="none" stroke="url(#om-gold)" strokeWidth="1.3" />
      <circle cx="24" cy="24" r="7.4" fill="url(#om-core)" />
      <circle cx="24" cy="24" r="2.1" fill="#D3AF37" opacity="0.9" />
    </svg>
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
          ? "gap-3 tracking-[0.24em] lg:gap-[clamp(14px,1vw,20px)] lg:tracking-[clamp(4px,0.38vw,8px)]"
          : "gap-2.5 tracking-[0.24em]"
      } ${className}`}
    >
      <OmniscientMark
        className={`shrink-0 ${responsive ? "size-[34px] lg:size-[clamp(40px,2.65vw,54px)]" : "size-7"}`}
      />
      <span className={`leading-none ${responsive ? "text-[15px] lg:text-[clamp(18px,1.18vw,24px)]" : "text-[0.82rem]"}`}>
        OMNISCIENT
        {full ? <span className="text-stone"> INDUSTRIES</span> : null}
      </span>
    </span>
  );
}
