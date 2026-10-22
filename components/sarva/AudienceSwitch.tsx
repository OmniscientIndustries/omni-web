"use client";

import { motion } from "motion/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { audiences } from "@/content/sarva";
import { ease } from "@/lib/motion";

const KEYS = ["people", "police"] as const;
type Key = (typeof KEYS)[number];

/** Accessible segmented control (WAI-ARIA tabs). Both panels stay in the DOM. */
export function AudienceSwitch() {
  const [selected, setSelected] = useState<Key>("people");
  const tabs = useRef<Record<Key, HTMLButtonElement | null>>({ people: null, police: null });

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const i = KEYS.indexOf(selected);
    let next: Key | undefined;
    if (event.key === "ArrowRight") next = KEYS[(i + 1) % KEYS.length];
    if (event.key === "ArrowLeft") next = KEYS[(i - 1 + KEYS.length) % KEYS.length];
    if (event.key === "Home") next = KEYS[0];
    if (event.key === "End") next = KEYS[KEYS.length - 1];
    if (!next) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="SARVA audiences"
        className="relative inline-grid grid-cols-2 rounded-xl border border-line-strong bg-ink-950 p-1"
      >
        {KEYS.map((key) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabs.current[key] = el;
              }}
              id={`tab-${key}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`panel-${key}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(key)}
              onKeyDown={onKeyDown}
              className={`relative z-10 min-h-11 rounded-lg px-5 text-[0.9375rem] font-medium transition-colors duration-[var(--duration-fast)] sm:px-7 ${isSelected ? "text-ink-950" : "text-stone hover:text-bone"}`}
            >
              {isSelected ? (
                <motion.span
                  layoutId="audience-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-[linear-gradient(180deg,#d7c4a4,#C9A633)]"
                  transition={{ duration: 0.35, ease: ease.brand }}
                />
              ) : null}
              {audiences[key].label}
            </button>
          );
        })}
      </div>

      {KEYS.map((key) => {
        const audience = audiences[key];
        const isSelected = selected === key;
        return (
          <div
            key={key}
            id={`panel-${key}`}
            role="tabpanel"
            aria-labelledby={`tab-${key}`}
            hidden={!isSelected}
            tabIndex={0}
            className="mt-10 rounded-[20px] focus-visible:outline-offset-8"
          >
            {isSelected ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: ease.brand }}
              >
                <h3 className="text-heading text-[clamp(1.6rem,2.6vw,2.2rem)] text-bone">{audience.heading}</h3>
                <ul className="mt-8 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {audience.items.map((item, i) => (
                    <li key={item.title} className="bg-ink-900 p-6">
                      <p className="font-mono text-[0.625rem] tracking-[0.18em] text-gold">0{i + 1}</p>
                      <h4 className="mt-3 text-[1.0625rem] font-medium text-bone">{item.title}</h4>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              // Hidden panels keep their content in the DOM for search and no-JS parity.
              <div>
                <h3>{audience.heading}</h3>
                <ul>
                  {audience.items.map((item) => (
                    <li key={item.title}>
                      {item.title}: {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
