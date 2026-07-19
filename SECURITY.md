# Security policy

## Never commit credentials

Store Telegram tokens, Binance keys, seller API keys, webhook secrets, Firebase credentials, and other secrets with `wrangler secret put`. Keep production `wrangler.toml`, `.dev.vars`, `.env` files, local databases, and Wrangler state out of Git.

The Binance API key should be read-only and must not permit trading or withdrawals. Use the smallest permission scope that can read Binance Pay transaction history.

If a credential is exposed in a commit, screenshot, log, issue, or chat, rotate it immediately. Removing a line from the current branch neither invalidates the credential nor erases it from Git history.

## Production checklist

- Restrict admin commands to trusted Telegram numeric IDs.
- Validate Telegram webhook secret headers and use HTTPS endpoints only.
- Keep Binance, Telegram, seller, and Firebase credentials in Cloudflare secrets.
- Prevent an Order ID from being claimed more than once and keep migration `015_binance_pay.sql` applied.
- Give D1, Firebase, and seller credentials the least privileges needed.
- Review Worker logs without recording credentials or payment data.
- Rotate secrets periodically and immediately after suspected exposure.

## Reporting a vulnerability

Open a private GitHub security advisory for this repository. Do not publish working exploits, credentials, customer records, or payment data in a public issue.
