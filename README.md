# Axiom — Agent-Native Development Framework & Language

> Build once. Define capabilities. Operate everywhere.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Axiom is an open-source, **agent-native** development framework that standardizes how AI agents understand, configure, extend, orchestrate, and execute software engineering tasks. It provides a common development specification (the **Agent Definition Language**, ADL) interpretable by Claude Code, Google Antigravity, OpenAI Codex, Cursor, GitHub Copilot, and other compatible AI coding environments.

## Why Axiom
Traditional frameworks target human developers. Axiom targets AI agents as first-class consumers: every component is structured for agents to discover, interpret, and use. Define your engineering environment once; reuse it across agents.

## Core ideas
- **Agent Definition Language (ADL)** — declarative YAML/JSON config for agent identity, capabilities, skills, presets, workflows, policies, tools, context, verification.
- **Skills** — reusable capability packages (instructions + references + scripts + templates).
- **Presets & Profiles** — composable engineering standards and complete operating environments.
- **Workflows** — declarative, dependency-based execution plans.
- **Policies** — advisory/required/enforced rules.
- **Adapters** — cross-agent output generation (Claude, Antigravity, Codex, Cursor, generic).
- **Verification** — evidence-based completion; no unverified claims.

## Repository layout
```
axiom/
├── packages/
│   ├── adl/          # ADL types + JSON schemas + examples
│   ├── core/         # parser, validator, resolver, compiler
│   ├── cli/          # `axiom` CLI
│   └── adapters/     # agent adapters
├── skills/           # official skills (incl. compact)
├── presets/          # reusable presets
├── profiles/         # agent profiles
├── workflows/        # workflow definitions
├── examples/         # example projects
├── docs/             # documentation
├── tests/            # integration tests
└── README.md
```

## Quick start
```bash
# install deps
pnpm install

# build
pnpm build

# init a project
node packages/cli/dist/index.js init my-project
cd my-project

# validate
node ../packages/cli/dist/index.js validate

# compile to Claude Code output
node ../packages/cli/dist/index.js compile --target claude

# sync to all agents
node ../packages/cli/dist/index.js agent sync
```

Or link the CLI globally after build:
```bash
pnpm --filter @axiom/cli link --global
axiom init my-project
```

## CLI commands
See [docs/cli.md](./docs/cli.md).

## ADL
See [docs/language.md](./docs/language.md) and schemas in `packages/adl/schemas/`.

## Status
v0.1.0 — conceptual architecture + initial implementation (Phase 0–4 partial). Independent runtime (Phase 7) deferred.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security
See [SECURITY.md](./SECURITY.md).

## License
MIT — see [LICENSE](./LICENSE).