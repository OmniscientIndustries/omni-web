"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/brand/OmniscientMark";
import { primaryNavigation } from "@/content/site";
import { isActiveRoute as isActive } from "@/lib/nav";
import { MobileNavigation } from "./MobileNavigation";

export function SiteHeader() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  // Background and border intensity follow scroll via a CSS variable —
  // no React state, so scrolling never re-renders the header.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty("--hp", Math.min(window.scrollY / 180, 1).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      className="animate-drop fixed inset-x-0 top-0 z-50 border-b border-[rgb(183_151_104/calc(var(--hp,0)*0.16))] bg-[rgb(5_5_5/calc(var(--hp,0)*0.82))] pt-[env(safe-area-inset-top,0px)] backdrop-blur-[calc(var(--hp,0)*16px)] [--hp:0] lg:pt-0"
    >
      <div className="container-site flex h-[var(--header-bar)] items-center justify-between gap-3">
        <Link
          href="/"
          className="-mx-2 flex min-h-11 items-center px-2"
          aria-label="Omniscient Industries Limited — home"
        >
          <Wordmark responsive />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-[clamp(14px,1.2vw,28px)]">
            {primaryNavigation.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.emphasis) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group inline-flex min-h-[clamp(56px,3.4vw,70px)] items-center gap-2.5 rounded-[10px] border border-line-strong px-[clamp(28px,2vw,42px)] text-[clamp(18px,1.08vw,22px)] font-medium text-bone transition-colors duration-[var(--duration-fast)] hover:border-gold/70 hover:text-gold-bright aria-[current=page]:border-gold/70 aria-[current=page]:text-gold-bright"
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-gold transition-transform duration-[var(--duration-fast)] group-hover:scale-125"
                      />
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative inline-flex min-h-11 items-center text-[clamp(18px,1.08vw,22px)] text-stone transition-colors duration-[var(--duration-fast)] hover:text-bone aria-[current=page]:text-bone"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 bottom-1.5 h-px origin-left bg-gold transition-transform duration-[var(--duration-standard)] ease-[var(--ease-brand)] ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNavigation pathname={pathname} />
      </div>
    </header>
  );
}
