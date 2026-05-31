CREATE TABLE IF NOT EXISTS user (
	id TEXT PRIMARY KEY NOT NULL,
	email TEXT NOT NULL UNIQUE,
	email_verified INTEGER NOT NULL DEFAULT 0,
	name TEXT NOT NULL,
	image TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS session (
	id TEXT PRIMARY KEY NOT NULL,
	user_id TEXT NOT NULL REFERENCES user(id),
	expires_at TEXT NOT NULL,
	token TEXT NOT NULL UNIQUE,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL,
	ip_address TEXT,
	user_agent TEXT
);

CREATE TABLE IF NOT EXISTS account (
	id TEXT PRIMARY KEY NOT NULL,
	user_id TEXT NOT NULL REFERENCES user(id),
	account_id TEXT NOT NULL,
	provider_id TEXT NOT NULL,
	access_token TEXT,
	refresh_token TEXT,
	id_token TEXT,
	access_token_expires_at TEXT,
	refresh_token_expires_at TEXT,
	scope TEXT,
	password TEXT,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verification (
	id TEXT PRIMARY KEY NOT NULL,
	identifier TEXT NOT NULL,
	value TEXT NOT NULL,
	expires_at TEXT NOT NULL,
	created_at TEXT NOT NULL,
	updated_at TEXT NOT NULL
);
