---
tags: [rag, frontend, dashboard]
created: 2026-06-04
updated: 2026-06-04
sources:
  - src/components/dashboard/ChatInput.svelte
  - src/routes/dashboard/+page.svelte
  - src/routes/dashboard/c/[id]/+page.svelte
  - src/components/dashboard/Sidebar.svelte
  - src/routes/dashboard/documents/+page.svelte
  - src/components/dashboard/RecentChatItem.svelte
---

# RAG Frontend Wiring

## ChatInput.svelte — Unified Input

Completely rewritten to support multi-type attachments:

- **+ Menu**: Photos (image/*), Files (.txt/.md), Link (paste URL dialog)
- **Attachment chips**: row above textarea showing added items with X to remove
- **Mic button**: uses Web Speech API (`webkitSpeechRecognition`), appends transcribed text to input
- **Send payload**: `{ text, attachments: [{ type, name, file?, url? }] }` → parent handles FormData creation

## Chat View (New Chat) — `/dashboard/+page.svelte`

Flow:
1. User sends → creates chat via `POST /api/chats`
2. Builds FormData with text + files[] + links
3. `POST /api/chats/[id]/messages` → reads SSE stream
4. Displays tokens as they arrive, shows source chips on done
5. Navigates to `/dashboard/c/[id]` after response

## Chat View (Existing) — `/dashboard/c/[id]/+page.svelte`

- On mount: `GET /api/chats/[id]/messages` → populate history
- On send: `POST /api/chats/[id]/messages` → SSE stream → live tokens
- Source citation chips under assistant messages

## Sidebar.svelte

- Now fetches real chats from `GET /api/chats` on mount
- Pin/archive/delete call API endpoints instead of local state only
- Removed dependency on `mock.ts`

## Documents Page — `/dashboard/documents/+page.svelte`

- Fetches real documents from `GET /api/documents`
- Upload button creates file picker → uploads via temp chat → deletes temp chat
- Shows status indicators (processing/ready/error)
- Delete button on each document

## SSE Stream Helper — `src/lib/sse.ts`

Shared utility for reading SSE event streams with `onToken`, `onDone`, `onError` callbacks.
