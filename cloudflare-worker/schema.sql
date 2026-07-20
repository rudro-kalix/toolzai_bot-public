CREATE TABLE IF NOT EXISTS users (
  telegram_id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  balance_bdt INTEGER NOT NULL DEFAULT 0,
  human_verified INTEGER NOT NULL DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_state (
  telegram_id INTEGER PRIMARY KEY,
  state TEXT,
  payment_provider TEXT,
  payment_amount_bdt INTEGER,
  bulk_product_key TEXT,
  verify_color TEXT,
  withdrawal_amount_bdt INTEGER,
  warranty_order_id INTEGER,
  warranty_unit_id TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claimed_payments (
  transaction_id TEXT PRIMARY KEY,
  telegram_id INTEGER NOT NULL,
  amount_bdt INTEGER NOT NULL,
  amount_usdt TEXT,
  provider TEXT NOT NULL,
  source_document TEXT,
  claimed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS redeem_codes (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  code_hint TEXT NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  max_redemptions INTEGER NOT NULL DEFAULT 1 CHECK (max_redemptions > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  expires_at TEXT,
  created_by TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS redeem_code_redemptions (
  id TEXT PRIMARY KEY,
  code_id TEXT NOT NULL,
  telegram_id INTEGER NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  redeemed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (code_id, telegram_id),
  FOREIGN KEY (code_id) REFERENCES redeem_codes(id),
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_redeem_codes_created_at ON redeem_codes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_redeem_redemptions_user ON redeem_code_redemptions (telegram_id, redeemed_at DESC);

CREATE TABLE IF NOT EXISTS redeem_attempt_windows (
  telegram_id INTEGER PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS local_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  product_key TEXT NOT NULL,
  variant_key TEXT,
  quantity INTEGER NOT NULL,
  charged_bdt INTEGER NOT NULL,
  provider_order_id TEXT,
  fulfillment_source TEXT NOT NULL DEFAULT 'api' CHECK (fulfillment_source IN ('api', 'local')),
  purchase_key TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_local_orders_telegram_id ON local_orders (telegram_id);

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

CREATE TABLE IF NOT EXISTS referrals (
  referred_id INTEGER PRIMARY KEY,
  referrer_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  notified_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals (referrer_id);

CREATE TABLE IF NOT EXISTS referral_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_order_id INTEGER NOT NULL UNIQUE,
  referred_id INTEGER NOT NULL,
  referrer_id INTEGER NOT NULL,
  reward_bdt INTEGER NOT NULL DEFAULT 100 CHECK (reward_bdt > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer_created ON referral_rewards (referrer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referred ON referral_rewards (referred_id);

CREATE TABLE IF NOT EXISTS referral_withdrawals (
  id TEXT PRIMARY KEY,
  telegram_id INTEGER NOT NULL,
  amount_bdt INTEGER NOT NULL CHECK (amount_bdt > 0),
  bkash_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
  admin_note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_referral_withdrawals_user_created ON referral_withdrawals (telegram_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_withdrawals_status_created ON referral_withdrawals (status, created_at DESC);

CREATE TABLE IF NOT EXISTS announcement_campaigns (
  id TEXT PRIMARY KEY,
  message_text TEXT NOT NULL,
  button_label TEXT,
  button_url TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'completed')),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS announcement_deliveries (
  campaign_id TEXT NOT NULL,
  telegram_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  error_text TEXT,
  started_at TEXT,
  delivered_at TEXT,
  PRIMARY KEY (campaign_id, telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_deliveries_queue ON announcement_deliveries (status, campaign_id, telegram_id);
CREATE INDEX IF NOT EXISTS idx_announcement_campaigns_created ON announcement_campaigns (created_at DESC);

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

CREATE TABLE IF NOT EXISTS payment_lookup_cache (
  transaction_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  amount_bdt INTEGER,
  provider TEXT,
  source_document TEXT,
  cached_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_lookup_cache_expires_at ON payment_lookup_cache (expires_at);

CREATE TABLE IF NOT EXISTS payment_attempt_windows (
  telegram_id INTEGER PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_verification_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER NOT NULL,
  transaction_id TEXT NOT NULL DEFAULT '',
  provider TEXT NOT NULL,
  expected_amount_bdt REAL,
  actual_amount_bdt REAL,
  actual_provider TEXT,
  status TEXT NOT NULL CHECK (status IN ('verified', 'rejected', 'unavailable', 'rate_limited', 'invalid_input')),
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_status_created
  ON payment_verification_attempts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_user_created
  ON payment_verification_attempts (telegram_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_transaction
  ON payment_verification_attempts (transaction_id, created_at DESC);

CREATE TABLE IF NOT EXISTS product_prices (
  product_key TEXT NOT NULL,
  variant_key TEXT NOT NULL DEFAULT '',
  price_bdt INTEGER NOT NULL CHECK (price_bdt > 0),
  updated_by INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_key, variant_key)
);

CREATE TABLE IF NOT EXISTS bot_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_buttons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id INTEGER,
  label_en TEXT NOT NULL UNIQUE,
  label_bn TEXT NOT NULL UNIQUE,
  action_type TEXT NOT NULL CHECK (action_type IN ('message', 'url', 'submenu')),
  action_value TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_drafts (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision INTEGER NOT NULL DEFAULT 0,
  menu_json TEXT NOT NULL,
  updated_by TEXT NOT NULL DEFAULT 'manager',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_versions (
  id TEXT PRIMARY KEY,
  revision INTEGER NOT NULL,
  menu_json TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  active_version_id TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bot_menu_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  version_id TEXT,
  revision INTEGER,
  actor TEXT NOT NULL DEFAULT 'manager',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bot_menu_versions_created_at
  ON bot_menu_versions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bot_menu_audit_created_at
  ON bot_menu_audit (created_at DESC);

CREATE TABLE IF NOT EXISTS seller_api_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  provider_name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  auth_header TEXT NOT NULL,
  auth_prefix TEXT NOT NULL DEFAULT '',
  endpoints_json TEXT NOT NULL,
  mapping_json TEXT NOT NULL,
  encrypted_api_key TEXT,
  updated_by TEXT NOT NULL DEFAULT 'migration',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS firebase_project_connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  database_id TEXT NOT NULL DEFAULT '(default)',
  client_email TEXT NOT NULL,
  encrypted_credentials TEXT NOT NULL,
  payments_collections TEXT NOT NULL,
  claims_collection TEXT NOT NULL,
  referrals_collection TEXT NOT NULL,
  manager_collections TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('active', 'previous', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_firebase_project_connections_active
  ON firebase_project_connections (status)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_firebase_project_connections_activated
  ON firebase_project_connections (activated_at DESC, id DESC);

INSERT OR IGNORE INTO seller_api_config
  (id, provider_name, base_url, auth_header, auth_prefix, endpoints_json, mapping_json)
VALUES
  (
    1,
    'Quantum Vault',
    'https://www.quantumvault.me/api/v1',
    'X-API-Key',
    '',
    '{"balance":"/balance","products":"/products","product":"/products/{productKey}","purchase":"/purchase","orders":"/orders"}',
    '{"products":"products","product":"product","order":"order","productKey":"productKey","productName":"name","productDescription":"description","productWarranty":"warranty","productPrice":"price","productStock":"stock","productInStock":"inStock","variants":"variants","variantKey":"key","variantName":"name","variantPrice":"price","variantStock":"stock","variantInStock":"inStock","requestProductKey":"productKey","requestVariantKey":"variantKey","requestQuantity":"quantity","orderId":"orderId,id","orderRequested":"requested","orderFulfilled":"fulfilled","orderItems":"items","itemOrderId":"orderId,id","itemFields":"fields","itemData":"data","fieldName":"name","fieldLabel":"label","fieldValue":"value","errorMessage":"message,error"}'
  );

INSERT OR IGNORE INTO product_prices (product_key, variant_key, price_bdt, updated_by)
VALUES ('gemini_18_month_link', '', 495, 7587079688);
