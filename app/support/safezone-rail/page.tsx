import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SafeZone Rail Support",
  description:
    "Support for SafeZone Rail for iOS: signing in, location permission, boundary warnings, shifts, offline synchronisation and how to contact Omniscient Industries Limited.",
  path: "/support/safezone-rail",
});

const supportEmail = "info@omniscient-industries.com";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-12 sm:py-14">
      <h2 id={id} className="text-display text-[clamp(1.6rem,3vw,2.15rem)] text-bone">
        {title}
      </h2>
      <div className="mt-6 max-w-3xl space-y-4 text-[1.02rem] leading-relaxed text-stone">{children}</div>
    </section>
  );
}

export default function SafeZoneSupportPage() {
  return (
    <article className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <header className="container-site pb-12">
        <p className="eyebrow mb-5">Support</p>
        <h1 className="text-display text-[clamp(2.2rem,6vw,3.6rem)] text-bone">SafeZone Rail Support</h1>
        <dl className="mt-8 grid max-w-3xl gap-4 text-[0.98rem] sm:grid-cols-2">
          <div>
            <dt className="system-label text-gold">Publisher</dt>
            <dd className="mt-2 text-bone">Omniscient Industries Limited</dd>
          </div>
          <div>
            <dt className="system-label text-gold">Product</dt>
            <dd className="mt-2 text-bone">SafeZone Rail for iOS</dd>
          </div>
        </dl>
        <p className="mt-8 max-w-3xl text-[1.05rem] leading-relaxed text-stone">
          This page is for authorised workers using the SafeZone Rail iPhone app, and for the people
          who administer their accounts. You do not need an account to read it.
        </p>
      </header>

      <div className="container-site">
        <Section id="getting-started" title="Getting started">
          <p>
            An account is issued by your organisation. SafeZone Rail does not offer public sign-up. If
            you do not have an account, ask the person who manages SafeZone Rail for your employer.
          </p>
          <p>
            Open the app and sign in with the email address and password you were given. After a
            successful sign-in, the app can offer Face ID or Touch ID to unlock that saved session on
            the same phone. The biometric check stays on the device. Omniscient does not receive your
            fingerprint or face data.
          </p>
          <p>
            Before a shift, allow the permissions the app requests. Location is required to show your
            position against the zone. Notifications are required if you want boundary warnings as
            alerts. The camera permission is used only to turn the flashlight on during a red warning.
            The app does not take photographs.
          </p>
          <p>
            When you are ready to work, start a shift in the app. Monitoring begins then. End the shift
            in the app when the work is finished.
          </p>
        </Section>

        <Section id="location" title="Location permissions">
          <p>
            Location is used to place you on the map and to check whether you are inside the work zone
            assigned to you. The app asks for location while it is in use for that map and zone check.
          </p>
          <p>
            Background location is used only during an active shift, so the zone check can continue if
            the phone is locked or the app is not on screen. When the shift ends, or you sign out,
            monitoring stops. The app does not keep a GPS history file on the phone.
          </p>
          <p>
            To review this later, open iOS Settings, then Privacy &amp; Security, then Location
            Services, then SafeZone Rail. You can also open Settings, scroll to SafeZone Rail, and
            review Location and Notifications there.
          </p>
          <p>
            GPS accuracy varies. Buildings, cuttings, overhead structures, a weak sky view and a phone
            with a poor location fix can move the reported position. A warning is only as good as that
            fix. Treat the app as an aid, and follow the protection arrangements for the site.
          </p>
        </Section>

        <Section id="notifications" title="Notifications and boundary warnings">
          <p>
            A boundary warning is raised on your phone when the app confirms you are outside the
            assigned zone during an active shift. The warning is a local notification with the Active
            interruption level, plus an on-device alarm for a confirmed breach.
          </p>
          <p>
            Check notification permission in iOS Settings under SafeZone Rail, then Notifications. Allow
            notifications, sounds and banners if you want those alerts. The app requests alert and sound
            permission. It does not request Time Sensitive notifications.
          </p>
          <p>
            Silent Mode, Focus and Do Not Disturb can hide or silence a notification banner. The
            on-device alarm for a confirmed breach is intended to continue while the phone is locked or
            the app is in the background, but it follows the device volume. If the volume is at zero,
            the alarm will not be heard.
          </p>
          <p>
            Apple Critical Alerts is not enabled in the current release. SafeZone Rail cannot guarantee
            that a warning will break through Silent Mode or Focus.
          </p>
        </Section>

        <Section id="shifts" title="Shift and synchronisation support">
          <p>
            Start a shift when you are ready to be monitored against the assigned zone. End the shift
            when that work is finished. Ending the shift stops monitoring on the phone before the app
            waits on the network.
          </p>
          <p>
            The app needs a network connection to sign in and to upload events. A poor signal does not
            by itself end a shift that has already started on the phone.
          </p>
          <p>
            If the network drops, shift and zone events stay in an on-device queue and are sent when
            the connection returns. The queue retries. An event that has not uploaded yet is delayed,
            not discarded because the screen was locked.
          </p>
          <p>
            If an upload looks delayed, keep the phone online and the app signed in, then leave it for
            a short time. If events are still missing after the connection is stable, contact support
            and include the time the shift was started. Do not send a location history.
          </p>
        </Section>

        <Section id="troubleshooting" title="Troubleshooting">
          <h3 className="text-bone">Cannot sign in</h3>
          <p>
            Check the email address and password exactly as they were issued. The app reports incorrect
            email or password when the credentials do not match. Reset is handled by your administrator
            or by support. There is no public registration screen to create your own account.
          </p>
          <h3 className="pt-2 text-bone">Location not updating</h3>
          <p>
            Confirm Location Services are on, that SafeZone Rail is allowed to use location, and that a
            shift is active. Precise Location should be on. Move to a clearer sky view if the fix is
            poor, then check again.
          </p>
          <h3 className="pt-2 text-bone">Zone not displayed</h3>
          <p>
            A zone appears when one has been assigned to your account for the shift. If the map has no
            zone, you may not be assigned to one. Contact your administrator. Do not assume an empty
            map means the site has no boundary.
          </p>
          <h3 className="pt-2 text-bone">Notification not received</h3>
          <p>
            Check that notifications are allowed for SafeZone Rail, that a shift is active, and that
            Focus or Silent Mode is not hiding banners. Critical Alerts are not enabled. Also check the
            volume if you expected the alarm to be heard.
          </p>
          <h3 className="pt-2 text-bone">Offline events not syncing</h3>
          <p>
            Connect to a network and leave the app signed in. Queued events upload in the background of
            the app session. If they remain queued, note the shift start time and contact support.
          </p>
          <h3 className="pt-2 text-bone">App appears unresponsive</h3>
          <p>
            Force-quit SafeZone Rail and open it again. If you were on a shift, confirm the shift state
            after reopening and end it in the app if the work is finished. If the phone still cannot
            open the app, restart the phone and try once more before contacting support.
          </p>
        </Section>

        <Section id="contact" title="Contact support">
          <p>
            Email{" "}
            <a className="text-gold-bright underline-offset-4 hover:underline" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
            . This is the support address built into the SafeZone Rail app. You can also use the{" "}
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/contact">
              company contact form
            </Link>
            .
          </p>
          <p>In the message, include:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>the email address on the SafeZone Rail account, if you have one</li>
            <li>iPhone model and iOS version</li>
            <li>the app version shown in the app</li>
            <li>what you were doing, and the time it happened</li>
            <li>whether a shift was active and whether the phone was online</li>
          </ul>
          <p>
            Do not send your password. Do not send an exported location history or a track of where you
            have been. A short description and the time of the shift are enough.
          </p>
        </Section>

        <Section id="privacy" title="Privacy">
          <p>
            How the app handles account, shift and location data is described in the{" "}
            <Link className="text-gold-bright underline-offset-4 hover:underline" href="/privacy/safezone-rail">
              SafeZone Rail privacy policy
            </Link>
            .
          </p>
        </Section>

        <Section id="safety" title="Safety disclaimer">
          <p>SafeZone Rail supplements existing railway operational procedures.</p>
          <p>
            It does not replace a safe system of work, or the authorised railway protection
            arrangements for the site.
          </p>
          <p>
            Users must follow their employer&apos;s procedures and the instructions of the responsible
            personnel.
          </p>
        </Section>
      </div>
    </article>
  );
}
