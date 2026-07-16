# ToolzAI Private Bot Manager

A private, mobile-friendly Next.js dashboard for operating the ToolzAI Telegram bot from Vercel.

## Controls

- Users, usernames, balances, payments, and orders
- Local products, flexible delivery fields, and encrypted stock counts
- Firestore document editing and encrypted whole-project Firebase switching with rollback
- Fixed BDT product prices
- Referral rewards and withdrawal review
- Announcement campaigns
- Editable bot content and real-time menu studio
- Bot, webhook, and Firestore health diagnostics
- No-code seller API configuration with a connection test

The Seller API page changes the supplier base URL, authentication style, endpoint paths, request fields, and JSON response mappings without redeploying the bot. API keys are sent only to the Worker over HTTPS, encrypted there, and never readable from the dashboard afterward.

The Products & stock page creates API-free products and uploads credentials or other digital values. Plaintext stock is sent only to the authenticated Worker and is never returned to the dashboard.

The Firestore page can browse documents or replace the bot's entire Firebase project. A replacement service account is validated before activation, and the previous encrypted connection can be restored from the same page.

## Why Vercel instead of GitHub Pages

GitHub Pages only serves public static files and cannot safely hold admin credentials. This dashboard uses server-side Next.js actions and HTTP-only signed sessions.

## Required Vercel environment variables

```env
ADMIN_PASSWORD=choose-a-strong-password
SESSION_SECRET=at-least-32-random-characters
BOT_WORKER_URL=https://your-worker.workers.dev
MANAGER_API_SECRET=the-same-secret-stored-in-your-worker
TELEGRAM_BOT_TOKEN=optional-for-health-page
FIREBASE_PROJECT_ID=your-firebase-project
```

Do not prefix secrets with `NEXT_PUBLIC_`. The manager no longer needs a seller API key or direct Cloudflare D1 token; it talks to the authenticated Worker manager endpoint.

## Local checks

```bash
npm install
npm run build
npm run dev
```

Keep the manager repository private because it is an administrative application, even though its source contains no credentials.
