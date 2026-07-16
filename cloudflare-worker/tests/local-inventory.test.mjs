import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { parseDeliveryFields, normalizeInventoryItem, validateLocalProduct, encryptInventoryPayload, decryptInventoryPayload, inventoryPayloadFingerprint };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

assert.deepEqual(worker.parseDeliveryFields("Email, Password, Recovery code"), ["Email", "Password", "Recovery code"]);
assert.deepEqual(worker.normalizeInventoryItem("person@example.com|s3cret", ["Email", "Password"]), {
  Email: "person@example.com",
  Password: "s3cret",
});
assert.deepEqual(worker.normalizeInventoryItem('{"Token":"abc","Region":"US"}', ["Value"]), { Token: "abc", Region: "US" });
assert.throws(() => worker.normalizeInventoryItem("only-one-field", ["Email", "Password"]), /invalid_inventory_item/);

const product = worker.validateLocalProduct({
  productKey: "local.outlook",
  name: "Outlook account",
  deliveryFields: ["Email", "Password"],
  allowBulk: true,
  active: true,
});
assert.equal(product.productKey, "local.outlook");
assert.deepEqual(product.deliveryFields, ["Email", "Password"]);

const secret = "inventory-test-secret-long-enough";
const payload = { orderId: "LOCAL-1234", items: [{ data: { Email: "person@example.com", Password: "s3cret" } }] };
const encrypted = await worker.encryptInventoryPayload(payload, secret);
assert.doesNotMatch(encrypted, /person@example\.com|s3cret/);
assert.deepEqual(await worker.decryptInventoryPayload(encrypted, secret), payload);
assert.equal(
  await worker.inventoryPayloadFingerprint({ Password: "s3cret", Email: "person@example.com" }, secret),
  await worker.inventoryPayloadFingerprint({ Email: "person@example.com", Password: "s3cret" }, secret),
);

assert.match(source, /INSERT INTO purchase_guards/);
assert.match(source, /order_fulfillments/);

console.log("Local inventory and encrypted fulfillment checks passed.");
