# ToolzAI Cloudflare Worker

Production Telegram webhook for an API-based digital product purchasing bot. It uses Cloudflare Workers, D1, a configurable seller REST API, and optional private Firestore payment verification.

## Install and validate

```bash
npm install
npm test
cp wrangler.example.toml wrangler.toml
npx wrangler deploy --dry-run
```

## Configure your own resources

Create a D1 database, copy `wrangler.example.toml` to the ignored `wrangler.toml`, and replace the example values with your own database ID, admin Telegram ID, support URL, required channel, Firebase project, and seller base URL.

```bash
npx wrangler d1 create your_bot_database
npx wrangler d1 execute your_bot_database --remote --file=./schema.sql
```

Set secrets interactively. Never put their values in source code or `wrangler.toml`.

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_SECRET_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler secret put QUANTUM_VAULT_API_KEY
npx wrangler secret put MANAGER_API_SECRET
npx wrangler secret put FIREBASE_CLIENT_EMAIL
npx wrangler secret put FIREBASE_PRIVATE_KEY
```

`SELLER_CONFIG_ENCRYPTION_KEY` is optional. When omitted, the Worker derives seller-key encryption from `MANAGER_API_SECRET`.

## Database migrations

Existing installations should apply pending migrations in order. The current seller adapter is created by:

```bash
npx wrangler d1 execute your_bot_database --remote --file=./migrations/011_seller_api_config.sql
```

## Seller API adapter

The default adapter follows the current Quantum Vault-style contract:

- `GET /balance`
- `GET /products`
- `GET /products/{productKey}`
- `POST /purchase`
- `GET /orders`

The private manager can update the base URL, authentication header/prefix, endpoints, purchase request fields, and JSON response paths in real time. New API keys are encrypted before D1 storage and are never returned to the website.

## Fixed customer prices

Customer prices are fixed whole-BDT values in D1. Supplier USD prices and profit-margin formulas are not used. Products without a configured customer price cannot be purchased.

Admin commands:

```text
/price_help
/price_set PRODUCT_KEY PRICE_BDT
/price_set PRODUCT_KEY VARIANT_KEY PRICE_BDT
/price_catalog
/prices
/price_remove PRODUCT_KEY
/price_remove PRODUCT_KEY VARIANT_KEY
```

## Deploy and connect Telegram

```bash
npx wrangler deploy
node scripts/set-webhook.mjs "https://YOUR-WORKER.workers.dev" "YOUR_WEBHOOK_SECRET"
```

Do not run the legacy Python polling bot while the webhook is enabled.
