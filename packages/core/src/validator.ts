import { createRequire } from "node:module";
import * as addFormatsModule from "ajv-formats";

const require = createRequire(import.meta.url);
const AjvModule: any = require("ajv/dist/2020");
const Ajv = (AjvModule.default ?? AjvModule) as any;
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { AdlDocument } from "@axiom/adl";

export interface ValidationIssue {
  path: string;
  message: string;
  keyword?: string;
  params?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: string[];
}

const addFormats = (addFormatsModule as unknown as { default: (...args: any[]) => any }).default;
type ErrorObject = any;

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadSchema(name: string): Record<string, unknown> {
  const candidates = [
    join(__dirname, "..", "..", "adl", "schemas", name),
    join(__dirname, "..", "..", "..", "adl", "schemas", name),
    join(process.cwd(), "packages", "adl", "schemas", name),
    join(process.cwd(), "node_modules", "@axiom", "adl", "schemas", name),
  ];
  for (const c of candidates) {
    try {
      return JSON.parse(readFileSync(c, "utf8")) as Record<string, unknown>;
    } catch {
      // try next
    }
  }
  throw new Error(`Could not load schema ${name}`);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemaCache = new Map<string, ReturnType<typeof ajv.compile>>();

function getValidator(schemaName: string) {
  if (!schemaCache.has(schemaName)) {
    const schema = loadSchema(schemaName);
    schemaCache.set(schemaName, ajv.compile(schema));
  }
  return schemaCache.get(schemaName)!;
}

function toIssues(errors: any[] | null | undefined): ValidationIssue[] {
  if (!errors) return [];
  return errors.map((e) => ({
    path: e.instancePath || "/",
    message: e.message || "invalid",
    keyword: e.keyword,
    params: e.params as Record<string, unknown>,
  }));
}

export function validateAdl(doc: AdlDocument): ValidationResult {
  const validate = getValidator("adl.schema.json");
  const valid = validate(doc) as boolean;
  const errors = toIssues(validate.errors);
  const warnings: string[] = [];

  if (doc.axiom && doc.axiom.version && !/^0\.1/.test(doc.axiom.version)) {
    warnings.push(`ADL version ${doc.axiom.version} may not be supported by this core (expects 0.1.x)`);
  }
  if (doc.skills?.loading?.strategy && doc.skills?.loading?.mode) {
    if (doc.skills.loading.strategy !== doc.skills.loading.mode) {
      warnings.push("skills.loading.strategy and skills.loading.mode differ; preferring strategy");
    }
  }
  const wfDefs = doc.workflows?.definitions ?? [];
  for (const wf of wfDefs) {
    const ids = new Set(wf.stages.map((s: any) => s.id));
    for (const st of wf.stages) {
      for (const dep of st.depends_on ?? []) {
        if (!ids.has(dep)) {
          errors.push({ path: `/workflows/definitions/${wf.name}/stages/${st.id}`, message: `depends_on references unknown stage '${dep}'` });
        }
      }
    }
  }
  for (const wf of wfDefs) {
    const adj = new Map(wf.stages.map((s: any) => [s.id, s.depends_on ?? []]));
    const visited = new Set<string>();
    const stack = new Set<string>();
    let cyclic = false;
    function dfs(n: string) {
      if (stack.has(n)) { cyclic = true; return; }
      if (visited.has(n)) return;
      visited.add(n);
      stack.add(n);
      for (const d of (adj.get(n) ?? [])) dfs(d);
      stack.delete(n);
    }
    for (const id of adj.keys()) dfs(id);
    if (cyclic) {
      errors.push({ path: `/workflows/definitions/${wf.name}`, message: "circular dependency detected in workflow stages" });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateManifest(doc: unknown, kind: "skill" | "preset" | "profile" | "workflow" | "package"): ValidationResult {
  const fileMap: Record<string, string> = {
    skill: "skill.schema.json",
    preset: "preset.schema.json",
    profile: "profile.schema.json",
    workflow: "workflow.schema.json",
    package: "package.schema.json",
  };
  const validate = getValidator(fileMap[kind]);
  const valid = validate(doc) as boolean;
  const errors = toIssues(validate.errors);
  return { valid: errors.length === 0, errors, warnings: [] };
}