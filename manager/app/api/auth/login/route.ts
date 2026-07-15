import { createSessionToken, passwordsMatch, sessionCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  let valid = false;
  try { valid = passwordsMatch(password); } catch { valid = false; }
  if (!valid) return NextResponse.redirect(new URL("/login?error=1", request.url), 303);
  const response = NextResponse.redirect(new URL("/dashboard", request.url), 303);
  response.cookies.set(sessionCookie.name, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: sessionCookie.maxAge,
    priority: "high",
  });
  return response;
}
