import Link from "next/link";
import { industries } from "@/content/industries";
import { site } from "@/content/site";
import { FooterSignature } from "./FooterSignature";

const company = [
  { label: "Mission", href: "/mission" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Placeholders until approved legal documents exist; intentionally not links.
const legal = ["Privacy notice", "Terms of use", "Cookie policy"];

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="system-label mb-5 text-gold">{title}</h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-[0.95rem] text-stone transition-colors duration-[var(--duration-fast)] hover:text-bone"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgb(211_175_55/0.08),transparent_70%)]"
      />
      <div className="container-site relative pt-16 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pt-20 lg:pt-28">
        <FooterSignature />

        <div className="mt-14 text-center lg:mt-16">
          <p className="metal-text text-[clamp(1.2rem,7.2vw,5.75rem)] leading-none font-medium tracking-[0.06em] sm:tracking-[0.12em]">
            OMNISCIENT INDUSTRIES
          </p>
          <p className="mt-5 text-[1.0625rem] text-stone lg:text-lg">{site.tagline}</p>
        </div>

        <div className="mt-20 grid gap-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-stone">
              Operational intelligence for rail, public security and complex physical
              environments — connecting systems, people and places into one accountable picture.
            </p>
            <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-gold-muted uppercase">
              Perceive · Understand · Act
            </p>
          </div>
          <div className="lg:col-span-3">
            <FooterLinks
              title="Industries"
              links={industries.map((i) => ({ label: i.name, href: i.href }))}
            />
          </div>
          <div className="lg:col-span-2">
            <FooterLinks title="Company" links={company} />
          </div>
          <div className="lg:col-span-2">
            <h2 className="system-label mb-5 text-gold">Legal</h2>
            <ul className="space-y-1">
              {legal.map((item) => (
                <li key={item} className="flex min-h-11 items-center text-[0.95rem] text-stone-dim">
                  {item}
                  <span className="sr-only"> (in preparation)</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] text-stone-dim uppercase">
              In preparation
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[0.8125rem] text-stone-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Omniscient Industries. All rights reserved.</p>
          <p>Intelligence for the physical world.</p>
        </div>
      </div>
    </footer>
  );
}
