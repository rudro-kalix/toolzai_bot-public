CREATE TABLE IF NOT EXISTS product_prices (
  product_key TEXT NOT NULL,
  variant_key TEXT NOT NULL DEFAULT '',
  price_bdt INTEGER NOT NULL CHECK (price_bdt > 0),
  updated_by INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_key, variant_key)
);

-- Add your own fixed prices after deployment, through the manager website or SQL.
