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
