---
tags: [rag, database, schema]
created: 2026-06-04
updated: 2026-06-04
sources:
  - src/db/schema.ts
  - migrations/0003_create-rag-tables.sql
---

# RAG Database Schema

Five new tables added to support the RAG feature:

## Tables

### `chat`
Chat sessions per user. Supports pinning and archiving.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| user_id | TEXT FK | References user(id) |
| title | TEXT | Default "New Chat" |
| pinned | INTEGER | 0 or 1 |
| archived | INTEGER | 0 or 1 |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

### `message`
Individual messages within a chat session.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| chat_id | TEXT FK | References chat(id) |
| user_id | TEXT FK | References user(id) |
| role | TEXT | "user" or "assistant" |
| content | TEXT | Message body |
| attachments | TEXT | JSON array of {type, name, documentId?, url?} |
| sources | TEXT | JSON array of {documentId, name, relevance} for RAG citations |
| created_at | TEXT | ISO timestamp |

### `document`
Uploaded files, images, and links indexed for RAG.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| user_id | TEXT FK | References user(id) |
| name | TEXT | Original filename or URL |
| type | TEXT | "file", "image", or "link" |
| mime | TEXT | MIME type |
| size | INTEGER | File size in bytes |
| content | TEXT | Extracted text content |
| status | TEXT | "processing", "ready", or "error" |
| error | TEXT | Error message if processing failed |
| created_at | TEXT | ISO timestamp |
| updated_at | TEXT | ISO timestamp |

### `document_chunk`
Embedded chunks of document content for vector search.

| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| document_id | TEXT FK | References document(id) |
| content | TEXT | Chunk of text |
| embedding | TEXT | Stored as JSON array of floats |
| chunk_index | INTEGER | Position in document |

### `chat_document`
Junction table linking chats to their attached documents.

| Column | Type | Notes |
|--------|------|-------|
| chat_id | TEXT FK | References chat(id) |
| document_id | TEXT FK | References document(id) |
| PK | (chat_id, document_id) | Composite primary key |

## Migration

Created `migrations/0003_create-rag-tables.sql` with all five tables.
