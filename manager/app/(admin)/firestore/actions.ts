"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function collectionName(value: FormDataEntryValue | null) {
  const collection = String(value || "").trim();
  if (!collection || collection.includes("/") || collection.length > 500) throw new Error("Choose a valid Firestore collection.");
  return collection;
}

function documentId(value: FormDataEntryValue | null) {
  const id = String(value || "").trim();
  if (!id || id === "." || id === ".." || id.includes("/") || id.length > 500) throw new Error("Enter a valid document ID without a slash.");
  return id;
}

function destination(collection: string, id?: string, state?: "saved" | "deleted") {
  const query = new URLSearchParams({ collection });
  if (id) query.set("document", id);
  if (state) query.set(state, "1");
  return `/firestore?${query.toString()}`;
}

function list(value: FormDataEntryValue | null) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function firebaseErrorCode(error: unknown) {
  const code = error instanceof Error ? error.message : "firebase_connection_failed";
  const allowed = new Set([
    "firebase_invalid_service_account",
    "firebase_invalid_database",
    "firebase_invalid_collections",
    "firebase_project_confirmation_failed",
    "firebase_credentials_rejected",
    "firebase_connection_failed",
    "firebase_connection_not_found",
    "firebase_invalid_connection",
    "firebase_encryption_not_configured",
  ]);
  return allowed.has(code) ? code : "firebase_connection_failed";
}

export async function switchFirebaseProject(form: FormData) {
  await requireAdmin();
  const serviceAccountText = String(form.get("service_account_json") || "").trim();
  if (!serviceAccountText || serviceAccountText.length > 50_000) redirect("/firestore?config_error=firebase_invalid_service_account");

  let serviceAccount: unknown;
  try { serviceAccount = JSON.parse(serviceAccountText); }
  catch { redirect("/firestore?config_error=firebase_invalid_service_account"); }

  try {
    await managerD1("switchFirebaseProject", {
      serviceAccount,
      confirmProjectId: String(form.get("confirm_project_id") || "").trim(),
      databaseId: String(form.get("database_id") || "(default)").trim(),
      paymentsCollections: list(form.get("payments_collections")),
      claimsCollection: String(form.get("claims_collection") || "transaction_claims").trim(),
      referralsCollection: String(form.get("referrals_collection") || "referrals").trim(),
      managerCollections: list(form.get("manager_collections")),
    });
  } catch (error) {
    redirect(`/firestore?config_error=${firebaseErrorCode(error)}`);
  }
  revalidatePath("/");
  redirect("/firestore?project_switched=1");
}

export async function rollbackFirebaseProject(form: FormData) {
  await requireAdmin();
  const connectionId = Number(form.get("connection_id"));
  const projectId = String(form.get("project_id") || "");
  if (!Number.isSafeInteger(connectionId) || connectionId < 1 || String(form.get("confirm_project_id") || "").trim() !== projectId) {
    redirect("/firestore?config_error=firebase_project_confirmation_failed");
  }
  try { await managerD1("rollbackFirebaseProject", { connectionId }); }
  catch (error) { redirect(`/firestore?config_error=${firebaseErrorCode(error)}`); }
  revalidatePath("/");
  redirect("/firestore?project_rolled_back=1");
}

export async function saveFirestoreDocument(form: FormData) {
  await requireAdmin();
  const collection = collectionName(form.get("collection"));
  const id = documentId(form.get("document_id"));
  const fieldsText = String(form.get("fields_json") || "").trim();
  if (!fieldsText || fieldsText.length > 100_000) throw new Error("Document JSON must contain between 1 and 100,000 characters.");

  let fields: unknown;
  try {
    fields = JSON.parse(fieldsText);
  } catch {
    throw new Error("The document fields are not valid JSON.");
  }
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) throw new Error("Document fields must be a JSON object.");

  await managerD1("saveFirestoreDocument", {
    collection,
    documentId: id,
    fields,
    create: form.get("create") === "1",
    updateTime: String(form.get("update_time") || ""),
  });
  revalidatePath("/firestore");
  redirect(destination(collection, id, "saved"));
}

export async function deleteFirestoreDocument(form: FormData) {
  await requireAdmin();
  const collection = collectionName(form.get("collection"));
  const id = documentId(form.get("document_id"));
  if (String(form.get("confirm_document_id") || "").trim() !== id) throw new Error("Type the exact document ID to confirm deletion.");
  await managerD1("deleteFirestoreDocument", {
    collection,
    documentId: id,
    updateTime: String(form.get("update_time") || ""),
  });
  revalidatePath("/firestore");
  redirect(destination(collection, undefined, "deleted"));
}
