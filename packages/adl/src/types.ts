/**
 * Axiom Agent Definition Language (ADL) v0.1 type definitions.
 * YAML is the human-readable syntax; JSON is the interchange format.
 */

export type AdlVersion = "0.1";

export interface AxiomBlock {
  version: string;
  specification?: string;
}

export interface ProjectBlock {
  name: string;
  type?: string;
  description?: string;
  root?: string;
}

export interface AgentIdentity {
  role?: string;
  responsibilities?: string[];
  objectives?: string[];
  boundaries?: string[];
}

export interface AgentCapabilities {
  required?: string[];
  optional?: string[];
  constraints?: string[];
}

export interface AgentBlock {
  name: string;
  version?: string;
  description?: string;
  identity?: AgentIdentity;
  capabilities?: AgentCapabilities;
}

export interface SkillDiscovery {
  enabled?: boolean;
  directories?: string[];
}

export interface SkillLoading {
  strategy?: "progressive" | "eager" | "lazy";
  mode?: "progressive" | "eager" | "lazy";
}

export interface SkillsBlock {
  include?: string[];
  exclude?: string[];
  discovery?: SkillDiscovery;
  loading?: SkillLoading;
}

export interface PresetsBlock {
  active?: string[];
  overrides?: Record<string, unknown>;
}

export interface ProfilesBlock {
  active?: string[];
}

export interface WorkflowStage {
  id: string;
  action: string;
  required?: boolean;
  depends_on?: string[];
  condition?: string;
  retry?: number;
}

export interface WorkflowsBlock {
  active?: string[];
  execution?: {
    require_plan?: boolean;
    require_verification?: boolean;
    parallel?: boolean;
  };
  definitions?: WorkflowDefinition[];
}

export interface WorkflowDefinition {
  name: string;
  version?: string;
  trigger?: { type?: string; [k: string]: unknown };
  stages: WorkflowStage[];
  completion?: { require_all_stages?: boolean };
}

export interface PoliciesBlock {
  engineering?: Record<string, boolean | string | number>;
  testing?: Record<string, boolean | string | number>;
  security?: Record<string, boolean | string | number>;
  custom?: Record<string, Record<string, unknown>>;
}

export interface ToolPermission {
  enabled?: boolean;
  permissions?: string[];
  allow?: string[];
  deny?: string[];
}

export interface McpServerDecl {
  name?: string;
  transport?: "stdio" | "http" | "sse";
  command?: string;
  args?: string[];
  url?: string;
  permissions?: Record<string, unknown>;
  capabilities?: string[];
}

export interface ToolsBlock {
  filesystem?: ToolPermission & { read?: string[]; write?: string[] };
  terminal?: ToolPermission;
  git?: ToolPermission;
  mcp?: ToolPermission & { servers?: (string | McpServerDecl)[] };
  [key: string]: unknown;
}

export interface ContextBlock {
  sources?: string[];
  discovery?: {
    inspect_project_structure?: boolean;
    detect_technology_stack?: boolean;
    identify_existing_patterns?: boolean;
  };
  persistence?: {
    enabled?: boolean;
    location?: string;
  };
}

export interface MemoryBlock {
  enabled?: boolean;
  location?: string;
  retention?: string;
  categories?: string[];
}

export interface ExecutionBlock {
  mode?: "interactive" | "autonomous" | "supervised";
  timeout?: number;
  max_retries?: number;
  checkpoints?: boolean;
}

export interface VerificationBlock {
  required?: string[];
  evidence?: {
    command_results?: boolean;
    test_results?: boolean;
    changed_files?: boolean;
    logs?: boolean;
  };
  completion?: {
    require_verified_results?: boolean;
    allow_unverified_claims?: boolean;
  };
}

export interface AdlDocument {
  axiom?: AxiomBlock;
  project?: ProjectBlock;
  agent?: AgentBlock;
  identity?: AgentIdentity;
  capabilities?: AgentCapabilities;
  skills?: SkillsBlock;
  presets?: PresetsBlock;
  profiles?: ProfilesBlock;
  workflows?: WorkflowsBlock;
  policies?: PoliciesBlock;
  tools?: ToolsBlock;
  context?: ContextBlock;
  memory?: MemoryBlock;
  execution?: ExecutionBlock;
  verification?: VerificationBlock;
  /** Allow forward-compatible extension fields. */
  [key: string]: unknown;
}

export const ADL_VERSION = "0.1";
export const ADL_SPEC = "adl/v1";