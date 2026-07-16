import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
const exposed = `${source}\nexport { firestoreManagerCollections, requireFirestoreManagerCollection, requireFirestoreDocumentId, firestoreFieldsForWrite, firestoreValue, validateFirebaseProjectInput, encryptFirebaseCredentials, decryptFirebaseCredentials };`;
const worker = await import(`data:text/javascript;base64,${Buffer.from(exposed).toString("base64")}`);

const env = {
  FIREBASE_PAYMENTS_COLLECTION: "transactions,notifications",
  FIREBASE_CLAIMS_COLLECTION: "transaction_claims",
  FIREBASE_REFERRALS_COLLECTION: "referrals",
  FIREBASE_MANAGER_COLLECTIONS: "audit_log,transactions",
};

assert.deepEqual(worker.firestoreManagerCollections(env), [
  "transactions",
  "notifications",
  "transaction_claims",
  "referrals",
  "audit_log",
]);
assert.equal(worker.requireFirestoreManagerCollection(env, "transactions"), "transactions");
assert.throws(() => worker.requireFirestoreManagerCollection(env, "private_collection"), /firestore_invalid_collection/);
assert.equal(worker.requireFirestoreDocumentId("TXN-123"), "TXN-123");
assert.throws(() => worker.requireFirestoreDocumentId("nested/document"), /firestore_invalid_document_id/);

const encoded = worker.firestoreFieldsForWrite({
  transactionId: "TXN-123",
  amount: 500,
  approved: true,
  tags: ["bkash", null],
  metadata: { receivedAt: { $timestamp: "2026-07-16T10:30:00Z" } },
  exactCounter: { $integer: "9007199254740993" },
  specialNumber: { $double: "NaN" },
});
assert.deepEqual(encoded.amount, { integerValue: "500" });
assert.deepEqual(encoded.tags.arrayValue.values[1], { nullValue: null });
assert.deepEqual(encoded.metadata.mapValue.fields.receivedAt, { timestampValue: "2026-07-16T10:30:00Z" });
assert.deepEqual(encoded.exactCounter, { integerValue: "9007199254740993" });
assert.deepEqual(encoded.specialNumber, { doubleValue: "NaN" });
assert.throws(() => worker.firestoreFieldsForWrite({ __name__: "reserved" }), /firestore_invalid_field_name/);

assert.deepEqual(worker.firestoreValue({ timestampValue: "2026-07-16T10:30:00Z" }, true), { $timestamp: "2026-07-16T10:30:00Z" });
assert.deepEqual(worker.firestoreValue({ arrayValue: { values: [{ stringValue: "a" }, { nullValue: null }] } }, true), ["a", null]);

const candidate = worker.validateFirebaseProjectInput({
  serviceAccount: {
    type: "service_account",
    project_id: "replacement-project",
    client_email: "firebase-adminsdk@example.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nTEST\n-----END PRIVATE KEY-----\n",
  },
  databaseId: "(default)",
  paymentsCollections: ["transactions", "notifications"],
  claimsCollection: "transaction_claims",
  referralsCollection: "referrals",
  managerCollections: ["audit_log"],
});
assert.equal(candidate.FIREBASE_PROJECT_ID, "replacement-project");
assert.equal(candidate.FIREBASE_MANAGER_COLLECTIONS, "audit_log");
assert.throws(() => worker.validateFirebaseProjectInput({ serviceAccount: {} }), /firebase_invalid_service_account/);

const encrypted = await worker.encryptFirebaseCredentials({ clientEmail: "admin@example.com", privateKey: "secret" }, "test-encryption-secret");
assert.ok(encrypted.startsWith("v1."));
assert.deepEqual(await worker.decryptFirebaseCredentials(encrypted, "test-encryption-secret"), {
  clientEmail: "admin@example.com",
  privateKey: "secret",
});
await assert.rejects(() => worker.decryptFirebaseCredentials(encrypted, "wrong-secret"), /firebase_invalid_encrypted_config/);

console.log("Firestore manager checks passed.");
