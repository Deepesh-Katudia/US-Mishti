import { z } from "zod";
import { INTERESTS } from "@/lib/content";

export const INQUIRY_KINDS = ["trade", "retail"] as const;
export type InquiryKind = (typeof INQUIRY_KINDS)[number];

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const inquirySchema = z
  .object({
    kind: z.enum(INQUIRY_KINDS),
    name: z.string().trim().min(2, "Please enter your full name.").max(120),
    email: z.email("Please enter a valid email address.").max(200),
    phone: optionalText(40),
    company: optionalText(160),
    interest: z.enum(INTERESTS, "Please choose an area of interest."),
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more (at least 10 characters).")
      .max(2000, "Please keep your message under 2,000 characters."),
  })
  .refine((d) => d.kind !== "trade" || d.company !== null, {
    path: ["company"],
    message: "Company name is required for trade accounts.",
  });

export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryField = keyof Inquiry;
export type FieldErrors = Partial<Record<InquiryField, string>>;

export type ParseResult =
  | { success: true; data: Inquiry }
  | { success: false; fieldErrors: FieldErrors; isSpam: boolean };

const asString = (v: unknown): string => (typeof v === "string" ? v : "");

/** Validates raw form input. A filled `website` honeypot marks the submission as spam. */
export function parseInquiry(raw: Record<string, unknown>): ParseResult {
  if (asString(raw.website).trim() !== "") {
    return { success: false, fieldErrors: {}, isSpam: true };
  }

  const result = inquirySchema.safeParse({
    kind: asString(raw.kind),
    name: asString(raw.name),
    email: asString(raw.email).trim(),
    phone: asString(raw.phone),
    company: asString(raw.company),
    interest: asString(raw.interest),
    message: asString(raw.message),
  });

  if (result.success) return { success: true, data: result.data };

  const fieldErrors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as InquiryField;
    fieldErrors[field] ??= issue.message;
  }
  return { success: false, fieldErrors, isSpam: false };
}
