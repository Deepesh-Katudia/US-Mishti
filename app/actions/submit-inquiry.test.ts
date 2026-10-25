import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const getSupabaseAdmin = vi.fn();

vi.mock("@/lib/supabase/server", () => ({ getSupabaseAdmin: () => getSupabaseAdmin() }));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` }),
}));

const { submitInquiry } = await import("./submit-inquiry");
const { INITIAL_INQUIRY_STATE } = await import("./inquiry-state");

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const fields = {
    kind: "retail",
    name: "Grace Hopper",
    email: "grace@example.com",
    phone: "",
    company: "",
    interest: "Bespoke / engagement",
    message: "Seeking a 2ct oval for an engagement ring.",
    website: "",
    ...overrides,
  };
  Object.entries(fields).forEach(([k, v]) => data.set(k, v));
  return data;
}

describe("submitInquiry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    insert.mockResolvedValue({ error: null });
    getSupabaseAdmin.mockReturnValue({ from: () => ({ insert }) });
  });

  it("stores a valid inquiry and reports success", async () => {
    const state = await submitInquiry(INITIAL_INQUIRY_STATE, form());
    expect(state.status).toBe("success");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "retail", email: "grace@example.com", company: null }),
    );
  });

  it("returns field errors without touching the database", async () => {
    const state = await submitInquiry(INITIAL_INQUIRY_STATE, form({ email: "nope" }));
    expect(state.status).toBe("error");
    expect(state.fieldErrors?.email).toBeDefined();
    expect(insert).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without saving them", async () => {
    const state = await submitInquiry(INITIAL_INQUIRY_STATE, form({ website: "spam" }));
    expect(state.status).toBe("success");
    expect(insert).not.toHaveBeenCalled();
  });

  it("returns a friendly error when Supabase is not configured", async () => {
    getSupabaseAdmin.mockReturnValue(null);
    const state = await submitInquiry(INITIAL_INQUIRY_STATE, form());
    expect(state.status).toBe("error");
    expect(state.message).toMatch(/unavailable/i);
  });

  it("returns a friendly error when the insert fails", async () => {
    insert.mockResolvedValue({ error: { message: "db down" } });
    const state = await submitInquiry(INITIAL_INQUIRY_STATE, form());
    expect(state.status).toBe("error");
    expect(state.message).not.toContain("db down");
  });
});
