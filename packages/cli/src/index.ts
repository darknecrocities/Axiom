#!/usr/bin/env node
import { Command } from "commander";
import { writeFile, mkdir, readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { parseFile, parseString } from "@axiom/core";
import { validateAdl, validateManifest } from "@axiom/core";
import { compile } from "@axiom/core";
import type { CompileTarget } from "@axiom/core";

const program = new Command();
program.name("axiom").description("Axiom agent-native development framework CLI").version("0.1.0");

const AXIOM_YAML = "axiom.yaml";

async function loadDoc(cwd = process.cwd()): Promise<{ doc: any; path: string }> {
  const p = path.join(cwd, AXIOM_YAML);
  if (!existsSync(p)) {
    // try .axiom/config/project.yaml
    const alt = path.join(cwd, ".axiom", "config", "project.yaml");
    if (existsSync(alt)) {
      const r = await parseFile(alt);
      return { doc: r.document, path: alt };
    }
    throw new Error(`No ${AXIOM_YAML} found in ${cwd}. Run 'axiom init' first.`);
  }
  const r = await parseFile(p);
  return { doc: r.document, path: p };
}

program
  .command("init [name]")
  .description("Initialize an Axiom project")
  .option("-t, --type <type>", "project type", "application")
  .action(async (name, opts) => {
    const projectName = name || path.basename(process.cwd());
    const cwd = process.cwd();
    const axiomYaml = `axiom:
  version: "0.1"
  specification: "adl/v1"

project:
  name: "${projectName}"
  type: "${opts.type}"

agent:
  name: "principal-engineer"
  identity:
    role: "Principal Software Engineer"
    responsibilities:
      - architecture
      - implementation
      - code-review
    objectives:
      - maintainability
      - reliability

skills:
  include: []
  discovery:
    enabled: true
    directories:
      - "./skills"
      - "./.axiom/skills"
  loading:
    strategy: progressive

verification:
  required:
    - tests
    - build
  completion:
    require_verified_results: true
    allow_unverified_claims: false
`;
    await writeFile(path.join(cwd, AXIOM_YAML), axiomYaml, "utf8");
    await mkdir(path.join(cwd, ".axiom", "config"), { recursive: true });
    await mkdir(path.join(cwd, ".axiom", "skills"), { recursive: true });
    await mkdir(path.join(cwd, ".axiom", "generated"), { recursive: true });
    await writeFile(path.join(cwd, ".axiom", "config", "project.yaml"), `project:\n  name: "${projectName}"\n  type: "${opts.type}"\n`, "utf8");
    console.log(`Initialized Axiom project '${projectName}' in ${cwd}`);
  });

program
  .command("inspect")
  .description("Inspect the effective Axiom configuration")
  .action(async () => {
    const { doc, path: p } = await loadDoc();
    console.log(`Source: ${p}`);
    console.log(JSON.stringify(doc, null, 2));
  });

program
  .command("doctor")
  .description("Diagnose project setup")
  .action(async () => {
    const cwd = process.cwd();
    console.log("Axiom doctor");
    console.log(`- node: ${process.version}`);
    console.log(`- axiom.yaml: ${existsSync(path.join(cwd, AXIOM_YAML)) ? "present" : "MISSING"}`);
    try {
      const { doc } = await loadDoc();
      const res = validateAdl(doc);
      console.log(`- config valid: ${res.valid}`);
      if (res.errors.length) res.errors.forEach((e) => console.log(`   ERROR ${e.path}: ${e.message}`));
      if (res.warnings.length) res.warnings.forEach((w) => console.log(`   WARN ${w}`));
    } catch (e) {
      console.log(`- config: ${(e as Error).message}`);
    }
    console.log(`- .axiom/: ${existsSync(path.join(cwd, ".axiom")) ? "present" : "missing"}`);
  });

const configCmd = program.command("config").description("Configuration commands");
configCmd
  .command("validate")
  .description("Validate axiom.yaml")
  .option("--strict", "treat warnings as errors")
  .action(async (opts) => {
    const { doc } = await loadDoc();
    const res = validateAdl(doc);
    console.log(`Valid: ${res.valid}`);
    for (const e of res.errors) console.log(`ERROR ${e.path}: ${e.message}`);
    for (const w of res.warnings) console.log(`WARN ${w}`);
    if (!res.valid || (opts.strict && res.warnings.length)) process.exitCode = 1;
  });

program
  .command("validate")
  .description("Validate project configuration (alias)")
  .option("--strict", "treat warnings as errors")
  .action(async (opts) => {
    const { doc } = await loadDoc();
    const res = validateAdl(doc);
    console.log(`Valid: ${res.valid}`);
    for (const e of res.errors) console.log(`ERROR ${e.path}: ${e.message}`);
    for (const w of res.warnings) console.log(`WARN ${w}`);
    if (!res.valid || (opts.strict && res.warnings.length)) process.exitCode = 1;
  });

program
  .command("compile")
  .description("Compile Axiom config to agent-specific outputs")
  .option("--target <target>", "target adapter", "claude")
  .option("--all", "compile all targets")
  .action(async (opts) => {
    const { doc } = await loadDoc();
    const v = validateAdl(doc);
    if (!v.valid) {
      console.error("Config invalid; aborting compile");
      for (const e of v.errors) console.error(`ERROR ${e.path}: ${e.message}`);
      process.exitCode = 1;
      return;
    }
    const targets: CompileTarget[] = opts.all
      ? ["generic", "claude", "antigravity", "codex", "cursor"]
      : [opts.target as CompileTarget];
    const cwd = process.cwd();
    for (const t of targets) {
      const r = compile(doc, t);
      for (const f of r.files) {
        const full = path.join(cwd, f.path);
        await mkdir(path.dirname(full), { recursive: true });
        await writeFile(full, f.content, "utf8");
        console.log(`[${t}] wrote ${f.path}`);
      }
      for (const w of r.warnings) console.log(`[${t}] WARN ${w}`);
    }
  });

program
  .command("verify")
  .description("Run verification checks (build/test/lint if declared)")
  .action(async () => {
    const { doc } = await loadDoc();
    const required = doc.verification?.required ?? [];
    console.log("Verification required:", required.join(", ") || "(none)");
    console.log("Note: axiom verify in v0.1 reports declared requirements; execution engine (Phase 5) will run them.");
  });

// agent commands
const agentCmd = program.command("agent").description("Agent integration commands");
agentCmd
  .command("detect")
  .description("Detect supported AI agents in environment")
  .action(async () => {
    const cwd = process.cwd();
    const checks: { name: string; present: boolean }[] = [
      { name: "Claude Code (CLAUDE.md)", present: existsSync(path.join(cwd, "CLAUDE.md")) },
      { name: "Cursor (.cursor)", present: existsSync(path.join(cwd, ".cursor")) },
      { name: "Codex/Agents (AGENTS.md)", present: existsSync(path.join(cwd, "AGENTS.md")) },
      { name: "Antigravity", present: existsSync(path.join(cwd, ".antigravity")) },
    ];
    for (const c of checks) console.log(`${c.present ? "✓" : "✗"} ${c.name}`);
  });

agentCmd
  .command("configure <target>")
  .description("Configure a specific agent target")
  .action(async (target) => {
    console.log(`Configuring ${target}... (use 'axiom compile --target ${target}' to generate files)`);
  });

agentCmd
  .command("sync")
  .description("Sync Axiom config to all detected agents")
  .action(async () => {
    const { doc } = await loadDoc();
    const v = validateAdl(doc);
    if (!v.valid) {
      console.error("Config invalid");
      process.exitCode = 1;
      return;
    }
    const cwd = process.cwd();
    const targets: CompileTarget[] = ["claude", "antigravity", "codex", "cursor", "generic"];
    for (const t of targets) {
      const r = compile(doc, t);
      for (const f of r.files) {
        const full = path.join(cwd, f.path);
        await mkdir(path.dirname(full), { recursive: true });
        await writeFile(full, f.content, "utf8");
      }
    }
    console.log("Synced Axiom configuration to all agent targets.");
  });

// skill commands
const skillCmd = program.command("skill").description("Skill management");
skillCmd
  .command("list")
  .description("List installed/local skills")
  .action(async () => {
    const cwd = process.cwd();
    const dirs = [path.join(cwd, "skills"), path.join(cwd, ".axiom", "skills")];
    const found: string[] = [];
    for (const d of dirs) {
      if (!existsSync(d)) continue;
      for (const e of await readdir(d)) {
        const full = path.join(d, e);
        if ((await stat(full)).isDirectory()) found.push(e);
      }
    }
    if (!found.length) console.log("No skills found.");
    else found.forEach((s) => console.log(s));
  });

skillCmd
  .command("validate <path>")
  .description("Validate a skill manifest")
  .action(async (p) => {
    const full = path.resolve(process.cwd(), p);
    let manifestPath = full;
    if ((await stat(full)).isDirectory()) manifestPath = path.join(full, "skill.yaml");
    // support skill.yaml or skill.json
    let content: string;
    let manifest: unknown;
    if (existsSync(manifestPath)) {
      content = await readFile(manifestPath, "utf8");
      manifest = parseString(content, manifestPath.endsWith(".json") ? "json" : "yaml");
    } else if (existsSync(path.join(full, "skill.json"))) {
      content = await readFile(path.join(full, "skill.json"), "utf8");
      manifest = JSON.parse(content);
    } else {
      console.error("No skill.yaml/skill.json found");
      process.exitCode = 1;
      return;
    }
    const res = validateManifest(manifest, "skill");
    console.log(`Valid: ${res.valid}`);
    for (const e of res.errors) console.log(`ERROR ${e.path}: ${e.message}`);
  });

// preset commands
const presetCmd = program.command("preset").description("Preset management");
presetCmd
  .command("list")
  .description("List presets")
  .action(async () => {
    const cwd = process.cwd();
    const d = path.join(cwd, ".axiom", "presets");
    if (!existsSync(d)) { console.log("No presets directory."); return; }
    for (const e of await readdir(d)) console.log(e);
  });

presetCmd
  .command("activate <name>")
  .description("Activate a preset in axiom.yaml")
  .action(async (name) => {
    const { doc } = await loadDoc();
    doc.presets = doc.presets || {};
    doc.presets.active = doc.presets.active || [];
    if (!doc.presets.active.includes(name)) doc.presets.active.push(name);
    const { stringify: sy } = await import("yaml");
    await writeFile(path.join(process.cwd(), AXIOM_YAML), sy(doc), "utf8");
    console.log(`Activated preset '${name}'`);
  });

// profile commands
const profileCmd = program.command("profile").description("Profile management");
profileCmd
  .command("list")
  .description("List profiles")
  .action(async () => {
    const cwd = process.cwd();
    const d = path.join(cwd, ".axiom", "profiles");
    if (!existsSync(d)) { console.log("No profiles directory."); return; }
    for (const e of await readdir(d)) console.log(e);
  });

// workflow commands
const wfCmd = program.command("workflow").description("Workflow management");
wfCmd
  .command("validate")
  .description("Validate workflows in axiom.yaml")
  .action(async () => {
    const { doc } = await loadDoc();
    const res = validateAdl(doc);
    console.log(`Valid: ${res.valid}`);
    for (const e of res.errors) console.log(`ERROR ${e.path}: ${e.message}`);
    if (!res.valid) process.exitCode = 1;
  });

wfCmd
  .command("list")
  .description("List workflows")
  .action(async () => {
    const { doc } = await loadDoc();
    const active = doc.workflows?.active ?? [];
    const defs = doc.workflows?.definitions ?? [];
    console.log("Active:", active.join(", ") || "(none)");
    console.log("Defined:", defs.map((d: any) => d.name).join(", ") || "(none)");
  });

program.parseAsync(process.argv).catch((e) => {
  console.error(e);
  process.exit(1);
});