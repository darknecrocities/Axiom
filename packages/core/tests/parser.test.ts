import { describe, it, expect } from "vitest";
import { parseString } from "../src/parser.js";

describe("parser", () => {
  it("parses yaml", () => {
    const doc = parseString("project:\n  name: x\n", "yaml");
    expect((doc as any).project.name).toBe("x");
  });
  it("parses json", () => {
    const doc = parseString('{"project":{"name":"y"}}', "json");
    expect((doc as any).project.name).toBe("y");
  });
  it("auto-detects json", () => {
    const doc = parseString('{"a":1}');
    expect((doc as any).a).toBe(1);
  });
});