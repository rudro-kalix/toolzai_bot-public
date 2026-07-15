"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function createMenuButton(form: FormData) {
  await requireAdmin();
  const labelEn = String(form.get("label_en") || "").trim();
  const labelBn = String(form.get("label_bn") || "").trim();
  const actionType = String(form.get("action_type") || "");
  const actionValue = String(form.get("action_value") || "").trim();
  const parentId = Number(form.get("parent_id") || 0) || 0;
  const sortOrder = Number(form.get("sort_order") || 0);
  if (!labelEn || !labelBn || labelEn.length > 40 || labelBn.length > 40) throw new Error("Both labels are required and must be 40 characters or fewer.");
  if (!["message", "url", "submenu"].includes(actionType)) throw new Error("Choose a valid button action.");
  if (actionType === "message" && (!actionValue || actionValue.length > 2_000)) throw new Error("Message buttons need text up to 2,000 characters.");
  if (actionType === "url" && !/^https:\/\//.test(actionValue)) throw new Error("Link buttons need a valid https:// URL.");
  await managerD1("createMenuButton", { labelEn, labelBn, actionType, actionValue, parentId, sortOrder });
  revalidatePath("/menu");
}

export async function deleteMenuButton(form: FormData) {
  await requireAdmin();
  await managerD1("deleteMenuButton", { id: Number(form.get("id")) });
  revalidatePath("/menu");
}
