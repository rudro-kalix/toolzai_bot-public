# Security policy

## Never commit credentials

Use Cloudflare Worker secrets and Vercel server-side environment variables for all tokens and keys. Never commit Telegram tokens, seller API keys, Firebase service-account keys, manager passwords, session secrets, webhook secrets, payment account numbers, or real database IDs.

If a credential is exposed, remove it from the current code and rotate it immediately. Deleting a Git line does not invalidate a leaked credential or remove it from history.

## Production checklist

- Set a long, unique `MANAGER_API_SECRET`, `SESSION_SECRET`, and dashboard password.
- Keep Firestore closed to anonymous reads and writes; let the Worker use authenticated service-account access.
- Give the Vercel Cloudflare token access only to the required D1 database.
- Restrict admin commands to your Telegram numeric IDs.
- Validate webhook secret headers and use HTTPS endpoints only.
- Keep seller keys encrypted at rest and rotate them periodically.
- Review D1 audit records and failed health checks.

## Reporting a vulnerability

Open a private GitHub security advisory for this repository. Do not publish working exploits, credentials, customer records, or payment data in a public issue.
