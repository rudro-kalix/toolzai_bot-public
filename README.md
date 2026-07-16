# Open-Source Telegram Digital Product Store Bot

An API-based Telegram ecommerce bot for selling and automatically delivering digital products, accounts, license keys, subscriptions, and download links. It runs on Cloudflare Workers and D1, supports fixed customer pricing, payment verification, referrals, withdrawals, announcements, and a responsive Next.js admin dashboard.

## 🚀 Try the live bot

[![Open the live bot](https://img.shields.io/badge/OPEN%20THE%20LIVE%20BOT-%40toolzai__bot-229ED9?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.me/toolzai_bot)

> **✨ Visit [telegram.me/toolzai_bot](https://telegram.me/toolzai_bot) to see the bot in action.**
>
> Browse products, check live stock, make purchases, view recharge history and delivered products, and submit warranty claims.

Keywords: **Telegram shop bot**, **digital product delivery bot**, **API marketplace bot**, **Cloudflare Worker Telegram bot**, **automated digital goods bot**, **Telegram ecommerce**, **D1**, and **Next.js admin dashboard**.

## What is included

- Telegram webhook bot on Cloudflare Workers
- D1 database schema and ordered migrations
- Seller REST API adapter with configurable endpoints and JSON mappings
- Automatic delivery of every purchased item, including bulk quantities
- Fixed BDT product prices controlled from the website or admin commands
- bKash, Nagad, and Upay payment flows with optional private Firestore verification
- Referral rewards, referral dashboard, withdrawal requests, and admin review
- Editable bot messages and menu buttons
- Broadcast announcements
- Responsive, password-protected Next.js manager for Vercel
- Tests that prevent payment amount disclosure and validate seller response mapping

## Architecture

```text
Telegram user
    -> Cloudflare Worker webhook
       -> Cloudflare D1 (users, prices, orders, menus, referrals, settings)
       -> Seller API (catalog, purchase, delivery)
       -> Optional Firestore payment records

Admin browser
    -> Next.js manager on Vercel
       -> authenticated Worker manager API
```

No production token, API key, payment number, Firebase project, D1 ID, or administrator ID is included. You must use your own credentials.

## Quick start

### 1. Create the Worker and database

```bash
cd cloudflare-worker
npm install
npx wrangler login
npx wrangler d1 create digital_product_bot
```

Copy `wrangler.example.toml` to `wrangler.toml`, then replace the zero D1 ID and all example settings with your own values.

### 2. Create the schema

```bash
npx wrangler d1 execute digital_product_bot --remote --file=./schema.sql
```

### 3. Add secrets

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_SECRET_TOKEN
npx wrangler secret put WEBHOOK_SECRET
npx wrangler secret put MANAGER_API_SECRET
npx wrangler secret put QUANTUM_VAULT_API_KEY
```

Firebase secrets are optional unless you enable server-authenticated payment verification:

```bash
npx wrangler secret put FIREBASE_CLIENT_EMAIL
npx wrangler secret put FIREBASE_PRIVATE_KEY
```

Never paste secret values into Git, `wrangler.toml`, client-side JavaScript, screenshots, or issues.

### 4. Test and deploy

```bash
npm test
npx wrangler deploy --dry-run
npx wrangler deploy
TELEGRAM_BOT_TOKEN=your-token node scripts/set-webhook.mjs "https://YOUR-WORKER.workers.dev" "YOUR_WEBHOOK_SECRET"
```

### 5. Deploy the manager

Import the `manager` directory into Vercel. Copy `manager/.env.example` into Vercel environment variables and replace every placeholder. `MANAGER_API_SECRET` must exactly match the Worker secret.

## Update seller documentation without changing code

Open **Seller API** in the manager. You can update the provider name, base URL, authentication header/prefix, endpoint paths, purchase field names, and response JSON paths. The manager tests the catalog before saving. A new API key is encrypted by the Worker before D1 storage and is never returned to the browser.

The included default adapter supports the documented Quantum Vault-style contract:

- `GET /balance`
- `GET /products`
- `GET /products/{productKey}`
- `POST /purchase`
- `GET /orders`

See [Seller API configuration](docs/SELLER_API_CONFIGURATION.md) for mapping examples.

## Security

- Keep the manager private and use long, unique secrets.
- Use Firebase service-account access from the Worker; do not allow public Firestore reads or writes.
- Rotate any token accidentally exposed in a commit, screenshot, log, or chat.
- Use least-privilege Cloudflare and Firebase credentials.
- Read [SECURITY.md](SECURITY.md) before deployment.

## License and contributing

Licensed under the [MIT License](LICENSE). Contributions are welcome through [CONTRIBUTING.md](CONTRIBUTING.md).
