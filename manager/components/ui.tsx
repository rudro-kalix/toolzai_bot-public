import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}

export function ErrorPanel({ message }: { message: string }) {
  return <div className="notice danger"><AlertTriangle size={20} /><div><strong>Could not load this data</strong><p>{message}</p></div></div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="empty"><Inbox size={28} /><p>{label}</p></div>;
}

export function StatusPill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return <span className={ok ? "status good" : "status bad"}><i />{children}</span>;
}

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(new Date(value));
}
