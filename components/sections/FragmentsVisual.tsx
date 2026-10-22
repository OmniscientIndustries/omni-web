import { OmniscientMark } from "@/components/brand/OmniscientMark";

/** Eight fragmented sources around a single core (3×3 grid, centre = core). */
export function FragmentsVisual({ fragments }: { fragments: readonly string[] }) {
  const cells = [...fragments.slice(0, 4), null, ...fragments.slice(4, 8)];
  const centres = [1, 3, 5].flatMap((y) => [1, 3, 5].map((x) => [x / 6, y / 6]));

  return (
    <div className="relative rounded-[20px] border border-line bg-ink-900 p-4 sm:p-6">
      <svg aria-hidden viewBox="0 0 600 600" preserveAspectRatio="none" className="pointer-events-none absolute inset-4 size-[calc(100%-2rem)] sm:inset-6 sm:size-[calc(100%-3rem)]">
        {centres.map(([x, y], i) =>
          i === 4 ? null : (
            <line
              key={i}
              x1={x * 600}
              y1={y * 600}
              x2="300"
              y2="300"
              stroke="#b79768"
              strokeOpacity="0.35"
              strokeDasharray={i % 2 ? "3 6" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ),
        )}
      </svg>
      <ul className="relative grid grid-cols-3 gap-3 sm:gap-4">
        {cells.map((label) =>
          label ? (
            <li
              key={label}
              className="flex aspect-square items-center justify-center rounded-xl border border-line bg-ink-950/90 p-2 text-center text-[0.75rem] leading-snug text-stone sm:text-[0.875rem]"
            >
              {label}
            </li>
          ) : (
            <li key="core" aria-hidden className="flex aspect-square items-center justify-center rounded-xl border border-line-strong bg-[radial-gradient(circle,rgb(183_151_104/0.16),transparent_70%)]">
              <OmniscientMark className="size-1/2" />
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
