CREATE TABLE IF NOT EXISTS subscription (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES user(id),
    polar_subscription_id TEXT NOT NULL UNIQUE,
    polar_product_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
