import type { Metadata } from "next";
import { OmniscientMark } from "@/components/brand/OmniscientMark";
import { GoldButton } from "@/components/ui/GoldButton";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-28 pb-20">
      <div className="container-site max-w-[44rem]">
        <OmniscientMark className="size-12 text-gold" />
        <p className="eyebrow mt-10">404</p>
        <h1 className="text-display mt-5 text-[clamp(2.25rem,5vw,3.75rem)] text-bone">This signal could not be found.</h1>
        <p className="mt-5 text-[1.125rem] leading-relaxed text-stone">
          The page may have moved, or the link may be incomplete.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <GoldButton href="/">Return home</GoldButton>
          <GoldButton href="/industries" variant="secondary">
            Explore Industries
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
