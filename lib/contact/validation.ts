import { isContactCategory, type ContactCategoryId } from "@/content/contact";

export type ContactField = "name" | "organisation" | "email" | "interest" | "message" | "consent";

export type ContactInput = {
  name: string;
  organisation: string;
  email: string;
  interest: ContactCategoryId;
  message: string;
  consent: boolean;
};

export type ContactErrors = Partial<Record<ContactField, string>>;

export const limits = { name: 120, organisation: 160, email: 254, message: 4000, messageMin: 20 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function readContactForm(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  return {
    name: text("name"),
    organisation: text("organisation"),
    email: text("email"),
    interest: text("interest"),
    message: text("message"),
    consent: form.get("consent") === "on",
  };
}

/** Shared by the client (instant feedback) and the server (authoritative). */
export function validateContact(raw: ReturnType<typeof readContactForm>):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors } {
  const errors: ContactErrors = {};
  if (!raw.name) errors.name = "Enter your name.";
  else if (raw.name.length > limits.name) errors.name = `Name must be ${limits.name} characters or fewer.`;

  if (!raw.organisation) errors.organisation = "Enter your organisation.";
  else if (raw.organisation.length > limits.organisation) errors.organisation = "Organisation name is too long.";

  if (!raw.email) errors.email = "Enter your work email address.";
  else if (raw.email.length > limits.email || !EMAIL.test(raw.email))
    errors.email = "Enter an email address in the format name@organisation.com.";

  if (!isContactCategory(raw.interest)) errors.interest = "Choose an area of interest.";

  if (!raw.message) errors.message = "Tell us a little about your enquiry.";
  else if (raw.message.length < limits.messageMin)
    errors.message = `Your message must be at least ${limits.messageMin} characters.`;
  else if (raw.message.length > limits.message) errors.message = `Your message must be ${limits.message} characters or fewer.`;

  if (!raw.consent) errors.consent = "Confirm that we may use these details to respond to you.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { ...raw, interest: raw.interest as ContactCategoryId } };
}
