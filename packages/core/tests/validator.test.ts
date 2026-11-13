import { describe, it, expect } from "vitest";
import { parseString } from "../src/parser.js";
import { validateAdl, validateManifest } from "../src/validator.js";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("validator", () => {
  it("validates example axiom.yaml", () => {
    const yaml = readFileSync(path.resolve(process.cwd(), "../../packages/adl/examples/axiom.yaml"), "utf8");
    const doc = parseString(yaml, "yaml");
    const res = validateAdl(doc);
    console.log(JSON.stringify(res));
    expect(res.valid).toBe(true);
  });
  it("rejects invalid doc", () => {
    const doc = parseString("axiom:\n  version: 123\n", "yaml");
    const res = validateAdl(doc);
    expect(res.valid).toBe(false);
  });
  it("validates skill manifest", () => {
    const manifest = { skill: { name: "x", version: "1.0.0" } };
    const res = validateManifest(manifest, "skill");
    expect(res.valid).toBe(true);
  });
});