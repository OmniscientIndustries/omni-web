import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { GoldButton } from "@/components/ui/GoldButton";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SafeZone Rail",
  description:
    "SafeZone Rail is a supplementary operational-awareness app for authorised railway workers. It shows an assigned work zone, warns at the boundary during a shift, and records shift events.",
  path: "/products/safezone-rail",
});

const capabilities = [
  {
    title: "Worker authentication",
    body: "An authorised worker signs in with the email and password issued for their account. Accounts are provisioned by an administrator. There is no public registration.",
  },
  {
    title: "Work-zone visibility",
    body: "During a shift the app shows the work zone assigned to that worker, so the boundary of the authorised area is visible on the device.",
  },
  {
    title: "Location-aware geofencing",
    body: "While a shift is active, the app uses the device location to judge whether the worker is inside the assigned zone. Location monitoring is for that shift. It is not a continuous record of movement.",
  },
  {
    title: "Shift sessions",
    body: "The worker starts and ends a shift in the app. Starting a shift begins zone monitoring. Ending a shift stops it.",
  },
  {
    title: "Boundary warnings",
    body: "If the app confirms the worker has left the assigned zone, it raises a warning on that device. A confirmed breach can keep an on-device alarm sounding until the worker returns, ends the shift, signs out, or the zone is no longer assigned. The alarm depends on the device volume.",
  },
  {
    title: "Activity events",
    body: "The app records shift start, shift end, zone entry and zone exit. These are events, not a GPS track.",
  },
  {
    title: "Offline synchronisation",
    body: "If the network is unavailable, events are queued on the device and sent when a connection is available again. A delay means the upload is waiting, not that the shift failed to start locally.",
  },
];

export default function SafeZoneRailPage() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="SafeZone Rail"
        intro="A supplementary operational-awareness tool for authorised railway workers. It shows an assigned work zone and warns the person carrying the phone when they leave it."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <GoldButton href="/support/safezone-rail">Support</GoldButton>
          <GoldButton href="/privacy/safezone-rail" variant="secondary">
            Privacy
          </GoldButton>
          <GoldButton href="/contact" variant="secondary">
            Contact
          </GoldButton>
        </div>
      </PageHero>

      <section aria-labelledby="what-it-does" className="pb-24 sm:pb-32">
        <div className="container-site">
          <h2 id="what-it-does" className="text-display text-[clamp(1.8rem,4vw,2.6rem)] text-bone">
            What the current iOS app does
          </h2>
          <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-stone">
            SafeZone Rail for iOS is published by Omniscient Industries Limited. The description below
            matches the worker app as built: sign-in, an assigned zone, shift monitoring, boundary
            warnings, event recording and offline upload.
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {capabilities.map((item) => (
              <li key={item.title} className="rounded-[14px] border border-line bg-ink-900/60 p-6">
                <h3 className="text-[1.05rem] font-medium text-bone">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="what-it-is-not" className="border-t border-line pb-24 sm:pb-32">
        <div className="container-site pt-16 sm:pt-20">
          <h2 id="what-it-is-not" className="text-display text-[clamp(1.8rem,4vw,2.6rem)] text-bone">
            What it does not do
          </h2>
          <ul className="mt-8 max-w-3xl space-y-4 text-[1.02rem] leading-relaxed text-stone">
            <li>It does not prevent accidents, and it does not replace a safe system of work or authorised railway protection.</li>
            <li>It does not detect trains.</li>
            <li>It is not a certified safety system, and this page does not claim a safety approval.</li>
            <li>Apple Critical Alerts are not enabled. A notification can be hidden by Silent Mode, Focus or Do Not Disturb.</li>
            <li>It does not give the worker authority to set protection or to change a possession.</li>
          </ul>
          <p className="mt-8 max-w-3xl leading-relaxed text-stone">
            Workers follow their employer&apos;s procedures and the instructions of the responsible person on site.
            Support, privacy and contact details are published separately.
          </p>
          <p className="mt-6 flex flex-col gap-3 text-[0.98rem] sm:flex-row sm:gap-8">
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/support/safezone-rail">
              SafeZone Rail support
            </Link>
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/privacy/safezone-rail">
              SafeZone Rail privacy
            </Link>
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/contact">
              Contact Omniscient
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
