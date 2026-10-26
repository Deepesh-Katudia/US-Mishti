import { describe, expect, it } from "vitest";
import { scriptedReply } from "./scripted";

describe("scriptedReply", () => {
  it("lists all three collections when asked what products are offered", () => {
    const { topic, reply } = scriptedReply("What products do you have?");
    expect(topic).toBe("products");
    expect(reply).toContain("Natural Diamonds");
    expect(reply).toContain("Lab-Grown Diamonds");
    expect(reply).toContain("Rare Gemstones");
  });

  it("treats 'natural or lab-grown' as one comparison question", () => {
    expect(scriptedReply("Natural or lab-grown — which suits me?").topic).toBe("compare");
  });

  it("answers about a single collection", () => {
    expect(scriptedReply("Tell me about lab grown diamonds").topic).toBe("labGrown");
    expect(scriptedReply("Do you have sapphires?").topic).toBe("gemstones");
  });

  it("gives shape details when a shape is named", () => {
    const { topic, reply } = scriptedReply("What is an asscher cut like?");
    expect(topic).toBe("shape:asscher");
    expect(reply).toContain("Facets: 58");
  });

  it("reads 'emerald' as a shape unless the question is about gemstones", () => {
    expect(scriptedReply("Is the emerald cut good?").topic).toBe("shape:emerald");
    expect(scriptedReply("Do you sell green emerald gemstones?").topic).toBe("gemstones");
  });

  it("prefers the size question over the generic shapes list", () => {
    expect(scriptedReply("Which shape looks largest per carat?").topic).toBe("largest");
  });

  it("never quotes prices and points to the contact page", () => {
    const { topic, reply } = scriptedReply("How much does a 1 carat oval cost?");
    expect(topic).toBe("pricing");
    expect(reply).toContain("/contact");
    expect(reply).not.toMatch(/\$\d/);
  });

  it("routes trade, certification, shipping and contact questions", () => {
    expect(scriptedReply("How do I open a trade account?").topic).toBe("trade");
    expect(scriptedReply("What does a GIA report tell me?").topic).toBe("certification");
    expect(scriptedReply("How does shipping work?").topic).toBe("shipping");
    expect(scriptedReply("What is your phone number?").topic).toBe("contact");
  });

  it("falls back to a menu of topics for anything off-topic", () => {
    const { topic, reply } = scriptedReply("Write me a Python script");
    expect(topic).toBe("fallback");
    expect(reply).toContain("/contact");
  });
});
