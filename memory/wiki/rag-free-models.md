---
tags: [rag, api, openrouter, free-models]
created: 2026-06-04
updated: 2026-06-04
---

# RAG Free Models

## Problem

The RAG feature initially used paid OpenRouter models:

| Purpose | Model | Cost |
|---------|-------|------|
| Embeddings | `text-embedding-3-small` | Paid |
| Chat completions | `gpt-4o-mini` | Paid |
| Vision (image description) | `gpt-4o` | Paid |

The OpenRouter API key (`sk-or-v1-...`) had no credits, causing 402 errors on all requests.

## Solution: OpenRouter Free Models

OpenRouter offers free model endpoints via the `:free` suffix and the `openrouter/free` router.

### Embeddings

Only one free embedding model was available on OpenRouter: `nvidia/llama-nemotron-embed-vl-1b-v2:free`. This model outputs 2048-dimensional vectors.

**Vectorize constraint**: Cloudflare Vectorize supports a maximum of 1536 dimensions. The 2048-dim vectors are truncated to 1536 before upsert to Vectorize. Full embeddings are stored in D1 (`document_chunk.embedding`) for backup.

### Chat Completions

Using `openrouter/free` — OpenRouter's free models router. It automatically selects a random free model that supports the required features (streaming, tool use, etc.). This avoids hardcoding a specific free model that might be rate-limited.

### Vision (Image Description)

Also using `openrouter/free`. The router selects a free model that supports image inputs.

## Implementation

All model constants are defined in `src/lib/server/openrouter.ts`:

```typescript
const EMBED_MODEL = 'nvidia/llama-nemotron-embed-vl-1b-v2:free';
const CHAT_MODEL = 'openrouter/free';
const VISION_MODEL = 'openrouter/free';
```

Embedding truncation happens in the `embed()` function:

```typescript
const MAX_DIMS = 1536;
function truncate(vec: number[]): number[] {
    return vec.length > MAX_DIMS ? vec.slice(0, MAX_DIMS) : vec;
}
```

Truncation is also applied before upserting to Vectorize in `rag.ts` `indexDocument()`.

## Sidebar: Archived Chats View

The sidebar previously filtered out archived chats entirely. Added a toggleable archived view:

- **More → Archived chats** button now sets `showArchived = true`, filtering to only archived chats
- Heading changes from "Recents" to "Archived" with an **"Active chats"** link to go back
- Archived chats display with `opacity-40` and are non-clickable
- Unarchiving via the `...` menu returns a chat to the active list immediately

## Files Changed

- `src/lib/server/openrouter.ts` — Model constants, embed truncation, removed Workers AI fallback
- `src/lib/server/rag.ts` — Vectorize upsert truncation function
- `src/components/dashboard/Sidebar.svelte` — Archived chats view toggle
- `src/app.d.ts` — Removed `AI: Ai` type (no longer needed)
- `src/env.d.ts` — Removed `Ai` interface
- `wrangler.toml` — Removed `[ai]` binding
