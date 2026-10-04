"use server";

import { headers } from "next/headers";
import { deliverContact } from "@/lib/contact/delivery";
import { contactRateLimiter } from "@/lib/contact/rate-limit";
import { readContactForm, validateContact, type ContactErrors } from "@/lib/contact/validation";

export type ContactState = {
  status: "idle" | "invalid" | "success" | "development" | "error";
  message?: string;
  errors?: ContactErrors;
};

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: real people never see or fill this field. Respond neutrally.
  if (String(form.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thank you. Your enquiry has been received." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!(await contactRateLimiter.allow(ip))) {
    return { status: "error", message: "Too many enquiries from this connection. Please wait a few minutes and try again." };
  }

  const result = validateContact(readContactForm(form));
  if (!result.ok) {
    return { status: "invalid", errors: result.errors, message: "Please correct the highlighted fields." };
  }

  const delivery = await deliverContact(result.data);
  switch (delivery.status) {
    case "sent":
      return { status: "success", message: "Thank you. Your enquiry has been sent and the team will respond by email." };
    case "development":
      return {
        status: "development",
        message: "Development mode: your enquiry passed validation and was logged on the server, but it was not delivered because email is not configured.",
      };
    case "unconfigured":
      return {
        status: "error",
        message: "Our enquiry form is not yet connected, so your message could not be sent. Please try again later.",
      };
    default:
      return { status: "error", message: "Something went wrong sending your enquiry. Please try again." };
  }
}
