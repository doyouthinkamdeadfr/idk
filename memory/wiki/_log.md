---
tags: [meta, log]
description: Append-only chronological record of wiki actions
---

# Wiki Log

## [2026-05-28] init | LLM Wiki restructuring

Restructured `memory/` to follow the LLM Wiki pattern:

- Created `raw/` directory for immutable source documents
- Created `wiki/` directory for compiled knowledge
- Moved existing files (decisions.md, plan.md, tech-stack.md, todo-snapshot.md, sessions/) into `wiki/`
- Created `AGENTS.md` — schema/instructions for the LLM agent
- Created `_index.md` — content catalog
- Created `_log.md` — this file

The wiki is now a persistent, compounding knowledge base instead of a flat collection of notes.
