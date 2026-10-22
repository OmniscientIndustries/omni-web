import type { Metadata } from "next";
import { BrandHero } from "@/components/sections/BrandHero";
import { CompanyBrainHero } from "@/components/sections/CompanyBrainHero";
import { IndustriesSection } from "@/components/sections/IndustriesSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Omniscient Industries Limited | Intelligence for the Physical World",
    description: site.description,
    path: "/",
    image: {
      src: "/brand/hero-board.jpg",
      alt: "Omniscient Industries Limited",
      width: 1588,
      height: 794,
    },
  }),
    title: { absolute: "Omniscient Industries Limited | Intelligence for the Physical World" },
};

export default function HomePage() {
  return (
    <>
      <BrandHero />
      <CompanyBrainHero />
      <IndustriesSection />
      <NewsSection />
    </>
  );
}
