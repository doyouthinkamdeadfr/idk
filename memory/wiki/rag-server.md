---
tags: [rag, server, openrouter]
created: 2026-06-04
updated: 2026-06-04
sources:
  - src/lib/server/openrouter.ts
  - src/lib/server/rag.ts
  - src/lib/server/documents.ts
---

# RAG Server Utilities

Three server-side modules power the RAG pipeline.

## `openrouter.ts` — LLM Client

Wraps the OpenRouter API for three operations:

| Function | Model | Purpose |
|----------|-------|---------|
| `embed(text)` | `text-embedding-3-small` | Converts text to 256-dimensional vector |
| `describeImage(base64, mime)` | `gpt-4o` (vision) | Returns text description of an image |
| `chatComplete(messages, onToken?)` | `gpt-4o-mini` | Streaming chat completion via SSE |

All functions read `OPENROUTER_API_KEY` from `platform.env`.

## `rag.ts` — RAG Engine

Core retrieval pipeline:

| Function | Purpose |
|----------|---------|
| `chunkText(text, 500, 50)` | Splits text into overlapping chunks |
| `cosineSimilarity(a, b)` | Computes similarity between two embedding vectors |
| `searchSimilar(db, userId, query, platform, topK=10)` | Embeds query, scores all user chunks, returns top 10 |
| `indexDocument(db, userId, docId, text, platform)` | Chunks + embeds + stores document chunks |
| `buildRagMessages(query, chunks, history)` | Builds prompt with context + conversation history |
| `isWithinFreeLimit(db, userId)` | Checks chunk count against free tier limit (5000) |

## `documents.ts` — Document Processing

Handles extracting text from different input types:

| Function | Purpose |
|----------|---------|
| `extractTextFromFile(buffer, mime, name)` | Decodes .txt/.md via TextDecoder; throws for images |
| `extractTextFromImage(buffer, mime, platform)` | Base64-encodes and sends to vision API |
| `fetchLinkContent(url)` | Fetches URL, strips HTML/scripts/styles |
| `getMimeType(name, buffer)` | Detects MIME from magic bytes (PNG, JPEG, GIF, WebP) or extension |

Unsupported types (PDF, DOCX) throw an error.
