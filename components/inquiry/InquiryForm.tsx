"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitInquiry } from "@/app/actions/submit-inquiry";
import { INITIAL_INQUIRY_STATE } from "@/app/actions/inquiry-state";
import { INTERESTS } from "@/lib/content";
import type { InquiryKind } from "@/lib/validation/inquiry";

const KIND_OPTIONS: readonly { value: InquiryKind; label: string }[] = [
  { value: "retail", label: "Private client" },
  { value: "trade", label: "Trade / Jeweller" },
];

const inputClass =
  "w-full border-b border-ivory/20 bg-transparent py-3 text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-red-400";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-mist">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm({ defaultKind = "retail" }: { defaultKind?: InquiryKind }) {
  const [kind, setKind] = useState<InquiryKind>(defaultKind);
  const [state, formAction, isPending] = useActionState(submitInquiry, INITIAL_INQUIRY_STATE);
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  // Send keyboard and screen-reader users straight to the first field that needs attention.
  useEffect(() => {
    if (state.status === "error") {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    }
  }, [state]);

  // With JS, dispatch manually so React skips its automatic post-action form reset and the
  // visitor's input survives a validation error. Without JS, `action` still submits natively.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  };
  const a11y = (field: keyof typeof errors) =>
    errors[field] ? { "aria-invalid": true, "aria-describedby": `${field}-error` } : {};

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[420px] flex-col items-center justify-center text-center"
        role="status"
      >
        <span className="text-5xl text-gold">◆</span>
        <h3 className="mt-6 font-display text-4xl font-normal">Inquiry received</h3>
        <p className="mt-4 max-w-sm text-mist">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-8" noValidate>
      <fieldset>
        <legend className="sr-only">I am a</legend>
        <div className="relative grid grid-cols-2 rounded-full border border-gold/30 p-1">
          {KIND_OPTIONS.map((opt) => (
            <label key={opt.value} className="relative cursor-pointer py-3 text-center text-sm font-semibold">
              <input
                type="radio"
                name="kind"
                value={opt.value}
                checked={kind === opt.value}
                onChange={() => setKind(opt.value)}
                className="peer sr-only"
              />
              {kind === opt.value && (
                <motion.span
                  layoutId="kind-pill"
                  className="absolute inset-0 rounded-full [background:var(--gold-gradient)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative transition-colors ${kind === opt.value ? "text-night" : "text-ivory/70"}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name}>
          <input id="name" name="name" defaultValue={values.name} autoComplete="name" required className={inputClass} {...a11y("name")} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" name="email" defaultValue={values.email} type="email" autoComplete="email" required className={inputClass} {...a11y("email")} />
        </Field>
        <Field id="phone" label="Phone (optional)" error={errors.phone}>
          <input id="phone" name="phone" defaultValue={values.phone} type="tel" autoComplete="tel" className={inputClass} {...a11y("phone")} />
        </Field>
        <Field id="interest" label="Interested in" error={errors.interest}>
          <select id="interest" name="interest" defaultValue={values.interest ?? ""} required className={`${inputClass} [&>option]:bg-navy`} {...a11y("interest")}>
            <option value="" disabled>
              Select…
            </option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <AnimatePresence initial={false}>
        {kind === "trade" && (
          <motion.div
            key="company"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Field id="company" label="Company" error={errors.company}>
              <input id="company" name="company" defaultValue={values.company} autoComplete="organization" className={inputClass} {...a11y("company")} />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <Field id="message" label="How can we help?" error={errors.message}>
        <textarea id="message" name="message" defaultValue={values.message} rows={4} required className={`${inputClass} resize-none`} {...a11y("message")} />
      </Field>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="border-l-2 border-red-400 pl-4 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-gold w-full rounded-full px-8 py-4 text-sm font-semibold tracking-wide disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {isPending ? "Sending…" : kind === "trade" ? "Request trade access" : "Request a consultation"}
      </button>
    </form>
  );
}
