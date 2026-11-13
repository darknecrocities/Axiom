import type { AdlDocument } from "@axiom/adl";
import { compile, type CompileTarget } from "@axiom/core";

export interface AdapterCapability {
  feature: string;
  supported: boolean;
  notes?: string;
}

export interface Adapter {
  name: string;
  target: CompileTarget;
  capabilityMatrix: AdapterCapability[];
  compile(doc: AdlDocument): ReturnType<typeof compile>;
}

const matrices: Record<CompileTarget, AdapterCapability[]> = {
  generic: [{ feature: "effective-config", supported: true }],
  claude: [
    { feature: "CLAUDE.md generation", supported: true },
    { feature: "MCP servers", supported: true, notes: "declared via tools.mcp; wire manually" },
    { feature: "workflows", supported: true, notes: "as instructions" },
  ],
  antigravity: [{ feature: "AGENTS.md generation", supported: true }],
  codex: [{ feature: "AGENTS.md generation", supported: true }],
  cursor: [{ feature: "cursor rules", supported: true }],
};

function makeAdapter(name: string, target: CompileTarget): Adapter {
  return {
    name,
    target,
    capabilityMatrix: matrices[target],
    compile: (doc) => compile(doc, target),
  };
}

export const claudeAdapter = makeAdapter("claude", "claude");
export const antigravityAdapter = makeAdapter("antigravity", "antigravity");
export const codexAdapter = makeAdapter("codex", "codex");
export const cursorAdapter = makeAdapter("cursor", "cursor");
export const genericAdapter = makeAdapter("generic", "generic");

export const adapters: Record<CompileTarget, Adapter> = {
  claude: claudeAdapter,
  antigravity: antigravityAdapter,
  codex: codexAdapter,
  cursor: cursorAdapter,
  generic: genericAdapter,
};