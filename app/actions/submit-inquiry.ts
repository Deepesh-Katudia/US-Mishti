"use server";

import { headers } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { parseInquiry, type FieldErrors } from "@/lib/validation/inquiry";
import type { InquiryState } from "./inquiry-state";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const GENERIC_ERROR = "Something went wrong while sending your inquiry. Please try again or email us directly.";

const ECHO_FIELDS = ["name", "email", "phone", "company", "interest", "message"] as const;

const echoValues = (formData: FormData): Record<string, string> =>
  Object.fromEntries(ECHO_FIELDS.map((f) => [f, String(formData.get(f) ?? "").slice(0, 2000)]));

const fail = (message: string, formData: FormData, fieldErrors?: FieldErrors): InquiryState => ({
  status: "error",
  message,
  fieldErrors,
  values: echoValues(formData),
});

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  if (!limiter.check(await clientIp())) {
    return fail("You've sent several inquiries recently. Please wait a few minutes and try again.", formData);
  }

  const parsed = parseInquiry(Object.fromEntries(formData));
  if (!parsed.success) {
    // Pretend honeypot submissions succeeded so bots get no signal.
    if (parsed.isSpam) return { status: "success", message: "Thank you — we'll be in touch shortly." };
    return fail("Please review the highlighted fields.", formData, parsed.fieldErrors);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[submitInquiry] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured");
    return fail("Online inquiries are temporarily unavailable. Please email or call us instead.", formData);
  }

  const { error } = await supabase.from("inquiries").insert(parsed.data);
  if (error) {
    console.error("[submitInquiry] insert failed", error);
    return fail(GENERIC_ERROR, formData);
  }

  return {
    status: "success",
    message:
      parsed.data.kind === "trade"
        ? "Thank you — a trade specialist will contact you within one business day."
        : "Thank you — a diamond consultant will be in touch shortly.",
  };
}
