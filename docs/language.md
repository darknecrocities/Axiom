# ADL Language Reference (v0.1)

Axiom's Agent Definition Language uses YAML as human-readable syntax and JSON as interchange. Schema: `packages/adl/schemas/adl.schema.json`.

## Top-level blocks
- `axiom` — version, specification
- `project` — name, type, description
- `agent` — name, identity, capabilities
- `skills` — include/exclude, discovery, loading
- `presets` — active list, overrides
- `profiles` — active list
- `workflows` — active list, execution, definitions
- `policies` — engineering/testing/security/custom
- `tools` — filesystem, terminal, git, mcp
- `context` — sources, discovery, persistence
- `memory` — location, retention
- `execution` — mode, timeout, retries
- `verification` — required checks, evidence, completion

## Example
See `packages/adl/examples/axiom.yaml`.