# Architecture

Four layers: Specification, Capability, Execution, Ecosystem. See technical vision document for full detail.

Packages map to layers:
- `adl` → Specification
- `core` → Execution (parser/validator/resolver/compiler)
- `adapters` → Execution (agent adapters)
- `cli` → Execution (developer interface)
- `skills/presets/profiles/workflows` → Capability