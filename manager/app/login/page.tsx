import { Bot, LockKeyhole, ShieldCheck } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAuthenticated()) redirect("/dashboard");
  const { error } = await searchParams;
  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-icon"><Bot size={28} /></div>
        <span className="eyebrow">Private workspace</span>
        <h1>Welcome back</h1>
        <p>Sign in to monitor and manage your Telegram bot.</p>
        {error && <div className="login-error">Incorrect password. Please try again.</div>}
        <form action="/api/auth/login" method="post" className="login-form">
          <label htmlFor="password">Admin password</label>
          <div className="input-wrap"><LockKeyhole size={18} /><input id="password" name="password" type="password" autoComplete="current-password" required autoFocus /></div>
          <button type="submit">Open dashboard</button>
        </form>
        <div className="secure-note"><ShieldCheck size={16} /> Secured with an encrypted, HTTP-only session.</div>
      </section>
    </main>
  );
}
