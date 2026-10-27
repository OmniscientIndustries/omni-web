import type { Metadata } from "next";
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
      src: "/media/rail-operational-intelligence.webp",
      alt: "Railway operational intelligence at dusk",
      width: 1024,
      height: 573,
    },
  }),
  title: { absolute: "Omniscient Industries Limited | Intelligence for the Physical World" },
};

export default function HomePage() {
  return (
    <>
      <CompanyBrainHero />
      <IndustriesSection />
      <NewsSection />
    </>
  );
}
