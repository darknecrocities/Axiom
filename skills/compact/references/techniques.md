# Compact Techniques Reference

## Context pruning
Keep only files touched or referenced. Drop generated/vendored dirs.

## Symbol extraction
Use grep for function/class signatures; read only relevant ranges with offset/limit.

## Diff-first
Emit minimal hunks; never rewrite unchanged sections.

## Memory hygiene
Store decisions and facts; discard transcripts and repeated context.

## Output budgeting
Default to short answers; expand on explicit request.