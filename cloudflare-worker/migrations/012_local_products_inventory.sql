ALTER TABLE local_orders ADD COLUMN fulfillment_source TEXT NOT NULL DEFAULT 'api'
  CHECK (fulfillment_source IN ('api', 'local'));

CREATE TABLE IF NOT EXISTS local_products (
  product_key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  warranty TEXT NOT NULL DEFAULT '',
  delivery_fields_json TEXT NOT NULL DEFAULT '["Value"]',
  allow_bulk INTEGER NOT NULL DEFAULT 1 CHECK (allow_bulk IN (0, 1)),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS local_inventory_items (
  id TEXT PRIMARY KEY,
  product_key TEXT NOT NULL,
  encrypted_payload TEXT NOT NULL,
  payload_fingerprint TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'delivered')),
  local_order_id INTEGER,
  delivered_to INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TEXT,
  FOREIGN KEY (product_key) REFERENCES local_products(product_key),
  FOREIGN KEY (local_order_id) REFERENCES local_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_local_inventory_available
  ON local_inventory_items (product_key, status, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_local_inventory_fingerprint
  ON local_inventory_items (product_key, payload_fingerprint) WHERE payload_fingerprint IS NOT NULL;

CREATE TABLE IF NOT EXISTS purchase_guards (
  id TEXT PRIMARY KEY,
  valid INTEGER NOT NULL CHECK (valid = 1)
);

CREATE TABLE IF NOT EXISTS purchase_locks (
  telegram_id INTEGER PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_fulfillments (
  id TEXT PRIMARY KEY,
  local_order_id INTEGER NOT NULL UNIQUE,
  telegram_id INTEGER NOT NULL,
  encrypted_payload TEXT NOT NULL,
  charged_bdt INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  next_attempt_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TEXT,
  FOREIGN KEY (local_order_id) REFERENCES local_orders(id)
);

CREATE INDEX IF NOT EXISTS idx_order_fulfillments_queue
  ON order_fulfillments (status, next_attempt_at, attempts);
