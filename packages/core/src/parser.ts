import { readFile } from "node:fs/promises";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import type { AdlDocument } from "@axiom/adl";

export type ParseFormat = "yaml" | "json" | "auto";

export interface ParseResult {
  document: AdlDocument;
  format: "yaml" | "json";
  source: string;
}

function detectFormat(source: string, explicit?: ParseFormat): "yaml" | "json" {
  if (explicit && explicit !== "auto") return explicit;
  const trimmed = source.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  return "yaml";
}

export function parseString(content: string, format: ParseFormat = "auto"): AdlDocument {
  const fmt = detectFormat(content, format);
  let doc: unknown;
  if (fmt === "json") {
    doc = JSON.parse(content);
  } else {
    doc = parseYaml(content);
  }
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) {
    throw new Error("ADL document must be a mapping/object");
  }
  return doc as AdlDocument;
}

export async function parseFile(filePath: string, format: ParseFormat = "auto"): Promise<ParseResult> {
  const content = await readFile(filePath, "utf8");
  const fmt = detectFormat(content, format);
  const document = parseString(content, fmt);
  return { document, format: fmt, source: filePath };
}

export function stringify(doc: AdlDocument, format: "yaml" | "json" = "json", pretty = true): string {
  if (format === "json") {
    return JSON.stringify(doc, null, pretty ? 2 : 0);
  }
  return stringifyYaml(doc);
}