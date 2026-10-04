import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
  align?: "split" | "stacked";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  as: Tag = "h2",
  align = "split",
  className = "",
}: Props) {
  const split = align === "split";
  return (
    <Reveal
      className={`grid gap-6 ${split ? "lg:grid-cols-12 lg:items-end lg:gap-10" : ""} ${className}`}
    >
      <div className={split ? "lg:col-span-7" : ""}>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span aria-hidden className="h-px w-8 bg-gold/60" />
          {eyebrow}
        </p>
        <Tag
          id={id}
          className="text-heading max-w-[20ch] text-[clamp(2rem,4.2vw,3.5rem)] text-bone"
        >
          {title}
        </Tag>
      </div>
      {intro ? (
        <div className={split ? "lg:col-span-5 lg:pb-2" : ""}>
          <p className="measure text-[1.0625rem] leading-relaxed text-stone">{intro}</p>
        </div>
      ) : null}
    </Reveal>
  );
}
