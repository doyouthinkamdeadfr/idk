---
tags: [rag, api, routes]
created: 2026-06-04
updated: 2026-06-04
sources:
  - src/routes/api/chats/+server.ts
  - src/routes/api/chats/[id]/+server.ts
  - src/routes/api/chats/[id]/messages/+server.ts
  - src/routes/api/documents/+server.ts
  - src/routes/api/documents/[id]/+server.ts
---

# RAG API Routes

## Chat Endpoints

### `GET /api/chats`
Returns list of user's chats sorted by most recent.

### `POST /api/chats`
Create a new chat. Body: `{ title?: string }`. Returns `{ id, title }`.

### `PATCH /api/chats/[id]`
Update chat. Body accepts `{ title?, pinned?, archived? }`. Ownership-checked.

### `DELETE /api/chats/[id]`
Cascade-deletes messages, chat_document links, and the chat itself.

### `GET /api/chats/[id]/messages`
Returns all messages in a chat, ordered by creation time.

### `POST /api/chats/[id]/messages` (Main RAG Endpoint)
Accepts `multipart/form-data` with:
- `text` — the user's query string
- `files[]` — attached files (images, .txt, .md)
- `links` — JSON array of URL strings

**Processing flow:**
1. Each file/link → stored as `document` (status=processing) → text extracted → chunked → embedded → stored as `document_chunk` (status=ready)
2. User message saved with attachment metadata
3. If first message → auto-title the chat from the query
4. Query embedded → cosine similarity across user's chunks → top 10
5. Conversation history retrieved → RAG prompt built
6. LLM response streamed via SSE events:
   - `event: token` → `{ token: "..." }`
   - `event: done` → `{ messageId, sources: [...] }`
7. Assistant message saved to DB

## Document Endpoints

### `GET /api/documents`
Returns list of user's documents with status, type, size.

### `DELETE /api/documents/[id]`
Deletes document + its chunks + chat_document links.

## SSE Stream Format

```
event: token
data: {"token":"Hello"}

event: token
data: {"token":" world"}

event: done
data: {"messageId":"...","sources":[{"documentId":"...","name":"notes.txt","relevance":0.92}]}
```
