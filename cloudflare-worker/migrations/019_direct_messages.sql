CREATE TABLE IF NOT EXISTS direct_messages (
  id TEXT PRIMARY KEY,
  telegram_id INTEGER NOT NULL,
  message_text TEXT NOT NULL,
  button_label TEXT,
  button_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  telegram_message_id INTEGER,
  error_text TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT,
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_created
  ON direct_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_direct_messages_user_created
  ON direct_messages (telegram_id, created_at DESC);
