import type { FieldErrors } from "@/lib/validation/inquiry";

export interface InquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  /** Submitted values echoed back so the form can repopulate after an error. */
  values?: Record<string, string>;
}

export const INITIAL_INQUIRY_STATE: InquiryState = { status: "idle" };
