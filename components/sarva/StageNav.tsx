"use client";

import { useEffect, useState } from "react";

type Stage = { id: string; index: string; label: string };

/** Sticky index of the four SARVA stages; highlights the stage in view. */
export function StageNav({ stages }: { stages: readonly Stage[] }) {
  const [active, setActive] = useState(stages[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id.replace("stage-", ""));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    stages.forEach((s) => {
      const el = document.getElementById(`stage-${s.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [stages]);

  return (
    <nav aria-label="SARVA stages">
      <ol className="space-y-1">
        {stages.map((s) => {
          const current = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#stage-${s.id}`}
                aria-current={current ? "step" : undefined}
                className="group flex min-h-12 items-center gap-4 rounded-lg px-3 transition-colors hover:bg-ink-800"
              >
                <span className={`font-mono text-[0.6875rem] tracking-[0.18em] transition-colors ${current ? "text-gold" : "text-stone-dim"}`}>
                  {s.index}
                </span>
                <span className={`h-px transition-[width,background-color] duration-[var(--duration-standard)] ${current ? "w-10 bg-gold" : "w-4 bg-line-strong"}`} />
                <span className={`text-[0.9375rem] transition-colors ${current ? "text-bone" : "text-stone group-hover:text-bone"}`}>
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
