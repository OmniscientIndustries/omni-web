import "server-only";
import { contactCategories } from "@/content/contact";
import type { ContactInput } from "./validation";

export type DeliveryResult =
  | { status: "sent" }
  | { status: "development" }
  | { status: "unconfigured" }
  | { status: "failed" };

/**
 * Email delivery adapter.
 *
 * Configure with environment variables (never commit them):
 *   RESEND_API_KEY      — API key for https://resend.com (or replace sendWithResend with your provider)
 *   CONTACT_TO_EMAIL    — inbox that receives enquiries
 *   CONTACT_FROM_EMAIL  — verified sender, e.g. "Omniscient <website@your-domain>"
 *
 * Without configuration:
 *   - development: the enquiry is logged to the server console and the UI says it was NOT delivered;
 *   - production: the UI reports that the form is not yet connected. Success is never faked.
 */
export async function deliverContact(input: ContactInput): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Delivery not configured — development enquiry:", {
        ...input,
        message: `${input.message.slice(0, 200)}${input.message.length > 200 ? "…" : ""}`,
      });
      return { status: "development" };
    }
    return { status: "unconfigured" };
  }

  return sendWithResend({ apiKey, to, from, input });
}

async function sendWithResend({
  apiKey,
  to,
  from,
  input,
}: {
  apiKey: string;
  to: string;
  from: string;
  input: ContactInput;
}): Promise<DeliveryResult> {
  const interest = contactCategories.find((c) => c.id === input.interest)?.label ?? input.interest;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `Website enquiry · ${interest} · ${input.organisation}`,
        text: [
          `Name: ${input.name}`,
          `Organisation: ${input.organisation}`,
          `Email: ${input.email}`,
          `Area of interest: ${interest}`,
          `Consent to respond: yes`,
          "",
          input.message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return response.ok ? { status: "sent" } : { status: "failed" };
  } catch {
    return { status: "failed" };
  }
}
