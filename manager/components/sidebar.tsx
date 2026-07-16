"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BadgeDollarSign, Bot, Boxes, Database, Gauge, ListTree, Megaphone, MessageSquareText, PackagePlus, PlugZap, ReceiptText, Tags, Users, Waypoints } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: Gauge },
  { href: "/users", label: "Users", icon: Users },
  { href: "/payments", label: "Payments", icon: BadgeDollarSign },
  { href: "/firestore", label: "Firestore data", icon: Database },
  { href: "/orders", label: "Orders", icon: ReceiptText },
  { href: "/products", label: "Products & stock", icon: PackagePlus },
  { href: "/referrals", label: "Referrals", icon: Waypoints },
  { href: "/announcements", label: "Post", icon: Megaphone },
  { href: "/prices", label: "Prices", icon: Tags },
  { href: "/provider", label: "Seller API", icon: PlugZap },
  { href: "/content", label: "Bot content", icon: MessageSquareText },
  { href: "/menu", label: "Bot menu", icon: ListTree },
  { href: "/health", label: "Bot health", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Bot size={22} /></span><div><strong>ToolzAI</strong><small>Bot manager</small></div></div>
      <nav>
        {links.map(({ href, label, icon: Icon }) => (
          <Link className={pathname === href ? "nav-link active" : "nav-link"} href={href} key={href}>
            <Icon size={18} /><span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-foot"><Boxes size={16} /><span>Private control panel</span></div>
    </aside>
  );
}
