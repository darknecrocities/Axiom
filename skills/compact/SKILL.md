# Compact: Token-Minimizing Skill

## Purpose
Reduce token consumption in prompts, context, and outputs without losing information required to complete the task.

## When to use
- Large repository context or long conversations.
- Cost/latency sensitive operations.
- Agent must report concisely.

## Principles
1. Prefer symbols over prose. Use file paths, identifiers, and diffs instead of narrating.
2. Load only what is needed (progressive disclosure). Do not paste whole files; cite ranges.
3. Summarize verified facts; drop speculation and restated context.
4. Use structured output (JSON/YAML) over free text when downstream parses it.
5. Collapse repeated boilerplate; reference instead of repeating.
6. Truncate tool output to relevant lines; never echo full logs unless debugging.
7. Prefer incremental diffs over full file rewrites.
8. Avoid redundant explanations of already-established context.

## Techniques
- Context pruning: remove files/sections unrelated to the current task.
- Symbol extraction: grep for signatures, not full implementations.
- Diff-first edits: emit minimal hunks.
- Memory hygiene: store facts, not transcripts.
- Output budgeting: cap explanations; expand only on request.

## Verification
- Task still solvable with reduced context.
- No required detail lost.
- Measurable token reduction vs baseline.