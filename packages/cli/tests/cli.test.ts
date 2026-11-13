import { describe, it, expect } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const CLI = path.resolve(process.cwd(), "dist/index.js");

describe("cli", () => {
  it("init + validate", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "axiom-"));
    try {
      await exec("node", [CLI, "init", "demo"], { cwd: dir });
      const { stdout } = await exec("node", [CLI, "validate"], { cwd: dir });
      expect(stdout).toContain("Valid: true");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 30000);
});