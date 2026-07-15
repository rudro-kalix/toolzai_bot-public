# Seller API configuration

The Worker separates the bot from the seller's API contract. When a seller changes its domain, endpoints, authentication, request field names, or response structure, update the adapter from the manager's **Seller API** page instead of editing and redeploying the Worker.

## Safe update process

1. Read the seller's current API documentation.
2. Enter the new HTTPS base URL.
3. Set the authentication header, normally `X-API-Key` or `Authorization`.
4. Set an optional prefix such as `Bearer `.
5. Update endpoint paths. Use `{productKey}` in the single-product endpoint.
6. Open **Advanced response mapping** and update JSON paths only when response field names changed.
7. Enter a new API key only when the credential changed. Leaving it blank keeps the saved key.
8. Select **Test and save**. A failed catalog test is not saved.

## Current default contract

```text
GET  /balance
GET  /products
GET  /products/{productKey}
POST /purchase
GET  /orders
```

Single-product purchase body:

```json
{
  "productKey": "example_product",
  "variantKey": "optional_variant",
  "quantity": 1
}
```

Expected purchase delivery structure:

```json
{
  "order": {
    "items": [
      {
        "orderId": "ORDER-123",
        "fields": [
          { "label": "Account", "value": "delivered-value" }
        ],
        "data": "optional raw delivered value"
      }
    ]
  }
}
```

Dot-separated paths are supported in response mappings. For alternative field names, comma-separated fallbacks can be used, for example `orderId,id`.

## API-key handling

The manager sends a replacement key only during an authorized save. The Worker tests it, encrypts it with AES-GCM, and stores only ciphertext in D1. The API key and ciphertext are never returned to the website. Configure `SELLER_CONFIG_ENCRYPTION_KEY`, or let the Worker derive encryption from `MANAGER_API_SECRET`.
