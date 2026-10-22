import { OmniscientMark } from "@/components/brand/OmniscientMark";
import { GoldButton } from "@/components/ui/GoldButton";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  title: string;
  text: string;
  href?: string;
  label?: string;
};

export function CtaBand({ title, text, href = "/contact", label = "Start a conversation" }: Props) {
  return (
    <section aria-labelledby="cta-title" className="py-20 sm:py-28">
      <div className="container-site">
        <Reveal className="relative overflow-hidden rounded-[22px] border border-line bg-ink-900 px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden className="pointer-events-none absolute -top-40 -right-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(183_151_104/0.14),transparent_65%)]" />
          <OmniscientMark className="pointer-events-none absolute top-1/2 right-10 hidden size-40 -translate-y-1/2 opacity-[0.14] lg:block" />
          <div className="relative max-w-2xl">
            <h2 id="cta-title" className="text-heading text-[clamp(1.75rem,3.4vw,2.75rem)] text-bone">
              {title}
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-stone">{text}</p>
            <GoldButton href={href} className="mt-8 w-full sm:w-auto">
              {label}
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
