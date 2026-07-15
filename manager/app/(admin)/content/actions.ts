"use server";

import { requireAdmin } from "@/lib/auth";
import { botContentFields } from "@/lib/bot-content";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function saveBotContent(form: FormData) {
  await requireAdmin();
  const settings: Record<string, string> = {};
  for (const field of botContentFields) {
    const value = String(form.get(field.key) || "").trim();
    if (field.kind === "text" && (value.length < 1 || value.length > 2_000)) throw new Error(`${field.label} must contain 1–2,000 characters.`);
    if (field.kind === "phone" && !/^\d{8,20}$/.test(value)) throw new Error(`${field.label} must contain 8–20 digits.`);
    if (field.kind === "telegram_url" && !/^https:\/\/t\.me\/[A-Za-z0-9_]{5,32}$/.test(value)) throw new Error("Enter a valid Telegram support link.");
    settings[field.key] = value;
  }
  await managerD1("updateBotSettings", { settings });
  revalidatePath("/content");
}
