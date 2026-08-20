"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/transactions", label: "Transactions", icon: "swap_horiz" },
  { href: "/fund-requests", label: "Fund Requests", icon: "account_balance_wallet" },
  { href: "/reimbursements", label: "Reimbursements", icon: "receipt_long" },
  { href: "/invoices", label: "Invoices", icon: "description" },
  { href: "/reports", label: "Reports", icon: "bar_chart" },
  { href: "/master-data", label: "Master Data", icon: "database" },
  { href: "/inventory", label: "Inventory", icon: "inventory_2" },
  { href: "/user-management", label: "User Management", icon: "group" },
  { href: "/audit-log", label: "Audit Log", icon: "history" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col h-screen w-sidebar-width bg-sidebar text-sidebar-foreground fixed left-0 top-0 border-r border-slate-200 z-20 p-2">
      <div className="px-4 py-6 mb-4 flex items-center gap-3">
        <img className="w-8 h-8 rounded" src="/assets/images/logo-kawung.png" alt="Wawung Finance" />
        <div>
          <h1 className="font-semibold text-primary">Wawung Finance</h1>
          <p className="text-xs text-muted-foreground">Internal Finance Portal</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}