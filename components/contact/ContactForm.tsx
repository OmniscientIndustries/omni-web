"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { Arrow, buttonClasses } from "@/components/ui/GoldButton";
import { contactCategories, isContactCategory, type ContactCategoryId } from "@/content/contact";
import { limits, validateContact, type ContactErrors, type ContactField } from "@/lib/contact/validation";

const ORDER: ContactField[] = ["name", "organisation", "email", "interest", "message", "consent"];

type Values = {
  name: string;
  organisation: string;
  email: string;
  interest: string;
  message: string;
  consent: boolean;
};

const inputClass =
  "mt-2 block w-full rounded-[10px] border bg-ink-950 px-4 py-3 text-[1rem] text-bone placeholder:text-stone-dim transition-colors duration-[var(--duration-fast)] focus:border-gold/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright aria-[invalid=true]:border-risk/80";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.875rem] text-risk">
      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-risk" />
      <span>
        <span className="sr-only">Error: </span>
        {message}
      </span>
    </p>
  );
}

export function ContactForm({ initialInterest }: { initialInterest?: ContactCategoryId }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<ContactErrors | null>(null);
  const [values, setValues] = useState<Values>({
    name: "",
    organisation: "",
    email: "",
    interest: initialInterest && isContactCategory(initialInterest) ? initialInterest : "",
    message: "",
    consent: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const handled = useRef<ContactState | null>(null);

  const errors = clientErrors ?? state.errors ?? {};
  const errorCount = Object.keys(errors).length;

  // Move focus to the outcome once the server responds.
  useEffect(() => {
    if (state.status === "idle" || handled.current === state) return;
    handled.current = state;
    if (state.status === "invalid" && state.errors) {
      const first = ORDER.find((f) => state.errors?.[f]);
      if (first) focusField(first);
      return;
    }
    statusRef.current?.focus();
  }, [state]);

  function focusField(field: ContactField) {
    const el = formRef.current?.querySelector<HTMLElement>(field === "interest" ? 'input[name="interest"]' : `[name="${field}"]`);
    el?.focus();
  }

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (clientErrors?.[key as ContactField]) {
      setClientErrors((e) => {
        if (!e) return e;
        const next = { ...e };
        delete next[key as ContactField];
        return Object.keys(next).length ? next : null;
      });
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateContact(values);
    if (!result.ok) {
      event.preventDefault();
      setClientErrors(result.errors);
      const first = ORDER.find((f) => result.errors[f]);
      if (first) requestAnimationFrame(() => focusField(first));
      return;
    }
    setClientErrors(null);
  }

  const succeeded = state.status === "success" && !clientErrors;

  if (succeeded) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[20px] border border-gold/50 bg-gold/[0.06] p-8 sm:p-10">
        <p className="eyebrow">Enquiry sent</p>
        <p className="text-heading mt-4 text-[1.75rem] text-bone">Thank you.</p>
        <p className="mt-3 leading-relaxed text-stone">{state.message}</p>
      </div>
    );
  }

  const describe = (field: ContactField, extra?: string) =>
    [errors[field] ? `${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="rounded-[20px] border border-line bg-ink-900 p-6 sm:p-9">
      {errorCount > 0 ? (
        <div role="alert" className="mb-8 rounded-xl border border-risk/50 bg-risk/[0.06] p-5">
          <p className="font-medium text-bone">
            {errorCount === 1 ? "There is 1 problem with your enquiry." : `There are ${errorCount} problems with your enquiry.`}
          </p>
          <ul className="mt-3 space-y-1.5">
            {ORDER.filter((f) => errors[f]).map((f) => (
              <li key={f}>
                <button type="button" onClick={() => focusField(f)} className="text-left text-[0.9375rem] text-risk underline underline-offset-4">
                  {errors[f]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === "error" || state.status === "development" ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={state.status === "error" ? "alert" : "status"}
          className={`mb-8 rounded-xl border p-5 text-[0.9375rem] leading-relaxed ${state.status === "error" ? "border-risk/50 bg-risk/[0.06] text-bone" : "border-line-strong bg-gold/[0.05] text-bone"}`}
        >
          <p className="font-medium">{state.status === "error" ? "Your enquiry was not sent." : "Not delivered — development mode"}</p>
          <p className="mt-1 text-stone">{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-[0.9375rem] font-medium text-bone">Name</label>
          <input id="name" name="name" autoComplete="name" required maxLength={limits.name} value={values.name} onChange={(e) => update("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describe("name")} className={`${inputClass} border-line`} />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="organisation" className="text-[0.9375rem] font-medium text-bone">Organisation</label>
          <input id="organisation" name="organisation" autoComplete="organization" required maxLength={limits.organisation} value={values.organisation} onChange={(e) => update("organisation", e.target.value)} aria-invalid={!!errors.organisation} aria-describedby={describe("organisation")} className={`${inputClass} border-line`} />
          <FieldError id="organisation-error" message={errors.organisation} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="text-[0.9375rem] font-medium text-bone">Work email</label>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={limits.email} value={values.email} onChange={(e) => update("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describe("email")} className={`${inputClass} border-line`} />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <fieldset className="mt-8" aria-invalid={!!errors.interest} aria-describedby={describe("interest")}>
        <legend className="text-[0.9375rem] font-medium text-bone">Area of interest</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {contactCategories.map((c) => {
            const checked = values.interest === c.id;
            return (
              <label
                key={c.id}
                className={`relative flex cursor-pointer gap-3 rounded-[12px] border p-4 transition-colors duration-[var(--duration-fast)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-bright ${checked ? "border-gold/70 bg-gold/[0.07]" : errors.interest ? "border-risk/60" : "border-line hover:border-line-strong"}`}
              >
                <input
                  type="radio"
                  name="interest"
                  value={c.id}
                  checked={checked}
                  onChange={() => update("interest", c.id)}
                  className="peer sr-only"
                />
                <span aria-hidden className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${checked ? "border-gold" : "border-stone-dim"}`}>
                  {checked ? <span className="size-2 rounded-full bg-gold" /> : null}
                </span>
                <span>
                  <span className="block text-[0.9375rem] text-bone">{c.label}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-stone">{c.description}</span>
                </span>
              </label>
            );
          })}
        </div>
        <FieldError id="interest-error" message={errors.interest} />
      </fieldset>

      <div className="mt-8">
        <label htmlFor="message" className="text-[0.9375rem] font-medium text-bone">Message</label>
        <textarea id="message" name="message" rows={6} required maxLength={limits.message} value={values.message} onChange={(e) => update("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={describe("message", "message-hint")} className={`${inputClass} resize-y border-line`} />
        <p id="message-hint" className="mt-2 text-[0.8125rem] text-stone-dim">
          At least {limits.messageMin} characters. Please do not include sensitive personal information.
        </p>
        <FieldError id="message-error" message={errors.message} />
      </div>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={describe("consent")}
            className="mt-1 size-5 shrink-0 cursor-pointer accent-[#b79768]"
          />
          <span className="text-[0.9375rem] leading-relaxed text-stone">
            I agree that Omniscient Industries may use these details to respond to my enquiry.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClasses.base} ${buttonClasses.variants.primary} disabled:cursor-wait disabled:opacity-70`}
        >
          <span className="relative">{pending ? "Sending…" : "Send enquiry"}</span>
          {pending ? null : <Arrow className="relative" />}
        </button>
        <p className="text-[0.8125rem] text-stone-dim" aria-live="polite">
          {pending ? "Sending your enquiry…" : ""}
        </p>
      </div>
    </form>
  );
}
