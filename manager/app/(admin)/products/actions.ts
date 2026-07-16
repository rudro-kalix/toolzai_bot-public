"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

function productKey(value: FormDataEntryValue | null) {
  const key = String(value || "").trim();
  if (!/^[A-Za-z0-9._-]{1,55}$/.test(key)) throw new Error("Product key must be 1–55 characters using only letters, numbers, dots, dashes, and underscores.");
  return key;
}

function refreshProductViews() {
  for (const path of ["/products", "/prices", "/menu", "/dashboard"]) revalidatePath(path);
}

export async function saveLocalProduct(form: FormData) {
  await requireAdmin();
  const priceText = String(form.get("price_bdt") || "").trim();
  const priceBdt = Number(priceText);
  if (!/^\d+$/.test(priceText) || !Number.isSafeInteger(priceBdt) || priceBdt < 1 || priceBdt > 10_000_000) {
    throw new Error("Price must be a whole BDT amount between 1 and 10,000,000.");
  }
  const fields = String(form.get("delivery_fields") || "").split(",").map((field) => field.trim()).filter(Boolean);
  await managerD1("upsertLocalProduct", {
    priceBdt,
    product: {
      productKey: productKey(form.get("product_key")),
      originalProductKey: String(form.get("original_product_key") || "").trim(),
      name: String(form.get("name") || "").trim(),
      description: String(form.get("description") || "").trim(),
      warranty: String(form.get("warranty") || "").trim(),
      deliveryFields: fields,
      allowBulk: form.has("allow_bulk"),
      active: form.has("active"),
      sortOrder: Number(form.get("sort_order") || 0),
    },
  });
  refreshProductViews();
}

export async function addLocalInventory(form: FormData) {
  await requireAdmin();
  const items = String(form.get("inventory_lines") || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!items.length || items.length > 100) throw new Error("Add between 1 and 100 inventory items at a time.");
  await managerD1("addLocalInventory", { productKey: productKey(form.get("product_key")), items });
  refreshProductViews();
}

export async function deleteAvailableInventory(form: FormData) {
  await requireAdmin();
  const key = productKey(form.get("product_key"));
  if (String(form.get("confirm_key") || "").trim() !== key) throw new Error("Type the exact product key to confirm stock deletion.");
  await managerD1("deleteAvailableInventory", { productKey: key });
  refreshProductViews();
}
