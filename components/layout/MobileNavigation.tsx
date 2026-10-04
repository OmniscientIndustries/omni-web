"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Wordmark } from "@/components/brand/OmniscientMark";
import { industries } from "@/content/industries";
import { primaryNavigation } from "@/content/site";
import { duration, ease } from "@/lib/motion";
import { isActiveRoute as isActive } from "@/lib/nav";

const PANEL_ID = "mobile-navigation";
const subscribeNoop = () => () => {};

export function MobileNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const isClient = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen(true)}
        className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-3 px-2 text-[0.8125rem] font-medium tracking-[0.14em] text-bone uppercase"
      >
        Menu
        <span aria-hidden className="flex w-5 flex-col gap-[5px]">
          <span className="h-px w-full bg-gold" />
          <span className="h-px w-3/5 self-end bg-gold" />
        </span>
      </button>

      {isClient
        ? createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id={PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.standard, ease: ease.brand }}
          >
            <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
              <Link href="/" onClick={() => setOpen(false)} className="flex min-h-11 items-center" aria-label="Omniscient Industries — home">
                <Wordmark />
              </Link>
              <button
                type="button"
                onClick={close}
                className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center gap-3 px-2 text-[0.8125rem] font-medium tracking-[0.14em] text-bone uppercase"
              >
                Close
                <svg viewBox="0 0 16 16" aria-hidden className="size-4 text-gold">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav aria-label="Mobile primary" className="container-site flex flex-1 flex-col pt-10 pb-8">
              <ul className="flex flex-col">
                {primaryNavigation.map((item, index) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: duration.standard, ease: ease.brand, delay: 0.06 + index * 0.05 }}
                      className="border-b border-line"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="flex min-h-16 items-center justify-between py-4 text-[2rem] font-medium tracking-[-0.03em] text-bone aria-[current=page]:text-gold-bright"
                      >
                        {item.label}
                        <span className="font-mono text-xs tracking-[0.18em] text-gold-muted" aria-hidden>
                          0{index + 1}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-10">
                <p className="eyebrow mb-4">Industries</p>
                <ul className="grid grid-cols-2 gap-x-6">
                  {industries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={industry.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-11 items-center text-[0.95rem] text-stone hover:text-bone"
                      >
                        {industry.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-auto pt-10 font-mono text-[0.6875rem] tracking-[0.18em] text-stone-dim uppercase">
                Perceive · Understand · Act
              </p>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
