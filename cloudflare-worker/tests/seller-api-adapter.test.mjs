import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { SELLER_API_DEFAULT_ENDPOINTS, SELLER_API_DEFAULT_MAPPING, validateSellerApiConfig, sellerRequestDescriptor, normalizeSellerResponse, publicSellerApiConfig, encryptSellerApiKey, decryptSellerApiKey };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

const config = worker.validateSellerApiConfig({
  providerName: "Quantum Vault",
  baseUrl: "https://www.quantumvault.me/api/v1",
  authHeader: "X-API-Key",
  authPrefix: "",
  endpoints: worker.SELLER_API_DEFAULT_ENDPOINTS,
  mapping: worker.SELLER_API_DEFAULT_MAPPING,
}, { apiKey: "qv_live_example_key" });

const purchaseRequest = worker.sellerRequestDescriptor(config, "/purchase", {
  productKey: "outlook_mail",
  variantKey: "1_month",
  quantity: 2,
});
assert.equal(purchaseRequest.path, "/purchase");
assert.deepEqual(purchaseRequest.body, { productKey: "outlook_mail", variantKey: "1_month", quantity: 2 });

const products = worker.normalizeSellerResponse({ products: [{
  productKey: "outlook_mail",
  name: "Outlook Mail",
  description: "Fresh Outlook accounts",
  currency: "USD",
  price: 0.25,
  stock: 143,
  inStock: true,
  variants: [],
}] }, "products", config.mapping);
assert.equal(products.products[0].productKey, "outlook_mail");
assert.equal(products.products[0].stock, 143);

const purchase = worker.normalizeSellerResponse({ success: true, order: {
  requested: 1,
  fulfilled: 1,
  items: [{
    orderId: "QV-8F3A21C9",
    fields: [{ name: "email", label: "Email", value: "someone@outlook.com" }],
    data: { email: "someone@outlook.com" },
  }],
} }, "purchase", config.mapping);
assert.equal(purchase.order.orderId, "QV-8F3A21C9");
assert.equal(purchase.order.items[0].fields[0].value, "someone@outlook.com");

const encrypted = await worker.encryptSellerApiKey("qv_live_super_secret", "manager-secret-long-enough");
assert.notEqual(encrypted, "qv_live_super_secret");
assert.equal(await worker.decryptSellerApiKey(encrypted, "manager-secret-long-enough"), "qv_live_super_secret");

const publicConfig = worker.publicSellerApiConfig({ ...config, encryptedApiKey: encrypted, apiKeySource: "manager" });
assert.equal(publicConfig.api_key_configured, true);
assert.equal("apiKey" in publicConfig, false);
assert.equal("encryptedApiKey" in publicConfig, false);

assert.doesNotMatch(source, /escapeHtml\(JSON\.stringify\(order\)\)/);
console.log("Seller API adapter checks passed.");
