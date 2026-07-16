CREATE TABLE IF NOT EXISTS product_prices (
  product_key TEXT NOT NULL,
  variant_key TEXT NOT NULL DEFAULT '',
  price_bdt INTEGER NOT NULL CHECK (price_bdt > 0),
  updated_by INTEGER NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_key, variant_key)
);

INSERT OR IGNORE INTO product_prices (product_key, variant_key, price_bdt, updated_by)
VALUES ('gemini_18_month_link', '', 495, 7587079688);
