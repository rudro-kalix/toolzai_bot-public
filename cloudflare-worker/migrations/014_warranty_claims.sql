ALTER TABLE user_state ADD COLUMN warranty_order_id INTEGER;
ALTER TABLE user_state ADD COLUMN warranty_unit_id TEXT;

CREATE TABLE IF NOT EXISTS warranty_claims (
  id TEXT PRIMARY KEY,
  telegram_id INTEGER NOT NULL,
  local_order_id INTEGER NOT NULL,
  product_key TEXT NOT NULL,
  provider_order_id TEXT,
  unit_id TEXT,
  issue_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'resolved')),
  admin_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by TEXT,
  FOREIGN KEY (local_order_id) REFERENCES local_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_warranty_claims_user_created ON warranty_claims (telegram_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_warranty_claims_status_created ON warranty_claims (status, created_at DESC);
