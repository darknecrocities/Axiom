import { describe, it, expect } from "vitest";
import { claudeAdapter, adapters } from "../src/index.js";

describe("adapters", () => {
  it("claude adapter compiles", () => {
    const doc: any = { project: { name: "t" } };
    const r = claudeAdapter.compile(doc);
    expect(r.files.length).toBeGreaterThan(0);
  });
  it("all targets present", () => {
    expect(Object.keys(adapters)).toContain("claude");
    expect(Object.keys(adapters)).toContain("generic");
  });
});