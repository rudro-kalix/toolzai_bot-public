# Contributing

1. Fork the repository and create a focused branch.
2. Do not use real credentials or customer data in code, tests, logs, screenshots, or fixtures.
3. Run the Worker tests and dry-run deployment check.
4. Explain behavior and security impact in the pull request.

```bash
cd cloudflare-worker
npm ci
npm test
npx wrangler deploy --dry-run --config wrangler.example.toml
```

New seller adapters should preserve the configurable contract and include normalization tests for products, purchases, order IDs, and delivery fields.
