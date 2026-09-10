"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

const MENU_GROUPS = [
  {
    title: "DASHBOARD",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/transactions", label: "Transaksi", icon: "swap_horiz" },
      { href: "/reports", label: "Report", icon: "bar_chart" },
      { href: "/master-data", label: "Master Data", icon: "database" },
      { href: "/invoices", label: "Invoices", icon: "description" },
    ]
  },
  {
    title: "REQUEST",
    items: [
      { href: "/fund-requests", label: "Payment Request", icon: "account_balance_wallet" },
      { href: "/reimbursements", label: "Reimbursement", icon: "receipt_long" },
    ]
  },
  {
    title: "INVENTORY",
    items: [
      { href: "/inventory", label: "Inventaris", icon: "inventory_2" },
    ]
  },
  {
    title: "ADMINISTRATION",
    roles: ["superadmin"],
    items: [
      { href: "/user-management", label: "User Management", icon: "group" },
      { href: "/activity-log", label: "Activity Log", icon: "history" },
      { href: "/settings", label: "Settings", icon: "settings" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("superadmin");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/1');
        if (res.data && res.data.role) {
          setUserRole(res.data.role);
        }
      } catch (e) {
        console.error("Failed to fetch user in sidebar", e);
      }
    };
    
    fetchUser();
    
    const handleUpdate = () => fetchUser();
    window.addEventListener('userProfileUpdated', handleUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleUpdate);
  }, []);

  return (
    <nav className="hidden md:flex flex-col h-screen w-sidebar-width bg-sidebar text-sidebar-foreground fixed left-0 top-0 border-r border-slate-200 z-20 p-2">
      <div className="px-4 py-6 mb-4 flex items-center gap-3">
        <img className="w-8 h-8 rounded" src="/assets/images/logo-kawung.png" alt="Wawung Finance" />
        <div>
          <h1 className="font-semibold text-primary">Wawung Finance</h1>
          <p className="text-xs text-muted-foreground">Internal Finance Portal</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-4">
        {MENU_GROUPS.map((group, index) => {
          // If group has roles restriction and current user role is not in it, hide group
          if (group.roles && !group.roles.includes(userRole)) {
            return null;
          }
          
          return (
            <div key={index} className="space-y-1">
              {group.title && (
                <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const active = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      active
                        ? "bg-rose-50 text-rose-800 font-semibold"
                        : "text-slate-500 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </nav>
  );
}