import { describe, expect, it } from "vitest";
import { parseInquiry } from "./inquiry";

const valid = {
  kind: "trade",
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+1 212 555 0100",
  company: "Lovelace Jewellers",
  interest: "Natural diamonds",
  message: "Looking for a parcel of 1ct rounds, G-H VS.",
  website: "",
};

describe("parseInquiry", () => {
  it("accepts a complete trade inquiry and trims fields", () => {
    const result = parseInquiry({ ...valid, name: "  Ada Lovelace  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Ada Lovelace");
  });

  it("accepts a retail inquiry without phone or company", () => {
    const result = parseInquiry({ ...valid, kind: "retail", phone: "", company: "" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeNull();
      expect(result.data.company).toBeNull();
    }
  });

  it("requires a company name for trade inquiries", () => {
    const result = parseInquiry({ ...valid, company: "" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.company).toBeDefined();
  });

  it("rejects an invalid email address", () => {
    const result = parseInquiry({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.email).toBeDefined();
  });

  it("rejects an unknown inquiry kind", () => {
    const result = parseInquiry({ ...valid, kind: "admin" });
    expect(result.success).toBe(false);
  });

  it("rejects an interest outside the allowed list", () => {
    const result = parseInquiry({ ...valid, interest: "<script>" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.interest).toBeDefined();
  });

  it("rejects messages that are too short or too long", () => {
    expect(parseInquiry({ ...valid, message: "hi" }).success).toBe(false);
    expect(parseInquiry({ ...valid, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("flags a filled honeypot field as spam", () => {
    const result = parseInquiry({ ...valid, website: "http://spam.example" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.isSpam).toBe(true);
  });
});
