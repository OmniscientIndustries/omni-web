/**
 * Emblem curves traced from the approved 19 October 2026 brand board.
 * The board's mark is only about 100 pixels tall, so the site uses this
 * resolution-independent outline instead of enlarging that JPEG.
 */
const emblemPaths = [
  "M 487.0 82.0 C 500.7 24.7 490.2 37.8 502.0 95.0 C 513.8 152.2 558.0 312.7 558.0 425.0 C 558.0 537.3 515.3 710.5 502.0 769.0 C 488.7 827.5 491.7 831.0 478.0 776.0 C 464.3 721.0 418.5 554.7 420.0 439.0 C 421.5 323.3 473.3 139.3 487.0 82.0 Z",
  "M 568.0 80.0 C 568.8 43.8 730.3 163.2 785.0 217.0 C 839.7 270.8 879.7 366.2 896.0 403.0 C 912.3 439.8 900.2 425.3 883.0 438.0 C 865.8 450.7 810.2 479.7 793.0 479.0 C 775.8 478.3 817.5 500.5 780.0 434.0 C 742.5 367.5 567.2 116.2 568.0 80.0 Z",
  "M 406.0 80.0 C 407.3 115.3 238.7 361.5 202.0 428.0 C 165.3 494.5 204.2 477.7 186.0 479.0 C 167.8 480.3 110.5 448.2 93.0 436.0 C 75.5 423.8 64.2 442.7 81.0 406.0 C 97.8 369.3 139.8 270.3 194.0 216.0 C 248.2 161.7 404.7 44.7 406.0 80.0 Z",
  "M 893.0 465.0 C 910.2 480.5 843.3 613.7 793.0 665.0 C 742.7 716.3 608.2 788.5 591.0 773.0 C 573.8 757.5 639.7 623.3 690.0 572.0 C 740.3 520.7 875.8 449.5 893.0 465.0 Z",
  "M 80.0 465.0 C 100.2 453.5 232.7 517.0 284.0 568.0 C 335.3 619.0 402.7 753.2 388.0 771.0 C 373.3 788.8 233.5 697.3 196.0 675.0 C 158.5 652.7 182.3 672.0 163.0 637.0 C 143.7 602.0 59.8 476.5 80.0 465.0 Z",
];

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
      viewBox="0 0 984 864"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
    >
      {emblemPaths.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill="currentColor" />
      ))}
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
