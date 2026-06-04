---
tags: [meta, log]
description: Append-only chronological record of wiki actions
---

# Wiki Log

## [2026-05-30] deploy | Cloudflare Pages

Deployed landing page to Cloudflare Pages:

- Created Pages project `memory` at `https://memory-7o9.pages.dev`
- wrangler v4.95.0 has bun compatibility issue — used v3.0.0 instead
- Worker compiled with Pages Functions enabled, SSR confirmed
- Static assets served with immutable caching

## [2026-05-28] init | LLM Wiki restructuring

Restructured `memory/` to follow the LLM Wiki pattern:

- Created `raw/` directory for immutable source documents
- Created `wiki/` directory for compiled knowledge
- Moved existing files (decisions.md, plan.md, tech-stack.md, todo-snapshot.md, sessions/) into `wiki/`
- Created `AGENTS.md` — schema/instructions for the LLM agent
- Created `_index.md` — content catalog
- Created `_log.md` — this file

The wiki is now a persistent, compounding knowledge base instead of a flat collection of notes.

## [2026-06-03] reconcile | Wiki sync with current codebase

Reconciled wiki with the actual git history and codebase after discovering the wiki was still describing the old cyberpunk/3D architecture while the repo had been through a full creative reset:

- **`_overview.md`** — Rewritten: removed Three.js/3D references, documented warm light palette, 2D canvas hero, auth + billing phase
- **`plan.md`** — Rewritten: new stack (no Three.js/GSAP), 7 sections, warm palette, auth/billing architecture
- **`tech-stack.md`** — Rewritten: removed Three.js, EffectComposer, @threlte; added Better Auth, D1, Drizzle, Polar.sh
- **`architecture.md`** — Rewritten: removed 3D pipeline, documented scroll system, 2D Canvas, auth data flow
- **`decisions.md`** — Superseded ADR-002, ADR-006, ADR-007, ADR-008 (3D era). Added ADR-009 (creative reset), ADR-010 (native CSS over GSAP), ADR-011 (Better Auth), ADR-012 (Polar.sh)
- **`sections.md`** — Rewritten: 7 warm-light sections, no particle shapes or camera spline
- **`todo-snapshot.md`** — Updated: removed completed 3D items, added auth/billing progress
- **`_index.md`** — Updated stats and summaries; added note that sessions 001-003 reflect old architecture

## [2026-06-03] scaffold | Dashboard UI

Built a ChatGPT-style dashboard shell on `phase-3-dashboard` branch:

- Layout: sidebar (240px) + top bar + main content area, auth guard redirecting to /login
- Sidebar: New Chat, Search, Library (Documents/Projects), Recents with pin/archive/delete/share, user menu with upgrade/personalization/settings/help/logout
- Top bar: Memory brand with plan dropdown, Upgrade button, New Chat shortcut
- Routes: /dashboard (chat), /dashboard/c/[id] (chat view), /dashboard/documents, /dashboard/projects, /dashboard/settings
- Components: ChatInput (+ menu, textarea, mic, send), EmptyChatState (rotating welcome lines), RecentChatItem, ChatMenu, Sidebar, TopBar
- Mock data: 8 chats, 5 documents, 3 projects

7 commits, 15 files created.

## [2026-06-03] fix | Dashboard layout fixes

## [2026-06-04] rag | RAG database schema + migration

## [2026-06-04] rag | OpenRouter client + RAG engine + document processor

## [2026-06-04] rag | Chat + document API routes

## [2026-06-04] rag | Frontend wiring — ChatInput, chat views, sidebar, documents

## [2026-06-04] rag | Vectorize migration — replaced in-memory search with Cloudflare Vectorize

Migrated from D1 in-memory cosine similarity to Cloudflare Vectorize:

- Created `memory-rag-index` (256 dims, cosine metric)
- Added `[[vectorize]]` binding to wrangler.toml
- Rewrote `indexDocument`: batch upserts vectors with metadata to Vectorize (D1 kept as backup)
- Rewrote `searchSimilar`: queries Vectorize instead of loading all chunks
- Removed `cosineSimilarity` function
- Added `src/env.d.ts` with Worker globals (VectorizeIndex, D1Database)
- Updated `.dev.vars` with current OPENROUTER_API_KEY
- Created `memory/wiki/rag-vectorize.md`

Wired up all dashboard UI to real RAG API:

- Rewrote ChatInput: + menu for photos/files/links, attachment chips, voice (Web Speech API), send as payload with attachments
- New chat page: creates chat via API, sends FormData, reads SSE stream, navigates to chat view
- Existing chat page: loads real message history, sends messages with streaming, shows source citations
- Sidebar: loads real chats via API, pin/archive/delete hit live endpoints
- Documents page: loads real docs, upload via file picker, delete documents
- Created `src/lib/sse.ts` — shared SSE stream reader
- Updated RecentChatItem to use API response type
- Created `memory/wiki/rag-frontend.md`

Built all RAG API endpoints:

- `GET/POST /api/chats` — list and create chat sessions
- `PATCH/DELETE /api/chats/[id]` — update and delete chats
- `GET /api/chats/[id]/messages` — fetch message history
- `POST /api/chats/[id]/messages` — main RAG endpoint: accepts multipart with text + files[] + links[], processes attachments (extract/chunk/embed), searches similar chunks, streams LLM response via SSE
- `GET /api/documents` — list user's documents
- `DELETE /api/documents/[id]` — delete document + chunks
- Created `memory/wiki/rag-api.md` documenting all endpoints and SSE format

Built the core RAG server utilities:

- `src/lib/server/openrouter.ts` — OpenRouter client: embeddings (text-embedding-3-small), vision (gpt-4o for image descriptions), streaming chat (gpt-4o-mini)
- `src/lib/server/rag.ts` — RAG engine: text chunking, cosine similarity search, document indexing, prompt building
- `src/lib/server/documents.ts` — Document processor: text file extraction, image description, link content fetching, MIME detection
- `src/app.d.ts` — Added OPENROUTER_API_KEY to Platform.env type
- Created `memory/wiki/rag-server.md` documenting all three modules

Built the RAG database foundation:

- Created 5 new Drizzle tables in `src/db/schema.ts`: chat, message, document, document_chunk, chat_document
- Created `migrations/0003_create-rag-tables.sql` with all five tables
- Tables support: chat sessions with pin/archive, messages with attachments + source citations, documents with processing status, text chunks with embeddings, chat-document junction
- Created `memory/wiki/rag-database.md` documenting the schema

- Hid landing page Navbar + ProgressBar on dashboard routes (was overlapping dashboard TopBar)
- Skipped Lenis scroll init when on dashboard to prevent scroll conflicts
- Centered empty chat state vertically instead of pinning input to bottom
- Auto-cycle welcome text on hard refresh (removed manual click interaction)
