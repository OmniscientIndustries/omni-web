import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { isContactCategory } from "@/content/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Build the next intelligent operating environment with Omniscient Industries — industry pilots, research collaboration, technology partnerships, investment and general enquiries.",
  path: "/contact",
});

const nextSteps = [
  "We read every enquiry personally.",
  "If there is a fit, we will suggest a short call to understand your operational context.",
  "Pilots are scoped carefully, with clear success criteria and data agreements.",
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { interest } = await searchParams;
  const initialInterest = typeof interest === "string" && isContactCategory(interest) ? interest : undefined;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Build the next intelligent operating environment with us."
        intro="Tell us about the environment you operate, the decisions that matter and where information is fragmented today."
      />
      <section aria-label="Enquiry form" className="pb-24 sm:pb-32">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 className="system-label text-gold">What happens next</h2>
              <ol className="mt-6 space-y-6">
                {nextSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-gold-muted">0{i + 1}</span>
                    <span className="leading-relaxed text-stone">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-10 border-t border-line pt-6 text-[0.875rem] leading-relaxed text-stone-dim">
                We use the details you provide only to respond to your enquiry.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ContactForm initialInterest={initialInterest} />
          </div>
        </div>
      </section>
    </>
  );
}
