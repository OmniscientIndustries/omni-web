import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ReducedMotionProvider } from "@/components/ui/ReducedMotionProvider";
import { site } from "@/content/site";
import { jsonLd, siteUrl } from "@/lib/seo";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Omniscient Industries | Intelligence for the Physical World",
    template: "%s | Omniscient Industries",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const organisation = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  description: site.description,
  slogan: site.tagline,
  ...(site.url ? { url: site.url } : {}),
  founder: site.founders.map((name) => ({ "@type": "Person", name })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${instrument.variable} ${geistMono.variable} antialiased`}>
      <body className="grain flex min-h-svh flex-col">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-lg bg-gold px-4 py-3 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ReducedMotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </ReducedMotionProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organisation)} />
      </body>
    </html>
  );
}
