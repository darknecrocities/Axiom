import type { AdlDocument } from "@axiom/adl";

export interface PackageRef {
  name: string;
  version: string;
  type: string;
  manifest: Record<string, unknown>;
  dependencies?: string[];
}

export interface ResolutionResult {
  resolved: PackageRef[];
  missing: string[];
  conflicts: string[];
  lockfile: Record<string, string>;
}

export class PackageRegistry {
  private packages = new Map<string, PackageRef>();

  register(pkg: PackageRef) {
    this.packages.set(pkg.name, pkg);
  }

  get(name: string): PackageRef | undefined {
    return this.packages.get(name);
  }

  list(): PackageRef[] {
    return [...this.packages.values()];
  }

  clear() {
    this.packages.clear();
  }
}

export function resolveDependencies(
  roots: string[],
  registry: PackageRegistry,
): ResolutionResult {
  const resolved: PackageRef[] = [];
  const resolvedNames = new Set<string>();
  const missing: string[] = [];
  const conflicts: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function visit(name: string) {
    if (visited.has(name)) return;
    if (visiting.has(name)) {
      conflicts.push(`circular dependency detected at ${name}`);
      return;
    }
    const pkg = registry.get(name);
    if (!pkg) {
      missing.push(name);
      return;
    }
    visiting.add(name);
    for (const dep of pkg.dependencies ?? []) {
      visit(dep);
    }
    visiting.delete(name);
    visited.add(name);
    if (!resolvedNames.has(name)) {
      resolvedNames.add(name);
      resolved.push(pkg);
    }
  }

  for (const r of roots) visit(r);

  const lockfile: Record<string, string> = {};
  for (const p of resolved) lockfile[p.name] = p.version;

  return { resolved, missing, conflicts, lockfile };
}

export function mergeConfigs(base: AdlDocument, override: AdlDocument): AdlDocument {
  // Shallow-merge top-level blocks; arrays are replaced (not concatenated) to keep deterministic.
  const result: AdlDocument = { ...base };
  for (const key of Object.keys(override)) {
    const v = (override as Record<string, unknown>)[key];
    if (v && typeof v === "object" && !Array.isArray(v) && typeof (base as Record<string, unknown>)[key] === "object") {
      result[key] = { ...(base as Record<string, unknown>)[key] as object, ...(v as object) };
    } else {
      result[key] = v as never;
    }
  }
  return result;
}

export function applyPrecedence(layers: AdlDocument[]): AdlDocument {
  // lowest -> highest priority
  return layers.reduce((acc, layer) => mergeConfigs(acc, layer), {} as AdlDocument);
}