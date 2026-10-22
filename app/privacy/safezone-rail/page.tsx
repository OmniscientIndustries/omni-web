import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SafeZone Rail privacy",
  description:
    "Privacy information for SafeZone Rail for iOS: location, account and shift data, who can access it, the current pilot retention schedule, and how to ask for deletion.",
  path: "/privacy/safezone-rail",
});

const supportEmail = "info@omniscient-industries.com";

export default function SafeZonePrivacyPage() {
  return (
    <article className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <header className="container-site max-w-3xl pb-10">
        <p className="eyebrow mb-5">Privacy</p>
        <h1 className="text-display text-[clamp(2.2rem,6vw,3.6rem)] text-bone">SafeZone Rail privacy</h1>
        <p className="mt-6 text-[1.05rem] leading-relaxed text-stone">
          This page describes personal data processed by SafeZone Rail for iOS, published by Omniscient
          Industries Limited. It is written from the current iOS app and from Omniscient&apos;s
          operational retention schedule, effective 19 August 2026. It is not a substitute for the
          contract with the organisation that issued your account.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-stone-dim">
          Items marked “needs confirmation” are not settled in the materials reviewed for this page.
          They are not presented here as legal guarantees.
        </p>
      </header>

      <div className="container-site max-w-3xl space-y-10 text-[1.02rem] leading-relaxed text-stone">
        <section aria-labelledby="who" className="space-y-4">
          <h2 id="who" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Who is responsible
          </h2>
          <p>
            Omniscient Industries Limited publishes the app and operates the hosted service used by the
            current pilot. The organisation that issues a worker&apos;s account decides who may sign in
            and which work zone is assigned.
          </p>
          <p>
            Omniscient&apos;s operational schedule treats Omniscient as controller for the hosted pilot
            service, and the customer organisation as a joint or independent controller for account and
            worksite decisions. The in-app draft policy (version 0.1, 19 August 2026) says that in most
            deployments the client is the controller and Omniscient is the processor, and that the
            contract sets the role. <strong className="font-medium text-bone">Needs confirmation:</strong>{" "}
            which role applies to a particular deployment is a matter for that contract, not this page.
          </p>
          <p>
            The same draft names UK GDPR and the Data Protection Act 2018, and says the usual basis is
            legitimate interests, a legal obligation, or a contract, depending on the deployment. It
            says shift-time location is not treated as consent, because use is a condition of working
            in a monitored zone. <strong className="font-medium text-bone">Needs confirmation:</strong>{" "}
            those bases have not been separately certified for this website.
          </p>
        </section>

        <section aria-labelledby="data" className="space-y-4">
          <h2 id="data" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Data the iOS app processes
          </h2>
          <ul className="list-disc space-y-3 pl-5">
            <li>Account details issued for the worker: name, email address, role, organisation, and the authentication user id.</li>
            <li>A device identifier, written to the worker profile and to the session record.</li>
            <li>Precise location while a shift is active, used on the phone to compare the worker with the assigned zone.</li>
            <li>Background location only during an active shift, so that check can continue when the phone is locked or the app is not on screen.</li>
            <li>Shift activity recorded as events: shift start, shift end, zone entry and zone exit. These events are not a GPS track.</li>
            <li>An offline queue of those events on the phone, uploaded when a connection is available.</li>
            <li>An optional location ping sent during an active shift. The operational schedule says this must not be kept as a movement history.</li>
            <li>The session token, stored in the iOS Keychain until sign-out, expiry or uninstall.</li>
          </ul>
          <p>
            Face ID or Touch ID only unlocks a session already stored on that phone. Biometric data is
            not sent to Omniscient. The camera is used for the flashlight during a red warning. The app
            does not take photographs. The privacy manifest states that the app does not track users.
          </p>
          <p>
            There is no public sign-up. There is no in-app button that deletes the server account.
            Uninstalling the app removes the on-device session. It does not delete the hosted account.
          </p>
        </section>

        <section aria-labelledby="parties" className="space-y-4">
          <h2 id="parties" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Other parties
          </h2>
          <p>
            Sign-in and the stored account, zone, session and event records use Supabase. Shift events
            and the optional location ping are sent to Omniscient&apos;s hosted API. The app can query
            OpenStreetMap Overpass for nearby map features. Those queries are not stored as a worker
            profile. Apple provides the iPhone operating system, including location services and local
            notifications.
          </p>
          <p>
            The in-app draft still says hosting providers, analytics providers and international
            transfer locations are to be confirmed. No analytics or crash-reporting SDK was identified
            in the iOS app reviewed for this page.{" "}
            <strong className="font-medium text-bone">Needs confirmation:</strong> the countries where
            hosted data is stored, and the transfer safeguard that applies, are not stated in the
            reviewed materials.
          </p>
          <p>Omniscient does not sell this data. The operational schedule says it is not used for advertising.</p>
        </section>

        <section aria-labelledby="retention" className="space-y-4">
          <h2 id="retention" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Retention
          </h2>
          <p>
            The figures below are the operational pilot schedule effective 19 August 2026. The in-app
            draft policy still says the retention period for historical shift data is to be confirmed.
            Where those documents differ, the operational schedule says the stricter period applies.
            <strong className="font-medium text-bone"> Needs confirmation</strong> before these periods
            are treated as a final legal commitment.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>User profile: for the life of the account, then 30 days after a verified deletion or admin removal.</li>
            <li>Device session record: until sign-out, then 30 days.</li>
            <li>Work zone: until a planner deletes it, or 12 months after the shift end, whichever is first. A deleted zone is kept 90 days, then removed.</li>
            <li>Shift and zone events: 90 days from the event time.</li>
            <li>Precise location used for the on-device warning: discarded as the update is consumed. Monitoring stops when the shift ends or the worker signs out. No GPS history file is kept on the phone.</li>
            <li>Optional location ping: the schedule says not to keep a history, to overwrite any last position, and to delete it within 24 hours of shift end.</li>
            <li>Support email about a request: 12 months after the thread closes. Application logs: 90 days. Security incident records: 3 years, or as the incident requires.</li>
            <li>Backups: rolling 30 days. A deletion from the live system can remain in a backup until that backup expires.</li>
          </ul>
          <p>
            The schedule also says data is kept if it is reasonably required for an active safety
            investigation, a legal claim, or a regulatory enquiry.
          </p>
        </section>

        <section aria-labelledby="access" className="space-y-4">
          <h2 id="access" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Access, correction and deletion
          </h2>
          <p>
            Email{" "}
            <a className="text-gold-bright underline-offset-4 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>{" "}
            from the address on the account, or ask an organisation administrator. The operational
            schedule says an access copy covers the profile, events still inside the retention window,
            and feedback rows, and that the target for that response is 30 days. Deletion removes the
            authentication user, the profile and sessions. It does not promise deletion of records that
            a legal hold requires to be kept.
          </p>
          <p>
            If your employer is the controller for your deployment, contact them as well. Omniscient
            will act on the request or pass it to that organisation.
          </p>
          <p>
            <strong className="font-medium text-bone">Needs confirmation:</strong> this page does not
            create a deletion guarantee beyond the operational schedule, and it does not replace a
            request to the controller named in your organisation&apos;s contract.
          </p>
        </section>

        <section aria-labelledby="security" className="space-y-4">
          <h2 id="security" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Security
          </h2>
          <p>
            The app talks to its services over HTTPS. The session token is stored in the iOS Keychain.
            The phone does not keep a GPS history file. Access to hosted records is limited to the
            signed-in account and to the administrators of that service.
          </p>
          <p>
            The in-app draft says data is encrypted in transit and at rest.{" "}
            <strong className="font-medium text-bone">Needs confirmation:</strong> the at-rest control
            on the hosted database was not re-audited for this page.
          </p>
        </section>

        <section aria-labelledby="contact" className="space-y-4">
          <h2 id="contact" className="text-display text-[clamp(1.6rem,3vw,2.1rem)] text-bone">
            Contact
          </h2>
          <p>
            Data protection contact:{" "}
            <a className="text-gold-bright underline-offset-4 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            . Support for using the app is on the{" "}
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/support/safezone-rail">
              SafeZone Rail support page
            </Link>
            . The company contact form is at{" "}
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/contact">
              Contact
            </Link>
            .
          </p>
          <p>Last reviewed for this website: 22 October 2026. Operational schedule effective 19 August 2026.</p>
        </section>
      </div>
    </article>
  );
}
