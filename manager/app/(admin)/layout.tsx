import { LogOut } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content-shell">
        <div className="topbar"><span>Live operations</span><form action="/api/auth/logout" method="post"><button className="logout" type="submit"><LogOut size={16} /> Sign out</button></form></div>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
