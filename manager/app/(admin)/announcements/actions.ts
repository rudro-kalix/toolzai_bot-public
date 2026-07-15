"use server";

import { requireAdmin } from "@/lib/auth";
import { managerD1 } from "@/lib/cloudflare";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(form: FormData) {
  await requireAdmin();
  const messageText = String(form.get("message_text") || "").trim();
  const buttonLabel = String(form.get("button_label") || "").trim();
  const buttonUrl = String(form.get("button_url") || "").trim();
  if (!messageText || messageText.length > 3_500) throw new Error("Announcement must contain 1–3,500 characters.");
  if ((buttonLabel && !buttonUrl) || (!buttonLabel && buttonUrl)) throw new Error("Add both the button label and URL, or leave both empty.");
  if (buttonLabel.length > 64) throw new Error("Button label must be 64 characters or less.");
  if (buttonUrl && !/^https:\/\/[A-Za-z0-9.-]+(?:\/[^\s]*)?$/.test(buttonUrl)) throw new Error("Enter a valid HTTPS button URL.");
  await managerD1("createAnnouncement", { messageText, buttonLabel, buttonUrl });
  revalidatePath("/announcements");
}
