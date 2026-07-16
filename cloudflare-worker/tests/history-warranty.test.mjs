import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { productInlineRows, historyMenuRows, normalizeWarrantyUnitId, maskTransactionId };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

const productRows = worker.productInlineRows(null, [{
  productKey: "outlook_mail",
  name: "Outlook Mail",
  stock: 143,
  inStock: true,
}], "en");
assert.ok(productRows.some((row) => row.some((button) => button.callback_data === "products:stock")));
assert.ok(productRows.some((row) => row.some((button) => button.callback_data === "warranty:start")));

assert.deepEqual(worker.historyMenuRows("en").flat().map((button) => button.callback_data), [
  "history:products",
  "history:recharges",
  "history:purchases",
]);
assert.equal(worker.normalizeWarrantyUnitId("QV-8F3A21C9"), "QV-8F3A21C9");
assert.equal(worker.normalizeWarrantyUnitId("bad!id"), "");
assert.equal(worker.maskTransactionId("ABCD1234"), "••••1234");

assert.match(source, /WHERE orders\.id = \? AND orders\.telegram_id = \?/);
assert.match(source, /INSERT INTO warranty_claims/);
assert.match(source, /status = 'pending'/);

console.log("History and warranty flow checks passed.");
