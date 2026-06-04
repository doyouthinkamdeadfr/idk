CREATE TABLE IF NOT EXISTS chat (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES user(id),
    title TEXT NOT NULL DEFAULT 'New Chat',
    pinned INTEGER NOT NULL DEFAULT 0,
    archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS message (
    id TEXT PRIMARY KEY NOT NULL,
    chat_id TEXT NOT NULL REFERENCES chat(id),
    user_id TEXT NOT NULL REFERENCES user(id),
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    attachments TEXT,
    sources TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES user(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('file', 'image', 'link')),
    mime TEXT,
    size INTEGER,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'processing' CHECK(status IN ('processing', 'ready', 'error')),
    error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_chunk (
    id TEXT PRIMARY KEY NOT NULL,
    document_id TEXT NOT NULL REFERENCES document(id),
    content TEXT NOT NULL,
    embedding TEXT,
    chunk_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_document (
    chat_id TEXT NOT NULL REFERENCES chat(id),
    document_id TEXT NOT NULL REFERENCES document(id),
    PRIMARY KEY (chat_id, document_id)
);
