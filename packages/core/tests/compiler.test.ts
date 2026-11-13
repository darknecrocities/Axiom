import { describe, it, expect } from "vitest";
import { parseString } from "../src/parser.js";
import { compile } from "../src/compiler.js";

describe("compiler", () => {
  it("compiles to claude files", () => {
    const doc = parseString("project:\n  name: t\nagent:\n  name: a\n", "yaml");
    const r = compile(doc as any, "claude");
    expect(r.files.some((f) => f.path === "CLAUDE.md")).toBe(true);
  });
  it("compiles all targets", () => {
    const doc = parseString("project:\n  name: t\n", "yaml");
    for (const t of ["generic","antigravity","codex","cursor"] as const) {
      const r = compile(doc as any, t);
      expect(r.files.length).toBeGreaterThan(0);
    }
  });
});