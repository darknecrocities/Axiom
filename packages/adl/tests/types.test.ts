import { describe, it, expect } from "vitest";
import { ADL_VERSION } from "../src/index.js";

describe("adl", () => {
  it("exports version", () => {
    expect(ADL_VERSION).toBe("0.1");
  });
});