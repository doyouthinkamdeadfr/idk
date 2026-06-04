---
tags: [rag, vectorize, vector-database]
created: 2026-06-04
updated: 2026-06-04
sources:
  - wrangler.toml
  - src/lib/server/rag.ts
  - src/routes/api/chats/[id]/messages/+server.ts
  - src/env.d.ts
---

# Vectorize Migration

Migrated from D1 in-memory cosine similarity to Cloudflare Vectorize.

## Changes

### Vectorize Index
- Created `memory-rag-index` via `wrangler vectorize create`
- Dimensions: 256, Metric: cosine

### `wrangler.toml`
Added `[[vectorize]]` binding:
```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "memory-rag-index"
```

### `rag.ts` — Rewritten Functions
- **`indexDocument`**: Now batch-upserts vectors to Vectorize with metadata (documentId, documentName, content, chunkIndex). Also stores a copy in D1 `document_chunk` for backup.
- **`searchSimilar`**: Now queries Vectorize instead of loading all chunks + in-memory cosine sim. Returns matches sorted by Vectorize-calculated score.
- **Removed**: `cosineSimilarity` function (no longer needed).

### `messages/+server.ts`
- Captures `VECTORIZE` binding from env and passes it to `indexDocument` and `searchSimilar`
- Both functions now receive vectorize + documentName parameters

### Type Declarations
Added `src/env.d.ts` with Worker globals: `VectorizeIndex`, `D1Database`, `D1PreparedStatement`.

### `.dev.vars`
Updated `OPENROUTER_API_KEY` with the current key.

## Architecture

```
Upload → Document Processor → embed() via OpenRouter
                                    ↓
                          Vectorize.upsert() ─┐
                          D1 document_chunk   │ (backup)
                                    ↓
Query → embed() → Vectorize.query() → top 10 matches → RAG prompt → LLM
```
